# Auth & DB Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix Neon cold-start auth failures, add middleware route protection, consolidate DB queries, add repository layer, and migrate DataTable to server-side pagination.

**Architecture:** Edge middleware (`getSessionCookie`) for fast redirect, layout-level `React.cache()` session helpers for full verification, Neon-optimized Prisma pool. Repository layer wraps common query patterns; server actions call repositories, never Prisma directly.

**Tech Stack:** Next.js 16, better-auth 1.6, Prisma 7.8, Neon (pg), TanStack Table, shadcn/ui

## Global Constraints

- All code must work with Next.js 16 (check `node_modules/next/dist/docs/` before writing)
- Keep existing Indonesian locale strings in user-facing messages
- Follow existing naming conventions (PascalCase components, camelCase functions, kebab-case files)
- Generated Prisma client lives in `generated/prisma/` — import from `@/generated/prisma/...`
- Auth lib in `lib/auth.ts` and `lib/auth-client.ts`

---

### Task 1: Optimize Neon Pool Connection

**Files:**
- Modify: `lib/db.ts`

**Interfaces:**
- Consumes: existing `DATABASE_URL` env var (already has `-pooler` suffix)
- Produces: `prisma` singleton with Neon-optimized config

- [ ] **Step 1: Read current db.ts**

Read `lib/db.ts` to confirm current config.

- [ ] **Step 2: Write pool-optimized db.ts**

```ts
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

function getPoolUrl(): string {
  const baseUrl = process.env.DATABASE_URL;
  if (!baseUrl) throw new Error("DATABASE_URL is not set");
  const separator = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${separator}pgbouncer=true&connect_timeout=5`;
}

const adapter = new PrismaPg({
  connectionString: getPoolUrl(),
});

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "production"
        ? ["warn", "error"]
        : ["query", "warn", "error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
```

- [ ] **Step 3: Verify the file compiles**

Run: `npx tsc --noEmit lib/db.ts`
Expected: No type errors.

- [ ] **Step 4: Commit**

```bash
git add lib/db.ts
git commit -m "perf: optimize Prisma pool for Neon cold-start"
```

---

### Task 2: Add Session Helpers to auth.ts

**Files:**
- Modify: `lib/auth.ts`

**Interfaces:**
- Consumes: `auth` from better-auth, `headers()` from next/headers
- Produces: `getSession()`, `requireAdmin()`, `requireUser()` — all wrapped in `React.cache()`

- [ ] **Step 1: Read current auth.ts**

Read `lib/auth.ts` to confirm current content.

- [ ] **Step 2: Add session helpers**

```ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin as adminPlugin, username } from "better-auth/plugins";
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import prisma from "@/lib/db";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  user: {
    additionalFields: {
      phoneNumber: { type: "string", required: true, input: true },
      identificationNumber: { type: "string", required: false, input: true },
      kkUrl: { type: "string", required: false, input: true },
      ktpUrl: { type: "string", required: false, input: true },
      userType: { type: "string", required: false, input: false },
    },
  },
  emailAndPassword: { enabled: true },
  plugins: [username(), adminPlugin()],
});

export type Session = typeof auth.$Infer.Session;

export const getSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
});

export const requireAdmin = cache(async () => {
  const session = await getSession();
  if (!session || session.user.role !== "admin") {
    redirect("/");
  }
  return session;
});

