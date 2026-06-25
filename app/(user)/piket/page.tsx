import type { Metadata } from "next";
import layoutWithAuthUser from "@/components/layouts/auth/layout-with-auth-user";

export const metadata: Metadata = {
  title: "Jadwal Piket",
  description:
    "Akses jadwal piket dan agenda gotong royong warga dari portal SIWARGA.",
};

function Page() {
  return (
    <>
      <div>Coming Soon</div>
    </>
  );
}

export default layoutWithAuthUser(Page);
