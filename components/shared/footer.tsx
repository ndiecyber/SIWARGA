"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, MessageCircle, Phone } from "lucide-react";

import { Separator } from "@/components/ui/separator";

type FooterLink = {
  label: string;
  href: string;
};

type FooterSectionProps = {
  title: string;
  links: FooterLink[];
};

const navigationLinks: FooterLink[] = [
  {
    label: "Beranda",
    href: "#home",
  },
  {
    label: "Fitur",
    href: "#features",
  },
  {
    label: "Cara Kerja",
    href: "#how-it-works",
  },
  {
    label: "Modul",
    href: "#modules",
  },
  {
    label: "Testimoni",
    href: "#testimonials",
  },
  {
    label: "FAQ",
    href: "#faq",
  },
  {
    label: "Kontak",
    href: "#contact",
  },
];

const accessLinks: FooterLink[] = [
  {
    label: "Sign-in",
    href: "/login",
  },
  {
    label: "Register",
    href: "/register",
  },
];

const informationLinks: FooterLink[] = [
  {
    label: "Informasi Warga",
    href: "#features",
  },
  {
    label: "Iuran Bulanan",
    href: "#modules",
  },
  {
    label: "Pengumuman RT",
    href: "#modules",
  },
  {
    label: "Kontak Pengurus",
    href: "#contact",
  },
];

function handleSmoothScroll(
  event: React.MouseEvent<HTMLAnchorElement>,
  href: string,
) {
  if (!href.startsWith("#")) return;

  event.preventDefault();

  const targetId = href.replace("#", "");
  const targetElement = document.getElementById(targetId);

  if (!targetElement) return;

  targetElement.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function FooterSection({ title, links }: FooterSectionProps) {
  return (
    <section className="min-w-0">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
        {title}
      </h2>

      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              onClick={(event) => handleSmoothScroll(event, link.href)}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
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
      <div className="mx-auto grid w-full max-w-275 gap-10 px-4 py-12 md:grid-cols-[1.3fr_1fr] md:px-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="max-w-md">
          <Link
            href="#home"
            onClick={(event) => handleSmoothScroll(event, "#home")}
            className="mb-4 inline-flex items-center"
          >
            <Image
              src="/logo/logo-versi-1.png"
              alt="Logo SIWARGA"
              width={172}
              height={172}
              priority
              className="h-auto w-36 md:w-40"
            />
          </Link>

          <p className="text-sm leading-7 text-muted-foreground">
            Platform digital administrasi RT 04 Perum Arjamukti Kencana Raya,
            Tasikmalaya. Memudahkan pengelolaan data warga, iuran bulanan, dan
            informasi lingkungan secara lebih rapi dan transparan.
          </p>

          <ul className="mt-6 space-y-3 text-sm">
            <li className="flex items-start gap-3 text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>Perum Arjamukti Kencana Raya, Tasikmalaya</span>
            </li>

            <li className="flex items-start gap-3 text-muted-foreground">
              <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>0812-0000-1234 Ketua RT</span>
            </li>

            <li className="flex items-start gap-3 text-muted-foreground">
              <MessageCircle className="mt-0.5 size-4 shrink-0 text-primary" />
              <Link
                href="#contact"
                onClick={(event) => handleSmoothScroll(event, "#contact")}
                className="font-medium transition-colors hover:text-primary"
              >
                WhatsApp RT 04
              </Link>
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <FooterSection title="Navigasi" links={navigationLinks} />
          {/* <FooterSection title="Akses" links={accessLinks} /> */}
          <FooterSection title="Informasi RT" links={informationLinks} />
        </div>
      </div>

      <Separator />

      <div className="mx-auto flex w-full max-w-275 flex-col gap-2 px-4 py-5 text-sm font-medium text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6">
        <span>© 2026 SIWARGA RT 04 Arjamukti. Semua hak dilindungi.</span>
        <span>Dibuat untuk membantu administrasi warga.</span>
      </div>
    </footer>
  );
}

export default Footer;
