"use client";

import { useEffect, useRef, useState } from "react";
import {
  Banknote,
  Users,
  Map,
  Megaphone,
  FileBarChart2,
  Bell,
  Sparkles,
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
    <section id="features" className="py-[88px]">
      <div className="container mx-auto max-w-[1100px] px-6">
        <div className="mb-14 text-center">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[.4px] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Fitur Unggulan
          </div>
          <h2
            className="font-serif font-semibold leading-[1.1] tracking-tight text-foreground"
            style={{
              fontSize: "clamp(38px, 5.5vw, 62px)",
              letterSpacing: "-1px",
              marginBottom: "20px",
            }}
          >
            Semua yang dibutuhkan
            <br />
            <em className="italic text-primary">RT modern</em>
          </h2>
          <p className="mx-auto mt-4 max-w-[540px] text-[17px] leading-[1.7] text-muted-foreground">
            Dirancang khusus untuk memudahkan pengurus dan warga RT dalam
            mengelola administrasi sehari-hari.
          </p>
        </div>

        <div
          ref={ref}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_12px_32px_hsl(var(--primary)/.1)] ${
                  visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-6 opacity-0"
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div
                  className={`absolute left-0 right-0 top-0 h-[3px] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${f.accentColor}`}
                />

                <div
                  className={`mb-[18px] flex h-12 w-12 items-center justify-center rounded-[13px] ${f.iconBg} ${f.iconColor}`}
                >
                  <Icon className="h-[22px] w-[22px]" />
                </div>

                <h3 className="mb-2 font-serif text-[17px] font-semibold text-foreground">
                  {f.title}
                </h3>

                <p className="text-[14px] leading-[1.65] text-muted-foreground">
                  {f.desc}
                </p>

                <span
                  className={`mt-3.5 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${f.tagBg} ${f.tagColor}`}
                >
                  {f.tag}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
