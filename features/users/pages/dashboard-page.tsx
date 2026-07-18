"use client"

import { useState } from "react"
import {
  AlertTriangle,
  Ban,
  CalendarClockIcon,
  CheckCircle2,
  ChevronRight,
  ClockAlert,
  Construction,
  Info,
  Megaphone,
  Receipt,
  Users,
} from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"
import HeaderProfile from "../components/header-profile"
import WelcomeCard from "../components/welcome-card"
import { FeatureGrid } from "../components/feature-grid"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const piket = [
  { hari: "Senin", nama: "Budi Santoso" },
  { hari: "Selasa", nama: "Siti Aminah" },
  { hari: "Rabu", nama: "Andi Prasetyo" },
  { hari: "Kamis", nama: "Rina Wulandari" },
]

interface CurrentMonthDue {
  status: "LUNAS" | "TERTUNDA" | "BELUM_DIBUAT"
  amount: number
  dueDate: string
}

interface DashboardPageProps {
  userName: string
  currentMonthName: string
  currentMonthDue: CurrentMonthDue | null
  yearlyStats: {
    paidMonths: number
    totalMonths: number
  }
  announcements: Array<{
    id: number
    title: string
    excerpt: string
    date: string
  }>
  totalResidents: number
  recentAnnouncementCount: number
  overdueDues: Array<{
    id: string
    month: number
    year: number
    amount: number
    label: string
    dueDate: string
  }>
}

const comingSoonFeatures = ["Surat Menyurat", "Layanan Warga", "Agenda", "Lainnya"]

