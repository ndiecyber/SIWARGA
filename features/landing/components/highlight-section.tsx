"use client";

import { useEffect, useState } from "react";
import {
  Megaphone,
  FileText,
  Users,
  Calendar,
  Coins,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: Megaphone,
    title: "Informasi Terbaru",
    desc: "Dapatkan pengumuman dan informasi penting dari RT RW secara real-time.",
  },
  {
    icon: FileText,
    title: "Surat Menyurat",
    desc: "Ajukan dan lacak surat secara online tanpa repot.",
  },
  {
    icon: Users,
    title: "Layanan Warga",
    desc: "Berbagai layanan warga dalam satu platform yang mudah diakses.",
  },
  {
    icon: Calendar,
    title: "Agenda & Kegiatan",
    desc: "Jadwal kegiatan dan agenda lingkungan selalu update dan terorganisir.",
  },
  {
    icon: Coins,
    title: "Keuangan Transparan",
    desc: "Informasi iuran dan kas RT RW terbuka untuk semua warga.",
  },
  {
    icon: ShieldCheck,
    title: "Aman & Terpercaya",
    desc: "Data Anda aman dengan sistem yang terjamin keamanannya.",
  },
];

export function Highlight() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="features" className="relative z-30 -mt-20 md:-mt-24 bg-transparent">
      <div className="container mx-auto max-w-275 px-6">

        {/* Floating white container card */}
        <div className="bg-card rounded-[28px] border border-border/60 shadow-xl px-4 py-8 md:px-8 md:py-12 hover:shadow-2xl transition-shadow duration-500">
          <div className="grid grid-cols-6 gap-1 sm:gap-4 md:gap-8">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className={`group flex flex-col items-center text-center space-y-2 sm:space-y-3.5 ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                    } transition-all duration-500`}
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
                  {/* Icon Circle */}
                  <div className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-primary text-primary-foreground group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-4.5 w-4.5 sm:h-6 sm:w-6" />
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-[9px] sm:text-xs md:text-sm text-foreground leading-tight group-hover:text-primary transition-colors">
                    {f.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground text-xs leading-relaxed max-w-[150px] mx-auto hidden sm:block">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}