export const requireUser = cache(async () => {
  const session = await getSession();
  if (!session || session.user.role !== "user") {
    redirect("/");
  }
  return session;
});
```

- [ ] **Step 3: Verify compilation**

Run: `npx tsc --noEmit lib/auth.ts`
Expected: No type errors.

- [ ] **Step 4: Commit**

```bash
git add lib/auth.ts
git commit -m "feat(auth): add getSession, requireAdmin, requireUser helpers"
```

---

### Task 3: Create Edge Middleware

**Files:**
- Create: `middleware.ts`

**Interfaces:**
- Consumes: `getSessionCookie` from `better-auth/cookies`
- Produces: route protection at edge — redirects unauthenticated requests

- [ ] **Step 1: Create middleware.ts**

```ts
import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
  "/admin",
  "/dashboard",
  "/iuran",
  "/pengumuman",
  "/piket",
];

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  if (isProtected && !sessionCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|manifest|robots|sitemap).*)",
  ],
};
```

- [ ] **Step 2: Verify compilation**

Run: `npx tsc --noEmit middleware.ts`
Expected: No type errors.

- [ ] **Step 3: Commit**

```bash
git add middleware.ts
git commit -m "feat(auth): add edge middleware with cookie-based session check"
```

---

### Task 4: Rewrite Admin Layout to Use requireAdmin

**Files:**
- Modify: `app/admin/layout.tsx`
- Remove: `components/layouts/auth/layout-with-auth-admin.tsx` (no longer needed)

- [ ] **Step 1: Read current admin layout**

Read `app/admin/layout.tsx` to confirm current content.

- [ ] **Step 2: Rewrite admin layout**

```tsx
import type { Metadata } from "next";
import AdministrationLayout from "@/components/layouts/administration-layout";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: {
    default: "Panel Admin | SIWARGA",
    template: "%s | Admin SIWARGA",
  },
  description:
    "Area internal pengurus RT untuk mengelola data warga, rumah, dan pengumuman lingkungan.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return <AdministrationLayout>{children}</AdministrationLayout>;
}
```

- [ ] **Step 3: Update admin pages that used HOC**

Read `app/admin/page.tsx` — remove the `layoutWithAuthAdmin` import and wrapper. The page component no longer receives `user` prop from HOC since layout handles auth. Replace `user.name` with a `getSession()` call if needed.

Edit `app/admin/page.tsx`:

Remove line: `import layoutWithAuthAdmin from "@/components/layouts/auth/layout-with-auth-admin";`

Change the function signature from:
```tsx
async function Page({ user }: { user: { name: string; email?: string } }) {
```
to:
```tsx
async function Page() {
  const session = await getSession();
  const user = session!.user;
```

Add import: `import { getSession } from "@/lib/auth";`

Change the export from:
```tsx
export default layoutWithAuthAdmin(Page);
```
to:
```tsx
export default Page;
```

- [ ] **Step 4: Delete old HOC file**

Delete `components/layouts/auth/layout-with-auth-admin.tsx`.

- [ ] **Step 5: Update remaining admin pages**

Repeat step 3 pattern for any other admin pages using `layoutWithAuthAdmin(Page)`.

Check: `app/admin/announcement/page.tsx`, `app/admin/fees/page.tsx`, `app/admin/houses/page.tsx`, `app/admin/users/page.tsx`

- [ ] **Step 6: Verify compilation**

Run: `npx tsc --noEmit`
Expected: No type errors.

- [ ] **Step 7: Commit**

```bash
git add app/admin/ components/layouts/auth/layout-with-auth-admin.tsx
git commit -m "feat(auth): migrate admin layout to requireAdmin helper"
```

---

### Task 5: Rewrite User Layout to Use requireUser

**Files:**
- Modify: `app/(user)/layout.tsx`
- Modify: `app/(user)/dashboard/page.tsx`
- Remove: `components/layouts/auth/layout-with-auth-user.tsx`

- [ ] **Step 1: Read current user layout**

Read `app/(user)/layout.tsx` to confirm current content.

- [ ] **Step 2: Rewrite user layout**

```tsx
import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import BottomNavigation from "@/features/users/components/bottom-navigation";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: "Portal Warga | SIWARGA",
    template: "%s | Portal Warga SIWARGA",
  },
  description:
    "Area internal warga untuk melihat iuran, pengumuman, dan aktivitas lingkungan RT.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default async function Layout({ children }: { children: ReactNode }) {
  await requireUser();
  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-2xl flex-col bg-background shadow-[0_0_40px_-10px_oklch(0.4_0.05_270_/_0.08)]">
      <main className="flex-1 pb-2">{children}</main>
      <BottomNavigation />
    </div>
  );
}
```

- [ ] **Step 3: Update user pages**

Read and update `app/(user)/dashboard/page.tsx` — remove `layoutWithAuthUser` wrapper.

- [ ] **Step 4: Delete old HOC file**

Delete `components/layouts/auth/layout-with-auth-user.tsx`.

- [ ] **Step 5: Verify compilation**

Run: `npx tsc --noEmit`
Expected: No type errors.

- [ ] **Step 6: Commit**

```bash
git add app/\(user\)/ components/layouts/auth/layout-with-auth-user.tsx
git commit -m "feat(auth): migrate user layout to requireUser helper"
```

---

### Task 6: Create Error Helper

**Files:**
- Create: `lib/repositories/error.ts`

**Interfaces:**
- Produces: `handleDbError(error: unknown): { success: false; message: string }`

- [ ] **Step 1: Create lib/repositories/error.ts**

```ts
import { Prisma } from "@/generated/prisma/client";

