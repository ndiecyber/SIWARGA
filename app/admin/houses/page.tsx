import layoutWithAuthAdmin from "@/components/layouts/auth/layout-with-auth-admin";
import HousesPage from "@/features/admin/houses/pages/houses-page";
import prisma from "@/lib/db";
import { connection } from "next/server";

async function Page() {
  await connection();

  const houses = await prisma.house.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      owner: true,
    },
  });

  return <HousesPage houses={houses} />;
}

export default layoutWithAuthAdmin(Page);
