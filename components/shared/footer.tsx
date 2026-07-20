"use client";

import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Facebook = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Youtube = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
    <polygon points="10 15 15 12 10 9" />
  </svg>
);

const Whatsapp = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

function handleSmoothScroll(event: React.MouseEvent<HTMLAnchorElement>, href: string) {
  if (!href.startsWith("#")) return;
  event.preventDefault();
  const el = document.getElementById(href.replace("#", ""));
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Footer() {
  return (
    <footer className="w-full bg-[#042817] text-white/95 border-t border-emerald-950">
      <div className="mx-auto w-full max-w-275 px-6 py-12 md:py-16">

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* Col 1: Logo + Desc + Socials (SPAN 4) */}
          <div className="col-span-2 md:col-span-2 lg:col-span-4 space-y-4">
            <Link
              href="#home"
              onClick={(e) => handleSmoothScroll(e, "#home")}
              className="inline-flex items-center"
            >
              <Image
                src="/logo/logo-versi-1.png"
                alt="Logo SIWARGA"
                width={150}
                height={40}
                priority
                className="h-auto w-36 brightness-0 invert object-contain"
              />
            </Link>

            <p className="text-xs leading-relaxed text-emerald-100/70 max-w-sm">
              Platform digital untuk mendukung pelayanan, informasi, dan partisipasi warga dalam membangun lingkungan yang lebih baik.
            </p>

            <div className="flex gap-3 pt-2">
              {[
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Whatsapp, href: "#", label: "Whatsapp" },
                { icon: Youtube, href: "#", label: "Youtube" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-emerald-100/80 hover:bg-white hover:text-[#042817] hover:border-white transition-all duration-300"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Navigasi (SPAN 2) */}
          <div className="col-span-1 lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-300">
              Navigasi
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Beranda", href: "#home" },
                { label: "Layanan", href: "#layanan" },
                { label: "Informasi", href: "#features" },
                { label: "Pengumuman", href: "#pengumuman" },
                { label: "Agenda", href: "#agenda" },
                { label: "Tentang", href: "#tentang-kami" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={(e) => handleSmoothScroll(e, link.href)}
                    className="text-xs font-medium text-emerald-100/75 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Layanan (SPAN 2) */}
          <div className="col-span-1 lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-300">
              Layanan
            </h3>
            <ul className="space-y-2">
              {[
                "Pengajuan Surat",
                "Cek Status Surat",
                "Iuran Warga",
                "Pengaduan",
                "Kontak Pengurus",
                "Dokumen",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#layanan"
                    className="text-xs font-medium text-emerald-100/75 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Informasi (SPAN 2) */}
          <div className="col-span-1 lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-300">
              Informasi
            </h3>
            <ul className="space-y-2">
              {[
                "Berita",
                "Galeri Kegiatan",
                "Peraturan",
                "Panduan",
                "FAQ",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#features"
                    className="text-xs font-medium text-emerald-100/75 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Hubungi Kami (SPAN 2) */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-300">
              Hubungi Kami
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-xs text-emerald-100/75">
                <MapPin className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                <span>Jl. Contoh No. 123 Kelurahan Contoh, Kecamatan Contoh Kota Contoh, 12345</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-emerald-100/75">
                <Phone className="h-4 w-4 shrink-0 text-emerald-400" />
                <a href="tel:081234567890" className="hover:text-white transition-colors">
                  0812-3456-7890
                </a>
              </li>
              <li className="flex items-center gap-2 text-xs text-emerald-100/75">
                <Mail className="h-4 w-4 shrink-0 text-emerald-400" />
                <a href="mailto:info@rtrw-sistem.id" className="hover:text-white transition-colors break-all">
                  info@rtrw-sistem.id
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-8" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium text-emerald-100/50">
          <span>© 2024 Sistem Informasi RT RW. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;