import type { Metadata } from "next";
import layoutWithAuthUser from "@/components/layouts/auth/layout-with-auth-user";
import DashboardPage from "@/features/users/pages/dashboard-page";

export const metadata: Metadata = {
  title: "Dashboard Warga",
  description:
    "Pantau ringkasan iuran, pengumuman, dan kegiatan warga dari dashboard SIWARGA.",
};

function Page() {
  return <DashboardPage />;
}

export default layoutWithAuthUser(Page);
