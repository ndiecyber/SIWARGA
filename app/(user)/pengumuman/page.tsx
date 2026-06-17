import type { Metadata } from "next";
import layoutWithAuthUser from "@/components/layouts/auth/layout-with-auth-user";
import AnnouncementPage from "@/features/users/pages/announcement-page";

export const metadata: Metadata = {
  title: "Pengumuman Warga",
  description:
    "Lihat pengumuman terbaru dan informasi penting lingkungan melalui portal warga SIWARGA.",
};

function Page() {
  return <AnnouncementPage />;
}

export default layoutWithAuthUser(Page);
