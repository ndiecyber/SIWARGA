import AnnouncmentPage from "@/features/admin/pages/announcments-page";
import { getAnnouncements } from "./actions";

export const metadata = {
  title: "Pengumuman | SIWARGA Admin",
  description: "Kelola pengumuman warga perumahan",
};

async function Page() {
  const announcements = await getAnnouncements();
  return <AnnouncmentPage announcements={announcements} />;
}

export default Page;
