import HousesPage from "@/features/admin/houses/pages/houses-page";
import { connection } from "next/server";

async function Page() {
  await connection();

  return <HousesPage />;
}

export default Page;
