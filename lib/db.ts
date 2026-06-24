import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

function getPoolUrl(): string {
  const baseUrl = process.env.DATABASE_URL;
  if (!baseUrl) throw new Error("DATABASE_URL is not set");
  // Neon's -pooler endpoint supports prepared statements natively.
  // Do NOT add pgbouncer=true — only add connect_timeout for slow resumes.
  const separator = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${separator}connect_timeout=15`;
}

const adapter = new PrismaPg({
  connectionString: getPoolUrl(),
});

async function withRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      const isTimeout = (error as { code?: string })?.code === "ETIMEDOUT";
      if (isTimeout) {
        await new Promise((r) => setTimeout(r, 2000));
        continue;
      }
      throw error;
    }
  }
  throw new Error("Unreachable");
}

const client = globalForPrisma.prisma || new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "production" ? ["warn", "error"] : ["query", "warn", "error"],
  });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;

// Auto-retry every query on ETIMEDOUT (Neon cold-start) — safe because
// it only retries on timeout, not on constraint violations or other errors.
const prisma = client.$extends({
  query: {
    $allOperations({ args, query }) {
      return withRetry(() => query(args));
    },
  },
});

// Keep Neon compute alive during development (suspends after 5min idle)
if (process.env.NODE_ENV !== "production") {
  const KEEPALIVE_MS = 4 * 60 * 1000;
  const keepalive = setInterval(() => {
    client.$queryRaw`SELECT 1`.catch(() => {});
  }, KEEPALIVE_MS);
  keepalive.unref();
}

export default prisma;
