"use client";

import { useEffect, useRef, useState } from "react";
import {
  Banknote,
  Users,
  Map,
  Megaphone,
  FileBarChart2,
  Bell,
} from "lucide-react";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

const features = [
  {
    icon: Banknote,
    title: "Kelola Iuran",
    desc: "Catat dan pantau pembayaran iuran bulanan setiap rumah secara real-time. Status langsung diperbarui.",
    tag: "Otomatis",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    tagBg: "bg-primary/10",
    tagColor: "text-primary",
    accentColor: "bg-primary",
  },
  {
    icon: Users,
    title: "Data Warga & KK",
    desc: "Database warga lengkap dengan detail Kartu Keluarga, NIK, dan informasi kontak yang mudah diakses.",
    tag: "Terstruktur",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-700",
    tagBg: "bg-blue-100",
    tagColor: "text-blue-700",
    accentColor: "bg-primary",
  },
  {
    icon: Map,
    title: "Peta Blok Visual",
    desc: "Visualisasi status iuran setiap rumah dalam peta blok interaktif. Langsung terlihat siapa yang lunas dan menunggak.",
    tag: "Interaktif",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-700",
    tagBg: "bg-violet-100",
    tagColor: "text-violet-700",
    accentColor: "bg-primary",
  },
  {
    icon: Megaphone,
    title: "Pengumuman RT",
    desc: "Publikasikan informasi kegiatan, keamanan, dan pemberitahuan penting langsung ke seluruh warga.",
    tag: "Real-time",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-700",
    tagBg: "bg-amber-100",
    tagColor: "text-amber-700",
    accentColor: "bg-primary",
  },
  {
    icon: FileBarChart2,
    title: "Laporan Keuangan",
    desc: "Rekap pemasukan dan pengeluaran RT otomatis dengan grafik visual dan ekspor ke PDF atau Excel.",
    tag: "Transparan",
    iconBg: "bg-green-100",
    iconColor: "text-green-700",
    tagBg: "bg-green-100",
    tagColor: "text-green-700",
    accentColor: "bg-primary",
  },
  {
    icon: Bell,
    title: "Notifikasi Pintar",
    desc: "Pengingat otomatis untuk iuran jatuh tempo, jadwal kegiatan, dan informasi penting lainnya.",
    tag: "Proaktif",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-700",
    tagBg: "bg-rose-100",
    tagColor: "text-rose-700",
    accentColor: "bg-primary",
  },
];

export function Highlight() {
  const { ref, visible } = useReveal();

  return (
    <section id="features" className="py-10 md:py-12">
      <div className="container mx-auto max-w-275 px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 md:mb-12 text-center max-w-3xl mx-auto">
          <h2
            className="font-fraunces font-semibold leading-[1.1] tracking-tight text-foreground"
            style={{
              fontSize: "clamp(22px, 5vw, 42px)",
              letterSpacing: "-0.5px",
              marginBottom: "8px",
            }}
          >
            Kebutuhan <em className="italic text-primary">RT modern</em>
          </h2>
          <p className="hidden sm:block text-sm md:text-[16px] leading-[1.6] text-muted-foreground">
            Dirancang khusus untuk memudahkan pengurus dan warga RT dalam
            mengelola administrasi sehari-hari.
          </p>
        </div>

        {/* Grid — 2 kolom di mobile, 2 di sm, 3 di lg */}
        <div
          ref={ref}
          className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3"
        >
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className={[
                  "group relative overflow-hidden rounded-xl sm:rounded-2xl border border-border bg-card",
                  "p-3.5 sm:p-5 md:p-6",
                  "transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_12px_32px_hsl(var(--primary)/.1)]",
                  visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
                ].join(" ")}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {/* Top accent bar */}
                <div
                  className={[
                    "absolute left-0 right-0 top-0 h-[3px] origin-left scale-x-0",
                    "transition-transform duration-300 group-hover:scale-x-100",
                    f.accentColor,
                  ].join(" ")}
                />

                {/* Icon + tag row */}
                <div className="flex items-start justify-between gap-2 mb-2.5 sm:mb-4">
                  <div
                    className={[
                      "flex h-9 w-9 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center",
                      "rounded-[10px] sm:rounded-[13px]",
                      f.iconBg,
                      f.iconColor,
                    ].join(" ")}
                  >
                    <Icon className="h-4 w-4 sm:h-[22px] sm:w-[22px]" />
                  </div>
                  <span
                    className={[
                      "rounded-full px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold flex-shrink-0 mt-0.5",
                      f.tagBg,
                      f.tagColor,
                    ].join(" ")}
                  >
                    {f.tag}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-fraunces text-[14px] sm:text-[17px] font-semibold text-foreground leading-tight mb-1.5 sm:mb-2">
                  {f.title}
                </h3>

                {/* Desc — tersembunyi di mobile, muncul sm ke atas */}
                <p className="hidden sm:block text-[14px] leading-[1.65] text-muted-foreground">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}