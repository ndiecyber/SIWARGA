"use client";

import { useRef, useEffect, useState } from "react";
import {
  User,
  ShieldCheck,
  Users,
  Banknote,
  BarChart3,
  Receipt,
  Megaphone,
  Map,
} from "lucide-react";

import { LayoutGrid } from "lucide-react";

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

function AdminVisual() {
  const rows = [
    {
      dot: "bg-green-600",
      name: "Budi Santoso",
      no: "A01",
      badge: "bg-green-100 text-green-700",
      label: "Lunas",
    },
    {
      dot: "bg-green-600",
      name: "Siti Rahayu",
      no: "A02",
      badge: "bg-green-100 text-green-700",
      label: "Lunas",
    },
    {
      dot: "bg-red-600",
      name: "Ahmad Fauzi",
      no: "A03",
      badge: "bg-red-100 text-red-700",
      label: "Menunggak",
    },
    {
      dot: "bg-amber-500",
      name: "Nita Wulandari",
      no: "B03",
      badge: "bg-amber-100 text-amber-700",
      label: "Sebagian",
    },
  ];
  const bars = [
    { label: "Lunas", pct: "80%", color: "bg-green-600", val: "12" },
    { label: "Sebagian", pct: "13%", color: "bg-amber-500", val: "2" },
    { label: "Menunggak", pct: "13%", color: "bg-red-600", val: "2" },
  ];
  return (
    <div
      id="modules"
      className="w-full rounded-2xl border border-border bg-card p-7 shadow-[0_16px_48px_hsl(var(--primary)/.08)]"
    >
      <p className="mb-3.5 text-[11px] font-semibold uppercase tracking-[.5px] text-muted-foreground">
        Status iuran warga — Juni 2025
      </p>
      <div className="mb-3 flex flex-col gap-1.5">
        {rows.map((r) => (
          <div
            key={r.name}
            className="flex items-center gap-2.5 rounded-[10px] px-3 py-2.5"
            style={{ background: "hsl(var(--muted)/0.5)" }}
          >
            <div className={`h-2 w-2 flex-shrink-0 rounded-full ${r.dot}`} />
            <span className="flex-1 text-[13px] font-medium text-foreground">
              {r.name}
            </span>
            <span className="text-[11px] font-semibold text-muted-foreground">
              {r.no}
            </span>
            <span
              className={`rounded-lg px-2 py-0.5 text-[10px] font-bold ${r.badge}`}
            >
              {r.label}
            </span>
          </div>
        ))}
      </div>
      <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[.5px] text-muted-foreground">
        Distribusi iuran
      </p>
      <div className="flex flex-col gap-2">
        {bars.map((b) => (
          <div key={b.label} className="flex items-center gap-2.5">
            <span className="w-[70px] flex-shrink-0 text-[12px] text-muted-foreground">
              {b.label}
            </span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-border">
              <div
                className={`h-full rounded-full ${b.color}`}
                style={{ width: b.pct }}
              />
            </div>
            <span className="w-7 text-right text-[12px] font-semibold text-foreground">
              {b.val}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WargaVisual() {
  const announcements = [
    {
      borderColor: "#1d4ed8",
      tags: [
        { bg: "bg-blue-100 text-blue-700", label: "kegiatan" },
        { bg: "bg-red-100 text-red-700", label: "Penting" },
      ],
      title: "Kerja Bakti Bulanan",
      sub: "Minggu 15 Jun 2025, 07.00 WIB",
    },
    {
      borderColor: "#16a34a",
      tags: [{ bg: "bg-green-100 text-green-700", label: "keuangan" }],
      title: "Tagihan Iuran Juni 2025",
      sub: "Batas bayar tgl 10 Juni 2025",
    },
    {
      borderColor: "#dc2626",
      tags: [{ bg: "bg-red-100 text-red-700", label: "keamanan" }],
      title: "Peringatan Keamanan",
      sub: "Selalu kunci kendaraan & rumah",
    },
  ];
  return (
    <div className="w-full rounded-2xl border border-border bg-card p-7 shadow-[0_16px_48px_hsl(var(--primary)/.08)]">
      <p className="mb-3.5 text-[11px] font-semibold uppercase tracking-[.5px] text-muted-foreground">
        Pengumuman terbaru
      </p>
      <div className="flex flex-col gap-2">
        {announcements.map((a) => (
          <div
            key={a.title}
            className="overflow-hidden rounded-[10px]"
            style={{
              background: "hsl(var(--muted)/0.5)",
              borderLeft: `3px solid ${a.borderColor}`,
            }}
          >
            <div className="px-3.5 py-3">
              <div className="mb-1.5 flex gap-1.5">
                {a.tags.map((t) => (
                  <span
                    key={t.label}
                    className={`rounded-lg px-1.5 py-0.5 text-[10px] font-bold ${t.bg}`}
                  >
                    {t.label}
                  </span>
                ))}
              </div>
              <p className="text-[13px] font-semibold text-foreground">
                {a.title}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {a.sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ModulItem({
  iconBg,
  iconColor,
  Icon,
  title,
  desc,
}: {
  iconBg: string;
  iconColor: string;
  Icon: React.ElementType;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3.5 rounded-[13px] border border-border bg-card p-3.5 transition-colors hover:border-primary/40">
      <div
        className={`flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-[10px] ${iconBg}`}
      >
        <Icon className={`h-[18px] w-[18px] ${iconColor}`} />
      </div>
      <div>
        <p className="text-[14px] font-semibold text-foreground">{title}</p>
        <p className="mt-0.5 text-[13px] leading-[1.5] text-muted-foreground">
          {desc}
        </p>
      </div>
    </div>
  );
}

export function TwoViews() {
  const { ref: ref1, visible: vis1 } = useReveal();
  const { ref: ref2, visible: vis2 } = useReveal();

  return (
    <section id="modul" className="py-[88px]">
      <div className="container mx-auto max-w-[1100px] px-6">
        <div className="mb-14 text-center">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[.4px] text-primary">
            <LayoutGrid className="h-3.5 w-3.5" />
            Modul Lengkap
          </div>
          <h2
            className="font-serif font-bold leading-[1.1] tracking-tight text-foreground"
            style={{
              fontSize: "clamp(38px, 5.5vw, 62px)",
              letterSpacing: "-1px",
              marginBottom: "20px",
            }}
          >
            Dua tampilan,
            <br />
            <em className="italic text-primary">satu platform</em>
          </h2>
        </div>

        <div
          ref={ref1}
          className={`grid grid-cols-1 items-center gap-[60px] transition-all duration-700 md:grid-cols-2 ${
            vis1 ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <div>
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[.4px] text-primary">
              <ShieldCheck className="h-3.5 w-3.5" />
              Panel Admin
            </div>
            <h3
              className="mb-2 font-serif leading-[1.2] text-foreground"
              style={{ fontSize: "28px", fontWeight: 600 }}
            >
              Kendali penuh
              <br />
              di tangan pengurus
            </h3>
            <p className="mb-4 text-[14px] leading-[1.7] text-muted-foreground">
              Pengurus RT mendapat akses lengkap untuk mengelola semua aspek
              administrasi perumahan dari satu dashboard.
            </p>
            <div className="flex flex-col gap-3.5">
              <ModulItem
                iconBg="bg-primary/10"
                iconColor="text-primary"
                Icon={Users}
                title="Manajemen warga & KK"
                desc="Tambah, edit, hapus data warga beserta anggota kartu keluarga"
              />
              <ModulItem
                iconBg="bg-green-100"
                iconColor="text-green-700"
                Icon={Banknote}
                title="Kelola iuran real-time"
                desc="Update status lunas/sebagian/menunggak dengan satu klik"
              />
              <ModulItem
                iconBg="bg-amber-100"
                iconColor="text-amber-700"
                Icon={BarChart3}
                title="Laporan & ekspor data"
                desc="Grafik arus kas, rekap iuran, dan ekspor PDF/Excel otomatis"
              />
            </div>
          </div>
          <AdminVisual />
        </div>

        <div
          ref={ref2}
          className={`mt-[72px] grid grid-cols-1 items-center gap-[60px] transition-all duration-700 md:grid-cols-2 ${
            vis2 ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <div className="order-last md:order-first">
            <WargaVisual />
          </div>
          <div>
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[.4px] text-primary">
              <User className="h-3.5 w-3.5" />
              Portal Warga
            </div>
            <h3
              className="mb-2 font-serif leading-[1.2] text-foreground"
              style={{ fontSize: "28px", fontWeight: 600 }}
            >
              Semua info RT
              <br />
              dalam satu genggaman
            </h3>
            <p className="mb-4 text-[14px] leading-[1.7] text-muted-foreground">
              Warga dapat memantau status iuran, membaca pengumuman, dan
              mengakses data keluarga kapanpun dari HP.
            </p>
            <div className="flex flex-col gap-3.5">
              <ModulItem
                iconBg="bg-violet-100"
                iconColor="text-violet-700"
                Icon={Receipt}
                title="Riwayat iuran pribadi"
                desc="Lihat status dan riwayat pembayaran dari bulan ke bulan"
              />
              <ModulItem
                iconBg="bg-blue-100"
                iconColor="text-blue-700"
                Icon={Megaphone}
                title="Pengumuman & info RT"
                desc="Baca pengumuman kegiatan, keamanan, dan berita terkini"
              />
              <ModulItem
                iconBg="bg-amber-100"
                iconColor="text-amber-700"
                Icon={Map}
                title="Peta blok perumahan"
                desc="Lihat status iuran tetangga secara visual di peta blok"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
