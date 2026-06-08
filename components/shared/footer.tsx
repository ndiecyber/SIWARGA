import { HouseIcon, MapPin, MessageCircle, Phone } from "lucide-react";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { fraunces } from "@/lib/fonts";

type FooterSectionProps = {
  title: string;
  links: {
    label: string;
    href: string;
  }[];
};

function FooterSection({ title, links }: FooterSectionProps) {
  return (
    <section className="w-full md:pr-16 md:text-nowrap">
      <h2 className="mb-2 text-lg font-bold">{title}</h2>

      <ul className="flex flex-col gap-2 text-sm">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="font-medium text-muted-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Footer() {
  return (
    <footer className="flex flex-col w-full bg-secondary">
      <div className="flex flex-col items-center justify-between w-full gap-12 px-4 py-12 mx-auto md:flex-row max-w-275">
        <div className="flex flex-col gap-2">
          <Link href="/" className="flex items-center gap-2 pr-4">
            <div className="p-2 rounded-md bg-primary text-primary-foreground">
              <HouseIcon size={24} />
            </div>
            <div className="flex flex-col items-start gap-1">
              <h1 className={cn(fraunces.className, "text-xl font-bold")}>
                SIWARGA
              </h1>
              <span className="text-xs font-semibold text-muted-foreground">
                Sistem Informasi Warga
              </span>
            </div>
          </Link>

          <span className="block max-w-sm text-sm text-muted-foreground text-wrap">
            Platform digital administrasi RT 04 Perum Arjamukti Kencana Raya,
            Tasikmalaya. Memudahkan pengelolaan warga, iuran, dan informasi
            lingkungan.
          </span>

          <ul className="flex flex-col gap-1 text-sm">
            <li className="flex items-center space-x-1">
              <MapPin size={16} className="text-primary" />
              <Link href="#" className="font-medium text-muted-foreground">
                Perum Arjamukti Kencana Raya, Tasikmalaya
              </Link>
            </li>
            <li className="flex items-center space-x-1">
              <Phone size={16} className="text-primary" />
              <Link href="#" className="font-medium text-muted-foreground">
                0812-0000-1234 (Ketua RT)
              </Link>
            </li>
            <li className="flex items-center space-x-1">
              <MessageCircle size={16} className="text-primary" />
              <Link href="#" className="font-medium text-muted-foreground">
                WhatsApp RT 04
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col justify-between w-full gap-4 md:w-fit md:flex-row">
          <FooterSection
            title="Navigasi"
            links={[
              { label: "Beranda", href: "#" },
              { label: "Fitur", href: "#" },
              { label: "Modul", href: "#" },
              { label: "FAQ", href: "#" },
            ]}
          />

          <FooterSection
            title="Akses"
            links={[
              { label: "Portal Warga", href: "#" },
              { label: "Panel Admin", href: "#" },
              { label: "Daftar Warga", href: "#" },
            ]}
          />

          <FooterSection
            title="Informasi RT"
            links={[
              { label: "Pengumuman", href: "#" },
              { label: "Jadwal Kegiatan", href: "#" },
              { label: "Kontak Pengurus", href: "#" },
              { label: "Pos Ronda", href: "#" },
            ]}
          />
        </div>
      </div>

      <Separator orientation="horizontal" />

      <div className="flex flex-col w-full px-4 py-4 mx-auto text-sm font-medium max-w-275 md:flex-row md:justify-between text-muted-foreground">
        <span>© 2025 SIWARGA RT 04 Arjamukti. Semua hak dilindungi.</span>
        <span>Dibuat dengan untuk warga</span>
      </div>
    </footer>
  );
}

export default Footer;
