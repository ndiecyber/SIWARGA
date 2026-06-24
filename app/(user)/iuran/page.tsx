import type { Metadata } from "next";
import DuesPage from "@/features/users/pages/dues-page";

export const metadata: Metadata = {
  title: "Iuran Warga",
  description:
    "Pantau status pembayaran dan riwayat iuran warga melalui portal SIWARGA.",
};

export default function Iuran() {
  return <DuesPage />;
}
