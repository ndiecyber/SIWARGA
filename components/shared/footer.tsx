"use client";

import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";

const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Facebook = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Youtube = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
    <polygon points="10 15 15 12 10 9" />
  </svg>
);

type FooterLink = { label: string; href: string };
type FooterSectionProps = { title: string; links: FooterLink[] };

const navigationLinks: FooterLink[] = [
  { label: "Beranda", href: "#home" },
  { label: "Tentang Kami", href: "#tentang-kami" },
  { label: "Pengurus RT", href: "#pengurus-rt" },
  { label: "Fitur", href: "#features" },
  { label: "Data & Laporan", href: "#data-laporan" },
  { label: "Pengumuman RT", href: "#pengumuman" },
  { label: "Galeri Kegiatan", href: "#galeri" },
];

function handleSmoothScroll(event: React.MouseEvent<HTMLAnchorElement>, href: string) {
  if (!href.startsWith("#")) return;
  event.preventDefault();
  const el = document.getElementById(href.replace("#", ""));
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function FooterSection({ title, links }: FooterSectionProps) {
  return (
    <section className="min-w-0">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
        {title}
      </h2>
      <ul className="space-y-1.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              onClick={(e) => handleSmoothScroll(e, link.href)}
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
              target={link.href.startsWith("#") ? undefined : "_blank"}
              rel={link.href.startsWith("#") ? undefined : "noopener noreferrer"}
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
    <footer className="w-full border-t bg-secondary/60">
      <div className="mx-auto w-full max-w-275 px-4 py-8 md:py-12 md:px-6">

        {/* ── Desktop: 3-col grid | Mobile: stacked ── */}
        <div className="grid grid-cols-1 md:grid-cols-[1.3fr_0.7fr_1fr] gap-6 md:gap-x-12 lg:gap-x-20">

          {/* Col 1: Logo + Desc + Socials */}
          <div className="space-y-3">
            <Link
              href="#home"
              onClick={(e) => handleSmoothScroll(e, "#home")}
              className="inline-flex items-center"
            >
              <Image
                src="/logo/logo-versi-1.png"
                alt="Logo SIWARGA"
                width={172}
                height={172}
                priority
                className="h-auto w-28 md:w-36"
              />
            </Link>

            <p className="text-xs leading-6 text-muted-foreground">
              SIWARGA adalah platform digital administrasi RT 04 Perum Arjamukti Kencana Raya, Tasikmalaya — memudahkan pengelolaan data warga, iuran, dan informasi lingkungan secara transparan.
            </p>

            <p className="text-[11px] text-muted-foreground/75 leading-relaxed">
              Kec. Leuwisari, Kabupaten Tasikmalaya, Jawa Barat
            </p>

            <div className="flex gap-2 pt-1">
              {[
                { icon: Phone, href: "https://wa.me/6285320132014", label: "Handphone" },
                { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
                { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
                { icon: Youtube, href: "https://youtube.com", label: "Youtube" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border/80 bg-background/50 text-muted-foreground hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-300"
                >
                  <s.icon className="size-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Mobile: Navigasi + Kontak side-by-side | Desktop: separate cols */}
          {/* Mobile row */}
          <div className="grid grid-cols-2 gap-6 md:contents">

            {/* Col 2: Navigation */}
            <FooterSection title="Navigasi" links={navigationLinks} />

            {/* Col 3: Contacts */}
            <section className="min-w-0">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                Kontak
              </h2>

              <ul className="space-y-3">
                <li className="flex items-start gap-2.5 text-xs text-muted-foreground">
                  <MapPin className="mt-0.5 size-3.5 shrink-0 text-primary" />
                  <div className="flex flex-col gap-1.5">
                    <span className="leading-relaxed">Perum Arjamukti Kencana Raya, Tasikmalaya</span>
                    <a
                      href="https://maps.google.com/?q=Perum+Arjamukti+Kencana+Raya+Tasikmalaya"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1 rounded-md border border-border/80 bg-background/50 hover:bg-primary/5 hover:border-primary/20 px-2.5 py-1 text-[10px] font-semibold text-foreground hover:text-primary transition-all duration-300 w-fit"
                    >
                      Buka Maps
                    </a>
                  </div>
                </li>

                <li className="flex items-center gap-2.5 text-xs text-muted-foreground">
                  <Phone className="size-3.5 shrink-0 text-primary" />
                  <a href="tel:085320132014" className="font-medium hover:text-primary transition-colors">
                    +62 853-2013-2014
                  </a>
                </li>

                <li className="flex items-center gap-2.5 text-xs text-muted-foreground">
                  <Mail className="size-3.5 shrink-0 text-primary" />
                  <a href="mailto:arjamukti.rt04@gmail.com" className="font-medium hover:text-primary transition-colors break-all">
                    arjamukti.rt04@gmail.com
                  </a>
                </li>

                <li className="flex items-center gap-2.5 text-xs text-muted-foreground">
                  <Clock className="size-3.5 shrink-0 text-primary" />
                  <span>Pelayanan Warga 24 Jam</span>
                </li>
              </ul>
            </section>

          </div>
        </div>
      </div>

      <Separator />

      <div className="mx-auto flex w-full max-w-275 flex-col gap-1 px-4 py-4 text-[11px] font-medium text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6">
        <span>© 2026 SIWARGA RT 04 Arjamukti. Semua hak dilindungi.</span>
        <span className="text-muted-foreground/70">Dibuat untuk membantu administrasi warga.</span>
      </div>
    </footer>
  );
}

export default Footer;