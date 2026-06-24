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
