import type { Metadata } from "next";
import layoutWithAuthUser from "@/components/layouts/auth/layout-with-auth-user";
import DuesPage from "@/features/users/pages/dues-page";

export const metadata: Metadata = {
  title: "Iuran Warga",
  description:
    "Pantau status pembayaran dan riwayat iuran warga melalui portal SIWARGA.",
};

function Iuran() {
  return <DuesPage />;
}

export default layoutWithAuthUser(Iuran);