const errorMessages: Record<string, string> = {
  P2002: "Data dengan nilai unik sudah terdaftar.",
  P2025: "Data yang dimaksud tidak ditemukan.",
  P2003: "Data terkait tidak ditemukan.",
  P2014: "Operasi gagal karena melanggar integritas relasi.",
};

export function handleDbError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const message = errorMessages[error.code] || "Terjadi kesalahan database.";
    return { success: false as const, message };
  }

  if (error instanceof Error) {
    return { success: false as const, message: error.message };
  }

  return { success: false as const, message: "Terjadi kesalahan yang tidak diketahui." };
}
```

- [ ] **Step 2: Verify compilation**

Run: `npx tsc --noEmit lib/repositories/error.ts`
Expected: No type errors.

- [ ] **Step 3: Commit**

```bash
git add lib/repositories/error.ts
git commit -m "feat(db): add handleDbError helper"
```

---

### Task 7: Create Pagination Helper

**Files:**
- Create: `lib/repositories/pagination.ts`

**Interfaces:**
- Produces: `paginatedQuery<T>(args)`, `PaginatedResult<T>`, `PaginatedInput`

- [ ] **Step 1: Create lib/repositories/pagination.ts**

```ts
export interface PaginatedInput<TSelect = unknown> {
  page: number;
  pageSize: number;
  filters?: Record<string, unknown>;
  sort?: { field: string; dir: "asc" | "desc" };
  select?: TSelect;
}

export interface PaginatedResult<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function buildPaginationArgs(input: PaginatedInput) {
  const page = Math.max(1, input.page);
  const pageSize = Math.min(Math.max(1, input.pageSize), 100);
  const skip = (page - 1) * pageSize;

  return {
    skip,
    take: pageSize,
    orderBy: input.sort
      ? { [input.sort.field]: input.sort.dir }
      : undefined,
    where: input.filters ?? undefined,
  };
}

export function toPaginatedResult<T>(
  data: T[],
  totalCount: number,
  input: PaginatedInput,
): PaginatedResult<T> {
  return {
    data,
    totalCount,
    page: input.page,
    pageSize: input.pageSize,
    totalPages: Math.ceil(totalCount / input.pageSize),
  };
}
```

- [ ] **Step 2: Verify compilation**

Run: `npx tsc --noEmit lib/repositories/pagination.ts`
Expected: No type errors.

- [ ] **Step 3: Commit**

```bash
git add lib/repositories/pagination.ts
git commit -m "feat(db): add pagination helper"
```

---

### Task 8: Create Repository Files

**Files:**
- Create: `lib/repositories/users.ts`
- Create: `lib/repositories/houses.ts`
- Create: `lib/repositories/payments.ts`
- Create: `lib/repositories/monthly-dues.ts`
- Create: `lib/repositories/announcements.ts`
- Create: `lib/repositories/dashboard.ts`

- [ ] **Step 1: Create lib/repositories/users.ts**

```ts
import prisma from "@/lib/db";
import { handleDbError } from "./error";
import { PaginatedInput, buildPaginationArgs, toPaginatedResult } from "./pagination";

