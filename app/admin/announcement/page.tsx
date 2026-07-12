import { Metadata } from "next";

import { connection } from "next/server";
import layoutWithAuthAdmin from "@/components/layouts/auth/layout-with-auth-admin";
import AnnouncementPage from "@/features/admin/announcement/pages/announcements-page";

import { getAnnouncements } from "./actions";

export const metadata: Metadata = {
  title: "Pengumuman | SIWARGA Admin",
  description: "Kelola pengumuman warga perumahan",
};

async function Page() {
  await connection();

  const announcements = await getAnnouncements();
  return <AnnouncementPage announcements={announcements} />;
}

export default layoutWithAuthAdmin(Page);
