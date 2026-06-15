import {
  ChevronRight,
  Megaphone,
  Sparkles,
  Users,
  Wallet,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import HeaderProfile from "../components/header-profile";
import WelcomeCard from "../components/welcome-card";

const announcements = [
  {
    title: "Kerja Bakti Minggu Pagi",
    date: "14 Jun 2026",
    excerpt:
      "Mohon partisipasi seluruh warga untuk kerja bakti membersihkan saluran air.",
  },
  {
    title: "Pembayaran Iuran Juni",
    date: "10 Jun 2026",
    excerpt:
      "Iuran bulan Juni dapat dibayarkan kepada bendahara mulai tanggal 10.",
  },
  {
    title: "Rapat RT Bulanan",
    date: "8 Jun 2026",
    excerpt:
      "Rapat bulanan akan diadakan di balai warga, Sabtu pukul 19.30 WIB.",
  },
];

const piket = [
  { hari: "Senin", nama: "Budi Santoso" },
  { hari: "Selasa", nama: "Siti Aminah" },
  { hari: "Rabu", nama: "Andi Prasetyo" },
  { hari: "Kamis", nama: "Rina Wulandari" },
];

export default function DashboardPage() {
  return (
    <>
      <HeaderProfile />

      <div className="flex min-h-dvh flex-col gap-6 bg-muted/40 px-4 py-6">
        {/* Welcome Banner */}
        <WelcomeCard />

        {/* Highlight banner */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-primary p-5 text-primary-foreground shadow-sm">
          <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-primary-foreground/10" />
          <div className="absolute -bottom-10 -right-2 h-32 w-32 rounded-full bg-primary-foreground/5" />

          <div className="relative">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-2.5 py-1 text-[11px] font-semibold text-primary-foreground">
              <Sparkles size={12} />
              Status Bulan Ini
            </div>

            <p className="mt-3 text-2xl font-extrabold">Rp 50.000</p>

            <p className="mt-0.5 text-xs text-primary-foreground/85">
              Iuran kebersihan · Jatuh tempo 20 Jun
            </p>

            <Link
              href="/iuran"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-background px-4 py-2 text-xs font-semibold text-foreground"
            >
              Bayar Sekarang <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* Summary grid */}
        <section className="grid grid-cols-2 gap-3">
          <SummaryCard
            icon={<Wallet size={18} />}
            label="Iuran Juni"
            value="Lunas"
            badgeTone="success"
          />

          <SummaryCard
            icon={<Megaphone size={18} />}
            label="Pengumuman"
            value="2 baru"
            badgeTone="primary"
          />

          <SummaryCard
            icon={<CalendarDays size={18} />}
            label="Piket Kamu"
            value="Senin, 16 Jun"
            badgeTone="warning"
          />

          <SummaryCard
            icon={<Users size={18} />}
            label="Warga Aktif"
            value="48 warga"
            badgeTone="muted"
          />
        </section>

        {/* Announcements */}
        <section>
          <SectionHeader title="Pengumuman Terbaru" to="/pengumuman" />

          <div className="mt-3 flex flex-col gap-2.5">
            {announcements.slice(0, 3).map((a) => (
              <article
                key={a.title}
                className="rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="truncate text-sm font-semibold">{a.title}</h3>

                  <span className="shrink-0 text-[11px] text-muted-foreground">
                    {a.date}
                  </span>
                </div>

                <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">
                  {a.excerpt}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Piket */}
        <section className="pb-2">
          <SectionHeader title="Jadwal Piket Minggu Ini" to="/piket" />

          <ul className="mt-3 divide-y divide-border rounded-2xl border border-border bg-card text-card-foreground shadow-sm">
            {piket.map((p) => (
              <li key={p.hari} className="flex items-center gap-3 px-4 py-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <CalendarDays size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{p.nama}</p>
                  <p className="text-xs text-muted-foreground">{p.hari}</p>
                </div>

                <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                  Piket
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}

function SectionHeader({
  title,
  to,
}: {
  title: string;
  to: "/pengumuman" | "/piket" | "/iuran";
}) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-sm font-bold tracking-tight text-foreground">
        {title}
      </h2>

      <Link
        href={to}
        className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary"
      >
        Lihat Semua <ChevronRight size={14} />
      </Link>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  badgeTone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  badgeTone: "success" | "primary" | "warning" | "muted";
}) {
  const toneClass = {
    success: "bg-primary/10 text-primary",
    primary: "bg-secondary text-secondary-foreground",
    warning: "bg-accent text-accent-foreground",
    muted: "bg-muted text-muted-foreground",
  }[badgeTone];

  return (
    <div className="rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-sm">
      <div
        className={`grid h-9 w-9 place-items-center rounded-xl ${toneClass}`}
      >
        {icon}
      </div>

      <p className="mt-3 text-[11px] font-medium text-muted-foreground">
        {label}
      </p>

      <p className="mt-0.5 text-sm font-bold text-foreground">{value}</p>
    </div>
  );
}