export async function findUserByPhone(phoneNumber: string) {
  return prisma.user.findUnique({ where: { phoneNumber } });
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function createUser(data: Parameters<typeof prisma.user.create>[0]["data"]) {
  try {
    return { success: true as const, data: await prisma.user.create({ data }) };
  } catch (error) {
    return handleDbError(error);
  }
}

export async function updateUser(id: string, data: Parameters<typeof prisma.user.update>[0]["data"]) {
  try {
    return { success: true as const, data: await prisma.user.update({ where: { id }, data }) };
  } catch (error) {
    return handleDbError(error);
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({ where: { id } });
    return { success: true as const, message: "Data warga berhasil dihapus." };
  } catch (error) {
    return handleDbError(error);
  }
}

export async function deleteBatchUsers(ids: string[]) {
  try {
    await prisma.user.deleteMany({ where: { id: { in: ids } } });
    return { success: true as const, message: `${ids.length} warga berhasil dihapus.` };
  } catch (error) {
    return handleDbError(error);
  }
}

export async function searchUsers(search: string, take = 10) {
  return prisma.user.findMany({
    where: { name: { contains: search, mode: "insensitive" } },
    select: { id: true, name: true },
    take,
    orderBy: { name: "asc" },
  });
}

export async function paginateUsers(input: PaginatedInput) {
  const args = buildPaginationArgs(input);
  const [data, totalCount] = await Promise.all([
    prisma.user.findMany(args),
    prisma.user.count({ where: args.where }),
  ]);
  return toPaginatedResult(data, totalCount, input);
}
```

- [ ] **Step 2: Create lib/repositories/houses.ts**

```ts
import prisma from "@/lib/db";
import { handleDbError } from "./error";
import { PaginatedInput, buildPaginationArgs, toPaginatedResult } from "./pagination";

export async function findHouseById(id: string) {
  return prisma.house.findUnique({ where: { id } });
}

export async function createHouse(data: Parameters<typeof prisma.house.create>[0]["data"]) {
  try {
    return { success: true as const, data: await prisma.house.create({ data }) };
  } catch (error) {
    return handleDbError(error);
  }
}

export async function updateHouse(id: string, data: Parameters<typeof prisma.house.update>[0]["data"]) {
  try {
    return { success: true as const, data: await prisma.house.update({ where: { id }, data }) };
  } catch (error) {
    return handleDbError(error);
  }
}

export async function deleteHouse(id: string) {
  try {
    await prisma.house.delete({ where: { id } });
    return { success: true as const, message: "Data rumah berhasil dihapus." };
  } catch (error) {
    return handleDbError(error);
  }
}

export async function deleteBatchHouses(ids: string[]) {
  try {
    await prisma.house.deleteMany({ where: { id: { in: ids } } });
    return { success: true as const, message: `${ids.length} rumah berhasil dihapus.` };
  } catch (error) {
    return handleDbError(error);
  }
}

export async function paginateHouses(input: PaginatedInput) {
  const args = buildPaginationArgs(input);
  const [data, totalCount] = await Promise.all([
    prisma.house.findMany(args),
    prisma.house.count({ where: args.where }),
  ]);
  return toPaginatedResult(data, totalCount, input);
}

export async function getOccupiedHouses() {
  return prisma.house.findMany({
    where: { status: "OCCUPIED" },
    select: { id: true, block: true, houseNumber: true },
  });
}
```

- [ ] **Step 3: Create lib/repositories/payments.ts**

```ts
import prisma from "@/lib/db";
import { handleDbError } from "./error";

export async function createPayment(data: Parameters<typeof prisma.payment.create>[0]["data"]) {
  try {
    return { success: true as const, data: await prisma.payment.create({ data }) };
  } catch (error) {
    return handleDbError(error);
  }
}

export async function getRecentPayments(take = 5) {
  return prisma.payment.findMany({
    take,
    orderBy: { paidAt: "desc" },
    include: {
      monthlyDues: {
        include: {
          house: { include: { owner: true } },
        },
      },
    },
  });
}

export async function getTotalCollectedFunds() {
  const result = await prisma.payment.aggregate({
    where: { status: "SUCCESS" },
    _sum: { amountPaid: true },
  });
  return Number(result._sum.amountPaid || 0);
}
```

- [ ] **Step 4: Create lib/repositories/monthly-dues.ts**

```ts
import prisma from "@/lib/db";
import { handleDbError } from "./error";
import { HouseStatus, MonthlyDuesStatus } from "@/generated/prisma/enums";

const DUES_AMOUNT = 25000;

export async function generateDuesForMonth(month: number, year: number) {
  try {
    const houses = await prisma.house.findMany({
      where: { status: HouseStatus.OCCUPIED },
      select: {
        id: true,
        block: true,
        houseNumber: true,
        residents: {
          select: { createdAt: true },
          orderBy: { createdAt: "asc" },
          take: 1,
        },
      },
    });

    let created = 0;
    let skippedExisting = 0;
    let skippedNotYetResident = 0;

    await prisma.$transaction(async (tx) => {
      for (const house of houses) {
        const existing = await tx.monthlyDues.findUnique({
          where: {
            houseId_month_year: { houseId: house.id, month, year },
          },
        });

        if (existing) {
          skippedExisting++;
          continue;
        }

        const earliestResident = house.residents[0];
        if (earliestResident) {
          const residentDate = earliestResident.createdAt;
          const residentMonth = residentDate.getMonth() + 1;
          const residentYear = residentDate.getFullYear();
          if (year < residentYear || (year === residentYear && month < residentMonth)) {
            skippedNotYetResident++;
            continue;
          }
        }

        await tx.monthlyDues.create({
          data: {
            houseId: house.id,
            amount: DUES_AMOUNT,
            month,
            year,
            dueDate: new Date(year, month, 10),
            status: MonthlyDuesStatus.UNPAID,
          },
        });

        created++;
      }
    });

    return {
      success: true as const,
      message: `Berhasil membuat ${created} tagihan.`,
      data: { created, skipped: skippedExisting + skippedNotYetResident },
    };
  } catch (error) {
    return handleDbError(error);
  }
}

export async function getDuesStats(month: number, year: number) {
  const [paid, unpaid] = await Promise.all([
    prisma.monthlyDues.count({ where: { month, year, status: MonthlyDuesStatus.PAID } }),
    prisma.monthlyDues.count({ where: { month, year, status: MonthlyDuesStatus.UNPAID } }),
  ]);
  return { paid, unpaid, total: paid + unpaid };
}

export async function findMonthlyDues(houseId: string, month: number, year: number) {
  return prisma.monthlyDues.findUnique({
    where: { houseId_month_year: { houseId, month, year } },
  });
}
```

- [ ] **Step 5: Create lib/repositories/announcements.ts**

```ts
import prisma from "@/lib/db";
import { handleDbError } from "./error";
import { PaginatedInput, buildPaginationArgs, toPaginatedResult } from "./pagination";

export async function createAnnouncement(data: Parameters<typeof prisma.announcement.create>[0]["data"]) {
  try {
    return { success: true as const, data: await prisma.announcement.create({ data }) };
  } catch (error) {
    return handleDbError(error);
  }
}

export async function updateAnnouncement(id: number, data: Parameters<typeof prisma.announcement.update>[0]["data"]) {
  try {
    return { success: true as const, data: await prisma.announcement.update({ where: { id }, data }) };
  } catch (error) {
    return handleDbError(error);
  }
}

export async function deleteAnnouncement(id: number) {
  try {
    await prisma.announcement.delete({ where: { id } });
    return { success: true as const, message: "Pengumuman berhasil dihapus." };
  } catch (error) {
    return handleDbError(error);
  }
}

export async function deleteBatchAnnouncements(ids: number[]) {
  try {
    await prisma.announcement.deleteMany({ where: { id: { in: ids } } });
    return { success: true as const, message: `${ids.length} pengumuman berhasil dihapus.` };
  } catch (error) {
    return handleDbError(error);
  }
}

export async function paginateAnnouncements(input: PaginatedInput) {
  const args = buildPaginationArgs(input);
  const [data, totalCount] = await Promise.all([
    prisma.announcement.findMany(args),
    prisma.announcement.count({ where: args.where }),
  ]);
  return toPaginatedResult(data, totalCount, input);
}
```

- [ ] **Step 6: Create lib/repositories/dashboard.ts**

```ts
import prisma from "@/lib/db";
import { getDuesStats, getTotalCollectedFunds } from "./payments";

export async function aggregateDashboardStats() {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const [
    totalResidents,
    totalHouses,
    occupiedHouses,
    vacantHouses,
    totalAnnouncements,
    totalCollected,
    duesStats,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.house.count(),
    prisma.house.count({ where: { status: "OCCUPIED" } }),
    prisma.house.count({ where: { status: "VACANT" } }),
    prisma.announcement.count(),
    getTotalCollectedFunds(),
    getDuesStats(currentMonth, currentYear),
  ]);

  const occupancyPercentage = totalHouses > 0 ? (occupiedHouses / totalHouses) * 100 : 0;
  const duesPaidPercentage = duesStats.total > 0 ? (duesStats.paid / duesStats.total) * 100 : 0;

  return {
    totalResidents,
    totalHouses,
    occupiedHouses,
    vacantHouses,
    totalAnnouncements,
    totalCollectedFunds: totalCollected,
    occupancyPercentage,
    duesStats,
    duesPaidPercentage,
  };
}
```

- [ ] **Step 7: Verify all repository files compile**

Run: `npx tsc --noEmit`
Expected: No type errors.

- [ ] **Step 8: Commit**

```bash
git add lib/repositories/
git commit -m "feat(db): add repository layer for all entities"
```

---

### Task 9: Migrate Admin Dashboard to Repository

**Files:**
- Modify: `app/admin/page.tsx`

- [ ] **Step 1: Read current dashboard page**

Read `app/admin/page.tsx` to see the current inline queries.

- [ ] **Step 2: Replace inline queries with repository call**

Remove all inline `prisma.*` calls at the top of `Page`. Replace with:
```ts
import { aggregateDashboardStats } from "@/lib/repositories/dashboard";

