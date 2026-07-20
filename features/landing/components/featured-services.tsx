"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Search,
  Coins,
  MessageSquare,
  Phone,
  FileCheck,
} from "lucide-react";

const services = [
  {
    icon: FileText,
    title: "Pengajuan Surat",
    desc: "Buat dan ajukan surat pengantar online dengan mudah.",
  },
  {
    icon: Search,
    title: "Cek Status Surat",
    desc: "Pantau status pengajuan surat Anda secara real-time.",
  },
  {
    icon: Coins,
    title: "Iuran Warga",
    desc: "Informasi tagihan iuran dan riwayat pembayaran secara transparan.",
  },
  {
    icon: MessageSquare,
    title: "Pengaduan",
    desc: "Sampaikan keluhan atau masukan Anda dengan mudah.",
  },
  {
    icon: Phone,
    title: "Kontak Pengurus",
    desc: "Hubungi pengurus RT RW kapan saja jika Anda membutuhkan.",
  },
  {
    icon: FileCheck,
    title: "Dokumen",
    desc: "Akses dokumen penting RT RW kapan saja dan di mana saja.",
  },
];

export default function FeaturedServices() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="layanan" className="py-16 bg-emerald-50/30 border-t border-border/40">
      <div className="container mx-auto max-w-275 px-6">
        
        {/* Header */}
        <div className="mb-12 text-center max-w-3xl mx-auto space-y-2">
          <h2 className="text-3xl font-bold text-primary tracking-tight">
            Layanan Unggulan
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Semua kebutuhan warga dalam satu genggaman
          </p>
        </div>

        {/* Grid of 6 Services */}
        <div className="grid grid-cols-6 gap-1 sm:gap-6">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className={`group flex flex-col items-center text-center p-1 sm:p-6 bg-transparent sm:bg-card rounded-xl sm:rounded-2xl border border-transparent sm:border-border/50 shadow-none sm:shadow-xs hover:shadow-md hover:border-emerald-500/20 hover:-translate-y-1 transition-all duration-300 ${
                  mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                {/* Icon Container */}
                <div className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-emerald-50 text-primary border border-emerald-100 group-hover:bg-primary group-hover:text-white transition-all duration-300 mb-2 sm:mb-4">
                  <Icon className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                </div>

                {/* Service Title */}
                <h3 className="font-bold text-[9px] sm:text-xs md:text-sm text-foreground leading-tight mb-1 sm:mb-2 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>

                {/* Service Description */}
                <p className="text-muted-foreground text-[11px] leading-relaxed hidden sm:block">
                  {service.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
