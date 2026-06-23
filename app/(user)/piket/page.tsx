import type { Metadata } from "next";
import PatrolPage from "@/features/users/pages/announcement-page copy";

export const metadata: Metadata = {
  title: "Jadwal Piket",
  description:
    "Akses jadwal piket dan agenda gotong royong warga dari portal SIWARGA.",
};

export default function Page() {
  return <PatrolPage />;
}