async function Page() {
  const stats = await aggregateDashboardStats();
  // ... use stats properties instead of individual variables
}
```

Update all references:
- `totalResidents` → `stats.totalResidents`
- `totalHouses` → `stats.totalHouses`
- `occupiedHouses` → `stats.occupiedHouses`
- `vacantHouses` → `stats.vacantHouses`
- `totalAnnouncements` → `stats.totalAnnouncements`
- `totalCollectedFunds` → `stats.totalCollectedFunds`
- `occupancyPercentage` → `stats.occupancyPercentage`
- `paidDuesThisMonth` → `stats.duesStats.paid`
- `unpaidDuesThisMonth` → `stats.duesStats.unpaid`
- `duesPaidPercentage` → `stats.duesPaidPercentage`

Also replace the inline `recentPayments` and `recentUsers` queries with the repository versions:
```ts
import { getRecentPayments } from "@/lib/repositories/payments";
const recentPayments = await getRecentPayments(5);
```
```ts
import prisma from "@/lib/db";
// Keep the recent users query inline or move to dashboard repository
const recentUsers = await prisma.user.findMany({ ... });
```

- [ ] **Step 3: Remove unused imports**

Remove `import prisma from "@/lib/db"` if no longer used directly.

- [ ] **Step 4: Verify compilation**

Run: `npx tsc --noEmit`
Expected: No type errors.

- [ ] **Step 5: Commit**

```bash
git add app/admin/page.tsx
git commit -m "perf: consolidate admin dashboard queries via repository"
```

---

### Task 10: Migrate Server Actions to Repositories

**Files:**
- Modify: `features/admin/users/action.ts`
- Modify: `features/admin/houses/actions.ts`
- Modify: `features/admin/fees/actions/generate-dues.ts`
- Modify: `features/admin/fees/actions/mark-as-paid.ts`
- Modify: `app/admin/announcement/actions.ts`

- [ ] **Step 1: Migrate users/action.ts**

Replace all `prisma.user.*` calls with repository calls from `@/lib/repositories/users`. Replace try/catch blocks with `handleDbError`.

Before:
```ts
import prisma from "@/lib/db";
// ... try/catch everywhere
```

After:
```ts
import { findUserByPhone, createUser, updateUser, deleteUser, deleteBatchUsers } from "@/lib/repositories/users";
import { handleDbError } from "@/lib/repositories/error";
```

Replace:
- `prisma.user.findUnique({ where: { phoneNumber } })` → `findUserByPhone(phoneNumber)`
- `prisma.user.update({ where: { id }, data })` → `updateUser(id, data)`
- `prisma.user.delete({ where: { id } })` → `deleteUser(id)`
- `prisma.user.deleteMany({ where: { id: { in: ids } } })` → `deleteBatchUsers(ids)`

- [ ] **Step 2: Migrate houses/actions.ts**

Replace `prisma.house.*` calls with repository calls from `@/lib/repositories/houses`.

- [ ] **Step 3: Migrate fees/actions/generate-dues.ts**

Replace inline logic with `generateDuesForMonth` from `@/lib/repositories/monthly-dues`.

- [ ] **Step 4: Migrate fees/actions/mark-as-paid.ts**

Keep inline (unique payment logic), but replace error handling with `handleDbError`.

- [ ] **Step 5: Verify compilation**

Run: `npx tsc --noEmit`
Expected: No type errors.

- [ ] **Step 6: Commit**

```bash
git add features/admin/ app/admin/announcement/
git commit -m "refactor: migrate server actions to use repository layer"
```

---

### Task 11: Add Transaction Boundaries

**Files:**
- Modify: `features/admin/fees/actions/mark-as-paid.ts`
- Modify: `features/admin/users/action.ts`

- [ ] **Step 1: Wrap mark-as-paid in transaction**

Read `features/admin/fees/actions/mark-as-paid.ts`. Wrap the payment creation + dues update in `prisma.$transaction`.

- [ ] **Step 2: Verify compilation**

Run: `npx tsc --noEmit`
Expected: No type errors.

- [ ] **Step 3: Commit**

```bash
git add features/admin/fees/actions/mark-as-paid.ts
git commit -m "feat(db): add transaction boundary to mark-as-paid"
```

---

### Task 12: Migrate DataTable to Server-Side Pagination

**Files:**
- Modify: `components/shared/data-table/data-table.tsx`
- Modify: `components/shared/data-table/column-helpers.tsx` (if needed)
- Verify: All pages using DataTable (users, houses, fees, announcements)

- [ ] **Step 1: Update DataTable props and logic**

Read `components/shared/data-table/data-table.tsx`.

Update `DataTableProps`:
```ts
export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalCount: number;
  pageCount: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onSortChange?: (sort: { field: string; dir: "asc" | "desc" }) => void;
  onFilterChange?: (filters: Record<string, unknown>) => void;
  filterCategories?: FilterCategory<TData>[];
  sortOptions?: SortOption<TData>[];
  batchActions?: ActionOption<TData>[];
  onRowClick?: (row: TData) => void;
}
```

Replace tanstack pagination usage:
- Remove `getPaginationRowModel` from `useReactTable`
- Remove `initialState: { pagination: { pageSize: 10 } }` from table config
- Add `manualPagination: true`, `pageCount` to table config
- Use `onPageChange` callback instead of `table.setPageIndex()`
- Use `onPageSizeChange` callback instead of `table.setPageSize()`

The pagination UI stays the same (page buttons, page size selector) but fires callbacks instead of mutating internal table state.

- [ ] **Step 2: Update page consumers**

For each page using DataTable (check admin users, houses, fees, announcements pages):

- The parent component now manages `page`, `pageSize`, `sort`, `filter` state
- On mount and on callback change, fetch data via server action with pagination args
- Pass `data`, `totalCount`, `pageCount`, and callbacks to DataTable

- [ ] **Step 3: Verify compilation**

Run: `npx tsc --noEmit`
Expected: No type errors.

- [ ] **Step 4: Commit**

```bash
git add components/shared/data-table/
git commit -m "feat: migrate DataTable to server-side pagination"
```

---

### Task 13: Integration Test

- [ ] **Step 1: Start dev server**

Run: `npm run dev`

- [ ] **Step 2: Test auth flow**

1. Visit `/admin` without being logged in → should redirect to `/`
2. Sign in as admin → should reach admin dashboard
3. Visit `/dashboard` as admin → should redirect to `/admin`
4. Sign out → should redirect to `/` on protected routes

- [ ] **Step 3: Test server actions**

1. Create/edit/delete a user, house, announcement via admin pages
2. Generate fees for a month
3. Mark a fee as paid
4. Verify success messages appear and data persists

- [ ] **Step 4: Test pagination**

1. If enough data exists, navigate through pages in DataTable
2. Verify correct data loads per page

- [ ] **Step 5: Commit any fixes**

```bash
git add -A
git commit -m "fix: address integration issues"
```
