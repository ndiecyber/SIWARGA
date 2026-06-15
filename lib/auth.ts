import { betterAuth } from "better-auth";

import prisma from "@/lib/db";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin as adminPlugin, username } from "better-auth/plugins";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  user: {
    additionalFields: {
      phoneNumber: {
        type: "string",
        required: true,
        input: true,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [username(), adminPlugin()],
});

export type Session = typeof auth.$Infer.Session;
