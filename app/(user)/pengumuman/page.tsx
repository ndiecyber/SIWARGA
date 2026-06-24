import type { Metadata } from "next";
import AnnouncementPage from "@/features/users/pages/announcement-page";

export const metadata: Metadata = {
  title: "Pengumuman Warga",
  description:
    "Lihat pengumuman terbaru dan informasi penting lingkungan melalui portal warga SIWARGA.",
};

export default function Page() {
  return <AnnouncementPage />;
}
