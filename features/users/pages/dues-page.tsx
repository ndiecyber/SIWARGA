import { Wallet } from "lucide-react";

export default function DuesPage() {
  return (
    <div className="flex min-h-[80dvh] flex-col items-center justify-center px-8 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary-soft text-primary">
        <Wallet />
      </div>
      <h1 className="mt-4 text-xl font-extrabold">Iuran</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Halaman ini akan segera tersedia.
      </p>
    </div>
  );
}
