import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fraunces } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { Home, ShieldCheck, UserRoundPlus } from "lucide-react";

function ContactLanding() {
  return (
    <section className="flex flex-col items-center justify-center w-full gap-6 px-6 py-16 bg-primary text-primary-foreground md:px-0">
      <Badge className="inline-flex items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold uppercase tracking-tight bg-secondary/25 text-white">
        <Home /> <span>Kata Warga</span>
      </Badge>

      <div
        className={cn(
          fraunces.className,
          "text-5xl font-bold leading-16 text-center",
        )}
      >
        <h1>Warga RT 04?</h1>
        <h1 className="opacity-85">Daftarkan Diri Anda</h1>
      </div>
      <span className="text-center text-wrap opacity-85">
        Akses informasi RT, pantau iuran, dan tetap terhubung dengan
        <br /> komunitas perumahan Anda.
      </span>

      <div
        role="group"
        className="flex flex-col items-center gap-2 text-semibold md:flex-row justify-baseline"
      >
        <Button variant="secondary" size="lg">
          <UserRoundPlus className="mr-2" />
          <span>Daftar Sebagai Warga</span>
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="bg-transparent outline-1 outline-primary"
        >
          <ShieldCheck className="mr-2" />
          <span>Masuk Admin</span>
        </Button>
      </div>
    </section>
  );
}

export default ContactLanding;
