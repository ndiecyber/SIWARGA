import layoutWithAuthAdmin from "@/components/layouts/auth/layout-with-auth-admin";
import FeesPage from "@/features/admin/fees/pages/fees-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Iuran",
  description: "Kelola iuran warga dari panel admin SIWARGA.",
};

function Page() {
  return <FeesPage />;
}

export default layoutWithAuthAdmin(Page);
