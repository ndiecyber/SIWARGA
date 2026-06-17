import type { Metadata } from "next";
import AdministrationLayout from "@/components/layouts/administration-layout";
import layoutWithAuthAdmin, {
  LayoutWithAuthAdminProps,
} from "@/components/layouts/auth/layout-with-auth-admin";

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

function Layout({
  children,
}: LayoutWithAuthAdminProps & { children: React.ReactNode }) {
  return <AdministrationLayout>{children}</AdministrationLayout>;
}

export default layoutWithAuthAdmin(Layout);
