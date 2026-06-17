import { Megaphone } from "lucide-react";

export default function AnnouncementPage() {
  return (
    <div className="flex min-h-[80dvh] flex-col items-center justify-center px-8 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary-soft text-primary">
        <Megaphone />
      </div>
      <h1 className="mt-4 text-xl font-extrabold">Pengumuman</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Halaman ini akan segera tersedia.
      </p>
    </div>
  );
}
