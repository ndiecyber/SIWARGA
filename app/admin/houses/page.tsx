import type { Metadata } from "next";
import layoutWithAuthAdmin from "@/components/layouts/auth/layout-with-auth-admin";
import HousesPage from "@/features/admin/houses/pages/houses-page";
import prisma from "@/lib/db";
import { connection } from "next/server";

export const metadata: Metadata = {
  title: "Data Rumah",
  description:
    "Kelola data rumah dan kepemilikan warga dari panel admin SIWARGA.",
};

async function Page() {
  await connection();

  const houses = await prisma.house.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      owner: true,
      residents: {
        include: {
          user: true,
        },
      },
    },
  });

  return <HousesPage houses={houses} />;
}

export default layoutWithAuthAdmin(Page);