export default function DashboardPage({
  userName,
  currentMonthName,
  currentMonthDue,
  yearlyStats,
  announcements,
  totalResidents,
  recentAnnouncementCount,
  overdueDues,
}: DashboardPageProps) {
  const [selectedFeature, setSelectedFeature] = useState("Iuran Warga")
  const [comingSoonOpen, setComingSoonOpen] = useState(false)
  const [comingSoonFeature, setComingSoonFeature] = useState("")

  const iuranStatus =
    currentMonthDue === null
      ? { label: "—", tone: "muted" as const }
      : currentMonthDue.status === "LUNAS"
        ? { label: "Lunas", tone: "success" as const }
        : currentMonthDue.status === "TERTUNDA"
          ? { label: "Tertunda", tone: "warning" as const }
          : { label: "Belum Dibuat", tone: "muted" as const }

  function handleSelect(label: string) {
    if (comingSoonFeatures.includes(label)) {
      setComingSoonFeature(label)
      setComingSoonOpen(true)
      return
    }
    setSelectedFeature(label)
  }

  return (
    <>
      <HeaderProfile name={userName} />

      <div className="flex min-h-dvh flex-col gap-4 bg-muted/40 px-4 py-4">
        <WelcomeCard
          name={userName}
          currentMonthDue={currentMonthDue}
          overdueDues={overdueDues}
          recentAnnouncementCount={recentAnnouncementCount}
          totalResidents={totalResidents}
          currentMonthName={currentMonthName}
        />

        <FeatureGrid selected={selectedFeature} onSelect={handleSelect} />

        {selectedFeature === "Iuran Warga" && (
          <>
            <HighlightBanner monthName={currentMonthName} due={currentMonthDue} />

            {overdueDues.length > 0 && <OverdueAlert dues={overdueDues} />}

            <section>
              <SectionHeader title="Ringkasan Iuran" to="/iuran" />
              <div className="mt-3 grid grid-cols-2 gap-3">
                <StatCard
                  icon={<CalendarClockIcon size={18} />}
                  label="Iuran Bulan Ini"
                  value={iuranStatus.label}
                  footnote={currentMonthDue ? `Rp ${currentMonthDue.amount.toLocaleString("id-ID")}` : "—"}
                  variant={iuranStatus.tone}
                />
                <StatCard
                  icon={<CheckCircle2 size={18} />}
                  label="Iuran Tahunan"
                  value={`${yearlyStats.paidMonths}/${yearlyStats.totalMonths}`}
                  footnote="bulan lunas"
                  variant={yearlyStats.paidMonths === yearlyStats.totalMonths ? "success" : "warning"}
                />
              </div>
            </section>
          </>
        )}

        {selectedFeature === "Keuangan" && (
          <>
            <HighlightBanner monthName={currentMonthName} due={currentMonthDue} />

            <section>
              <SectionHeader title="Ringkasan Keuangan" to="/iuran" />
              <div className="mt-3 grid grid-cols-2 gap-3">
                <StatCard
                  icon={<CalendarClockIcon size={18} />}
                  label="Iuran Bulan Ini"
                  value={iuranStatus.label}
                  footnote={currentMonthDue ? `Rp ${currentMonthDue.amount.toLocaleString("id-ID")}` : "—"}
                  variant={iuranStatus.tone}
                />
                <StatCard
                  icon={<Megaphone size={18} />}
                  label="Pengumuman Baru"
                  value={`${recentAnnouncementCount}`}
                  footnote="dalam 7 hari terakhir"
                  variant={recentAnnouncementCount > 0 ? "primary" : "muted"}
                />
                <StatCard
                  icon={<CheckCircle2 size={18} />}
                  label="Iuran Tahunan"
                  value={`${yearlyStats.paidMonths}/${yearlyStats.totalMonths}`}
                  footnote="bulan lunas"
                  variant={yearlyStats.paidMonths === yearlyStats.totalMonths ? "success" : "warning"}
                />
                <StatCard
                  icon={<Users size={18} />}
                  label="Total Warga"
                  value={`${totalResidents}`}
                  footnote="terdaftar"
                  variant="muted"
                />
              </div>
            </section>
          </>
        )}

        {selectedFeature === "Pengumuman" && (
          <section>
            <SectionHeader title="Pengumuman Terbaru" to="/pengumuman" />
            <div className="mt-3 flex flex-col divide-y divide-[#F0F0F0] rounded-[20px] border border-[#F0F0F0] bg-white shadow-sm">
              {announcements.length === 0 && (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  Belum ada pengumuman.
                </p>
              )}
              {announcements.slice(0, 3).map((a) => (
                <Link
                  key={a.id}
                  href="/pengumuman"
                  className="flex items-center gap-3 px-4 py-3.5 no-underline transition-colors hover:bg-[#F5FAF6] active:bg-[#E8F5EC]"
                >
                  <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#E8F5EC] text-[#1B6B3A]">
                    <Megaphone size={18} strokeWidth={1.8} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#111827]">
                      {a.title}
                    </p>
                    <p className="text-xs text-[#6B7280]">{a.date}</p>
                  </div>
                  <ChevronRight size={16} className="shrink-0 text-[#6B7280]" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {selectedFeature === "Kegiatan" && (
          <section>
            <SectionHeader title="Jadwal Piket Minggu Ini" to="/piket" />
            <div className="mt-3 flex flex-col divide-y divide-[#F0F0F0] rounded-[20px] border border-[#F0F0F0] bg-white shadow-sm">
              {piket.map((p) => (
                <div
                  key={p.hari}
                  className="flex items-center gap-3 px-4 py-3.5"
                >
                  <div className="flex w-12 shrink-0 flex-col items-center rounded-xl bg-[#E8F5EC] px-2 py-1.5 leading-tight">
                    <span className="text-sm font-extrabold text-[#1B6B3A]">
                      {["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"].indexOf(
                        p.hari.slice(0, 3).toUpperCase(),
                      ) === -1
                        ? "—"
                        : String(
                            new Date().getDate() +
                              ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"].indexOf(
                                p.hari.slice(0, 3).toUpperCase(),
                              ) -
                              new Date().getDay(),
                          ).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] font-semibold text-[#2E8B4F]">
                      {p.hari.slice(0, 3).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#111827]">
                      {p.nama}
                    </p>
                    <p className="text-xs text-[#6B7280]">{p.hari}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#E8F5EC] px-2.5 py-1 text-[11px] font-medium text-[#1B6B3A]">
                    Piket
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <AlertDialog open={comingSoonOpen} onOpenChange={setComingSoonOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia>
              <Construction className="text-orange-500" />
            </AlertDialogMedia>
            <AlertDialogTitle>Fitur Segera Hadir</AlertDialogTitle>
            <AlertDialogDescription>
              Fitur <strong>{comingSoonFeature}</strong> sedang dalam pengembangan
              dan akan tersedia segera.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction onClick={() => setComingSoonOpen(false)}>
            Mengerti
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionHeader({
  title,
  to,
}: {
  title: string
  to: "/pengumuman" | "/piket" | "/iuran"
}) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-sm font-extrabold tracking-tight text-[#111827]">
        {title}
      </h2>
      <Link
        href={to}
        className="inline-flex items-center gap-0.5 text-xs font-semibold text-[#1B6B3A]"
      >
        Lihat Semua <ChevronRight size={14} />
      </Link>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  footnote,
  variant,
}: {
  icon: ReactNode
  label: string
  value: string
  footnote: string
  variant: "success" | "primary" | "warning" | "muted"
}) {
  const accentClass = {
    success: "bg-[#E8F5EC] text-[#1B6B3A]",
    primary: "bg-[#E8F5EC] text-[#1B6B3A]",
    warning: "bg-[#E8F5EC] text-[#1B6B3A]",
    muted: "bg-[#F5FAF6] text-[#6B7280]",
  }[variant]

  const valueClass = {
    success: "text-[#1B6B3A]",
    primary: "text-[#1B6B3A]",
    warning: "text-[#1B6B3A]",
    muted: "text-[#111827]",
  }[variant]

  return (
    <div className="rounded-[20px] border border-[#F0F0F0] bg-white p-4 shadow-sm">
      <div className={`grid size-9 place-items-center rounded-xl ${accentClass}`}>
        {icon}
      </div>
      <p className="mt-2 text-xs font-medium text-[#6B7280]">{label}</p>
      <p className={`mt-0.5 text-lg font-extrabold ${valueClass}`}>{value}</p>
      <p className="text-[11px] text-[#6B7280]">{footnote}</p>
    </div>
  )
}

// ─── Overdue Alert ───────────────────────────────────────────────────────────
function OverdueAlert({ dues }: { dues: DashboardPageProps["overdueDues"] }) {
  const totalOverdue = dues.reduce((sum, d) => sum + d.amount, 0)
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 rounded-[20px] border border-amber-200 bg-amber-50 p-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-100">
          <Info size={16} className="text-amber-600" />
        </div>
        <div>
          <p className="text-[13px] font-semibold text-amber-900">
            Info Pembayaran
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-amber-700">
            Pastikan Anda membayar sebelum tanggal jatuh tempo demi
            kesejahteraan Bersama.
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[20px] border border-amber-200 bg-amber-50 p-5 shadow-sm">
        <div className="relative space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700">
            <ClockAlert size={14} />
            Tagihan Tertunggak
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-amber-900">
              Kamu memiliki <strong>{dues.length} bulan</strong> tagihan yang
              belum dibayar
            </p>
            <p className="text-2xl font-extrabold tabular-nums text-amber-800">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(totalOverdue)}
            </p>
          </div>
          <ul className="space-y-1.5">
            {dues.map((due) => (
              <li
                key={due.id}
                className="flex flex-col rounded-xl bg-white/70 px-3 py-2 text-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Receipt size={14} className="text-amber-500" />
                    <span className="font-medium text-amber-900">
                      {due.label}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="font-semibold text-amber-800">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(due.amount)}
                    </span>
                    <span className="text-xs text-amber-600">
                      Jatuh tempo {due.dueDate}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <Button
            asChild
            size="sm"
            className="w-full rounded-xl bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700"
          >
            <Link href="/iuran">
              Bayar Tagihan Tertunggak <ChevronRight size={14} />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

function HighlightBanner({
  monthName,
  due,
}: {
  monthName: string
  due: CurrentMonthDue | null
}) {
  if (due === null) {
    return (
      <div className="relative overflow-hidden rounded-[20px] border border-[#F0F0F0] bg-white p-5 shadow-sm">
        <div className="relative space-y-0.5">
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-[#F5FAF6] px-3 py-1.5 text-xs font-semibold text-[#6B7280]">
            <Ban size={13} />
            Belum Terdaftar
          </div>
          <p className="mt-3 text-sm text-[#6B7280]">
            Kamu belum terdaftar di rumah manapun. Hubungi admin untuk
            pendaftaran.
          </p>
        </div>
      </div>
    )
  }

  const isLunas = due.status === "LUNAS"

  return (
    <div
      className={`relative overflow-hidden rounded-[20px] border p-5 shadow-sm ${
        isLunas
          ? "border-emerald-200 bg-emerald-600 text-white"
          : "border-[#F0F0F0] bg-[#1B6B3A] text-white"
      }`}
    >
      <div
        className={`absolute -right-6 -top-6 h-28 w-28 rounded-full ${isLunas ? "bg-white/10" : "bg-white/10"}`}
      />
      <div
        className={`absolute -bottom-10 -right-2 h-32 w-32 rounded-full ${isLunas ? "bg-white/5" : "bg-white/5"}`}
      />

      <div className="relative space-y-0.5">
        <div
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold ${
            isLunas
              ? "bg-white/15 text-white"
              : "bg-white/15 text-white"
          }`}
        >
          {isLunas ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}
          {isLunas ? `Iuran ${monthName} — Lunas` : `Status ${monthName}`}
        </div>

        <p className="mt-3 text-2xl font-extrabold tabular-nums">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(due.amount)}
        </p>

        {due.status === "BELUM_DIBUAT" ? (
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/85">
            <CalendarClockIcon size={14} />
            Tagihan belum dibuat oleh admin
          </p>
        ) : (
          <div className="flex items-center gap-1.5">
            <CalendarClockIcon size={14} />
            <p className="mt-0.5 text-xs text-white/85">
              Jatuh tempo {due.dueDate}
            </p>
          </div>
        )}

        {!isLunas && due.status !== "BELUM_DIBUAT" && (
          <Button asChild variant="outline" size="sm" className="mt-2 rounded-xl border-white/30 bg-white/10 text-white hover:bg-white/20">
            <Link href="/iuran">
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
  )
}
