import type { Metadata } from "next";
import AdministrationLayout from "@/components/layouts/administration-layout";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: {
    default: "Panel Admin | SIWARGA",
    template: "%s | Admin SIWARGA",
  },
  description:
    "Area internal pengurus RT untuk mengelola data warga, rumah, dan pengumuman lingkungan.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return <AdministrationLayout>{children}</AdministrationLayout>;
}
