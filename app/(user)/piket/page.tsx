import type { Metadata } from "next";
import layoutWithAuthUser from "@/components/layouts/auth/layout-with-auth-user";
import PatrolPage from "@/features/users/pages/announcement-page copy";

export const metadata: Metadata = {
  title: "Jadwal Piket",
  description:
    "Akses jadwal piket dan agenda gotong royong warga dari portal SIWARGA.",
};

function Page() {
  return <PatrolPage />;
}

export default layoutWithAuthUser(Page);
