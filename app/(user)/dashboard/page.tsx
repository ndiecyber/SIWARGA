import type { Metadata } from "next";
import DashboardPage from "@/features/users/pages/dashboard-page";

export const metadata: Metadata = {
  title: "Dashboard Warga",
  description:
    "Pantau ringkasan iuran, pengumuman, dan kegiatan warga dari dashboard SIWARGA.",
};

export default function Page() {
  return <DashboardPage />;
}
