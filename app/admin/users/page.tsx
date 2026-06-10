import UserPage from "@/features/admin/users/pages/users-page";
import prisma from "@/lib/db";

async function Page() {
  const users = await prisma.user.findMany({});

  return <UserPage users={users} />;
}

export default Page;
