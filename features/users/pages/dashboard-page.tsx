"use client";

import {
  ChevronRight,
  Megaphone,
  Users,
  Wallet,
  CalendarDays,
  CalendarClockIcon,
  CheckCircle2,
  AlertTriangle,
  Ban,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import HeaderProfile from "../components/header-profile";
import WelcomeCard from "../components/welcome-card";
import { Button } from "@/components/ui/button";
import DuesProgressCard from "../components/dues-progress-card";

const piket = [
  { hari: "Senin", nama: "Budi Santoso" },
  { hari: "Selasa", nama: "Siti Aminah" },
  { hari: "Rabu", nama: "Andi Prasetyo" },
  { hari: "Kamis", nama: "Rina Wulandari" },
];

interface CurrentMonthDue {
  status: "LUNAS" | "TERTUNDA" | "BELUM_DIBUAT";
  amount: number;
  dueDate: string;
}

interface DashboardPageProps {
  userName: string;
  currentMonthName: string;
  currentMonthDue: CurrentMonthDue | null;
  yearlyStats: {
    paidMonths: number;
    totalMonths: number;
  };
  announcements: Array<{
    id: number;
    title: string;
    excerpt: string;
    date: string;
  }>;
  totalResidents: number;
  recentAnnouncementCount: number;
}

export default function DashboardPage({
  userName,
  currentMonthName,
  currentMonthDue,
  yearlyStats,
  announcements,
  totalResidents,
  recentAnnouncementCount,
}: DashboardPageProps) {
  const iuranStatus =
    currentMonthDue === null
      ? { label: "—", tone: "muted" as const }
      : currentMonthDue.status === "LUNAS"
        ? { label: "Lunas", tone: "success" as const }
        : currentMonthDue.status === "TERTUNDA"
          ? { label: "Tertunda", tone: "warning" as const }
          : { label: "Belum Dibuat", tone: "muted" as const };

  return (
    <>
      <HeaderProfile name={userName} />

      <div className="flex min-h-dvh flex-col gap-6 bg-muted/40 px-4 py-6">
        {/* Welcome Banner */}
        <WelcomeCard name={userName} />

        {/* Highlight banner */}
        <HighlightBanner
          monthName={currentMonthName}
          due={currentMonthDue}
        />

        {/* Summary grid */}
        <section className="overflow-x-auto pb-1 scrollbar-hide">
          <div className="flex snap-x gap-3">
            <SummaryCard
              icon={<Wallet size={18} />}
              label={`Iuran ${currentMonthName}`}
              value={iuranStatus.label}
              badgeTone={iuranStatus.tone}
            />
            <SummaryCard
              icon={<Megaphone size={18} />}
              label="Pengumuman"
              value={`${recentAnnouncementCount} baru`}
              badgeTone={recentAnnouncementCount > 0 ? "primary" : "muted"}
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
              value={`${totalResidents} warga`}
              badgeTone="muted"
            />
          </div>
        </section>

        {/* Summary Statistic */}
        <DuesProgressCard
          paidMonths={yearlyStats.paidMonths}
          totalMonths={yearlyStats.totalMonths}
        />

        {/* Announcements */}
        <section>
          <SectionHeader title="Pengumuman Terbaru" to="/pengumuman" />

          <div className="mt-3 flex flex-col gap-2.5">
            {announcements.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Belum ada pengumuman.
              </p>
            )}
            {announcements.slice(0, 3).map((a) => (
              <article
                key={a.id}
                className="rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="truncate text-sm font-semibold">
                    {a.title}
                  </h3>
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
              <li
                key={p.hari}
                className="flex items-center gap-3 px-4 py-3"
              >
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

// ─── Sub-components ──────────────────────────────────────────────────────────

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
    <div className="min-w-38 snap-start rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-sm">
      <div
        className={`grid size-8 place-items-center rounded-lg ${toneClass}`}
      >
        {icon}
      </div>
      <div className="mt-0.5">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-sm font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}

function HighlightBanner({
  monthName,
  due,
}: {
  monthName: string;
  due: CurrentMonthDue | null;
}) {
  if (due === null) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-border bg-muted p-5 shadow-sm">
        <div className="relative space-y-0.5">
          <div className="inline-flex items-center gap-1.5 rounded-sm bg-muted-foreground/15 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
            <Ban size={12} />
            Belum Terdaftar
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Kamu belum terdaftar di rumah manapun. Hubungi admin untuk
            pendaftaran.
          </p>
        </div>
      </div>
    );
  }

  const isLunas = due.status === "LUNAS";

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-5 shadow-sm ${
        isLunas
          ? "border-emerald-200 bg-emerald-600 text-white"
          : "border-border bg-primary text-primary-foreground"
      }`}
    >
      <div
        className={`absolute -right-6 -top-6 h-28 w-28 rounded-full ${isLunas ? "bg-white/10" : "bg-primary-foreground/10"}`}
      />
      <div
        className={`absolute -bottom-10 -right-2 h-32 w-32 rounded-full ${isLunas ? "bg-white/5" : "bg-primary-foreground/5"}`}
      />

      <div className="relative space-y-0.5">
        <div
          className={`inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-[11px] font-semibold ${
            isLunas
              ? "bg-white/15 text-white"
              : "bg-primary-foreground/15 text-primary-foreground"
          }`}
        >
          {isLunas ? (
            <CheckCircle2 size={12} />
          ) : (
            <AlertTriangle size={12} />
          )}
          {isLunas
            ? `Iuran ${monthName} — Lunas`
            : `Status ${monthName}`}
        </div>

        <p className="mt-3 text-2xl font-extrabold tabular-nums">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(due.amount)}
        </p>

        {due.status === "BELUM_DIBUAT" ? (
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-primary-foreground/85">
            <CalendarClockIcon size={14} />
            Tagihan belum dibuat oleh admin
          </p>
        ) : (
          <div className="flex items-center gap-1.5">
            <CalendarClockIcon size={14} />
            <p className="mt-0.5 text-xs text-primary-foreground/85">
              Jatuh tempo {due.dueDate}
            </p>
          </div>
        )}

        {!isLunas && due.status !== "BELUM_DIBUAT" && (
          <Button asChild variant="outline" size="sm" className="mt-0.5">
            <Link
              href="/iuran"
              className="text-xs text-muted-foreground"
            >
              Bayar Sekarang <ChevronRight size={14} />
            </Link>
          </Button>
        )}

        {isLunas && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-white/85">
            <CheckCircle2 size={14} />
            Pembayaran telah dikonfirmasi
          </div>
        )}
      </div>
    </div>
  );
}
