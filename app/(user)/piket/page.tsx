import type { Metadata } from "next";
import layoutWithAuthUser from "@/components/layouts/auth/layout-with-auth-user";
import { Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Jadwal Piket",
  description:
    "Akses jadwal piket dan agenda gotong royong warga dari portal SIWARGA.",
};

function Page() {
  return (
    <div className="flex min-h-[80dvh] flex-col items-center justify-center px-8 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
        <Shield />
      </div>
      <h1 className="mt-4 text-xl font-extrabold font-sans">Jadwal Piket Warga</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Jadwal piket warga sedang dipersiapkan dan segera hadir.
      </p>
    </div>
  );
}

export default layoutWithAuthUser(Page);
