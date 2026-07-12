import type { Metadata } from "next";
import layoutWithAuthAdmin from "@/components/layouts/auth/layout-with-auth-admin";
import UserPage from "@/features/admin/users/pages/users-page";
import prisma from "@/lib/db";
import { connection } from "next/server";

export const metadata: Metadata = {
  title: "Data Warga",
  description: "Kelola data warga RT 04 Arjamukti dari panel admin SIWARGA.",
};

async function Page() {
  await connection();

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      residentProfile: {
        include: {
          familyMembers: true,
          house: true,
        },
      },
    },
  });

  return <UserPage users={users} />;
}

export default layoutWithAuthAdmin(Page);
