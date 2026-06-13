import HousesIndex from "@/features/admin/houses/pages";
import { connection } from "next/server";

async function Page() {
  await connection();

  return <HousesIndex />;
}

export default Page;
