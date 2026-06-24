import { connection } from "next/server";
import { getAnnouncements } from "./actions";
import AnnouncmentPage from "@/features/admin/announcement/pages/announcments-page";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pengumuman | SIWARGA Admin",
  description: "Kelola pengumuman warga perumahan",
};

async function Page() {
  await connection();

  const announcements = await getAnnouncements();
  return <AnnouncmentPage announcements={announcements} />;
}

export default Page;
