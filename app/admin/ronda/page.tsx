import { connection } from "next/server";
import { getRondaSchedule, getEligibleUsers } from "./actions";
import RondaPage from "@/features/admin/ronda/pages/ronda-page";
import layoutWithAuthAdmin from "@/components/layouts/auth/layout-with-auth-admin";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jadwal Ronda | SIWARGA Admin",
  description: "Kelola jadwal ronda malam warga perumahan",
};

async function Page() {
  await connection();

  const [rondaSchedule, eligibleUsers] = await Promise.all([
    getRondaSchedule(),
    getEligibleUsers(),
  ]);

  return (
    <RondaPage
      initialSchedule={rondaSchedule}
      eligibleUsers={eligibleUsers}
    />
  );
}

export default layoutWithAuthAdmin(Page);
