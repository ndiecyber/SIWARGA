import type { Metadata } from "next";
import layoutWithAuthAdmin from "@/components/layouts/auth/layout-with-auth-admin";

export const metadata: Metadata = {
  title: "Dashboard Admin",
  description: "Ringkasan panel admin untuk pengurus RT SIWARGA.",
};

function Page() {
  return (
    <>
      <h1>Admin Page</h1>
    </>
  );
}

export default layoutWithAuthAdmin(Page);
