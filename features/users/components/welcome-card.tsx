import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";

type WelcomeCardProps = {
  name: string;
};

export default function WelcomeCard(props: WelcomeCardProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-sm">
      <div className="absolute -right-5 -top-5 size-24 rounded-full bg-primary/10" />
      <div className="absolute -bottom-8 right-8 size-20 rounded-full bg-muted" />

      <div className="relative flex items-center justify-between">
        <div className="min-w-0 flex-1 space-y-1.5">
          <p className="text-xs font-semibold text-primary">
            Selamat datang kembali 👋
          </p>

          <h2 className="mt-1 text-base font-extrabold leading-tight text-foreground">
            {props.name}
          </h2>

          <p className="mt-1 max-w-64 text-xs leading-4 text-muted-foreground">
            Pantau iuran, pengumuman, dan jadwal kegiatan RT dengan lebih mudah
            melalui SiWarga.
          </p>

          <Button asChild size="sm">
            <Link href="/pengumuman" className="text-xs">
              Lihat Info RT
              <ChevronRight size={12} />
            </Link>
          </Button>
        </div>

        <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Sparkles size={34} strokeWidth={2.3} />
        </div>
      </div>
    </section>
  );
}
