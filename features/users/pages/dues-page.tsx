"use client";

import {
  CheckCircle2,
  Clock,
  Receipt,
  Wallet,
  CalendarClockIcon,
  ChevronRight,
  ArrowDownUp,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import HeaderProfile from "../components/header-profile";
import { PaymentDrawer } from "../components/payment-drawer";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

interface DuesItemPayment {
  amountPaid: number;
  paidAt: string;
  paymentMethod: string;
  status: "SUCCESS" | "FAILED";
}

interface DuesItem {
  id: string;
  month: number;
  year: number;
  amount: number;
  dueDate: string;
  status: "PAID" | "UNPAID";
  payment: DuesItemPayment | null;
  isOverdue: boolean;
}

interface CurrentDue {
  status: "LUNAS" | "TERTUNDA" | "BELUM_DIBUAT";
  amount: number;
  dueDate: string;
}

interface DuesPageProps {
  userName: string;
  stats: {
    totalAmount: number;
    paidCount: number;
    unpaidCount: number;
    totalTagihan: number;
  };
  dues: DuesItem[];
  currentDue: CurrentDue | null;
  currentMonthName: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

function monthLabel(month: number, year: number): string {
  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1));
}

// ─── Page Component ──────────────────────────────────────────────────────────

export default function DuesPage({
  userName,
  stats,
  dues,
  currentDue,
  currentMonthName,
}: DuesPageProps) {
  const [sortAsc, setSortAsc] = useState(false);

  const sortedDues = [...dues].sort((a, b) => {
    const aOrder = a.year * 12 + a.month;
    const bOrder = b.year * 12 + b.month;
    return sortAsc ? aOrder - bOrder : bOrder - aOrder;
  });

  return (
    <>
      <HeaderProfile name={userName} />

      <div className="flex min-h-dvh flex-col gap-6 bg-muted/40 px-4 py-6">
        {/* Title */}
        <div>
          <h1 className="text-lg font-extrabold tracking-tight">
            Iuran Saya
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Riwayat dan status pembayaran iuran bulanan
          </p>
        </div>

        {dues.length === 0 ? (
          <EmptyState hasHouse={true} />
        ) : (
          <>
            {/* Stats Cards */}
            <section className="grid grid-cols-3 gap-3">
              <StatCard
                label="Total Tagihan"
                value={formatRupiah(stats.totalAmount)}
                tone="default"
              />
              <StatCard
                label="Lunas"
                value={String(stats.paidCount)}
                tone="success"
              />
              <StatCard
                label="Tertunda"
                value={String(stats.unpaidCount)}
                tone="warning"
              />
            </section>

            {/* Current Month Highlight */}
            {currentDue && (
              <CurrentMonthCard
                monthName={currentMonthName}
                due={currentDue}
              />
            )}

            {/* Overdue Summary */}
            {dues.filter((d) => d.isOverdue).length > 0 && (
              <OverdueSummary
                count={dues.filter((d) => d.isOverdue).length}
                total={dues
                  .filter((d) => d.isOverdue)
                  .reduce((s, d) => s + d.amount, 0)}
              />
            )}

            {/* Timeline */}
            <section>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold tracking-tight text-foreground">
                  Riwayat Pembayaran
                </h2>
                <button
                  onClick={() => setSortAsc(!sortAsc)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary"
                >
                  <ArrowDownUp size={12} />
                  {sortAsc ? "Terlama" : "Terbaru"}
                </button>
              </div>

              <div className="mt-3 space-y-2">
                {sortedDues.map((due) => (
                  <DuesRow key={due.id} due={due} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function EmptyState({ hasHouse }: { hasHouse: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className="grid size-16 place-items-center rounded-2xl bg-muted text-muted-foreground">
        <Wallet size={28} />
      </div>
      {hasHouse ? (
        <>
          <div className="text-center">
            <h2 className="text-sm font-bold">Belum Ada Tagihan</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Admin belum membuat tagihan untuk rumahmu.
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="text-center">
            <h2 className="text-sm font-bold">Belum Terdaftar</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Kamu belum terdaftar di rumah manapun. Hubungi admin.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "default" | "success" | "warning";
}) {
  const borderClass = {
    default: "border-border",
    success: "border-emerald-200",
    warning: "border-amber-200",
  }[tone];

  const valueClass = {
    default: "text-foreground",
    success: "text-emerald-700",
    warning: "text-amber-700",
  }[tone];

  return (
    <div
      className={cn(
        "rounded-2xl border bg-card p-3.5 text-card-foreground shadow-sm",
        borderClass,
      )}
    >
      <p className="truncate text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 text-lg font-extrabold tabular-nums",
          valueClass,
        )}
      >
        {value}
      </p>
    </div>
  );
}

function CurrentMonthCard({
  monthName,
  due,
}: {
  monthName: string;
  due: CurrentDue;
}) {
  const isLunas = due.status === "LUNAS";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-4 shadow-sm",
        isLunas
          ? "border-emerald-200 bg-emerald-50"
          : "border-blue-200 bg-blue-50",
      )}
    >
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <div
            className={cn(
              "inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[11px] font-semibold",
              isLunas
                ? "bg-emerald-200 text-emerald-800"
                : "bg-blue-200 text-blue-800",
            )}
          >
            {isLunas ? (
              <CheckCircle2 size={12} />
            ) : (
              <CalendarClockIcon size={12} />
            )}
            {monthName}
          </div>
          <p className="text-lg font-extrabold tabular-nums">
            {formatRupiah(due.amount)}
          </p>
          {isLunas ? (
            <p className="flex items-center gap-1 text-xs text-emerald-700">
              <CheckCircle2 size={12} />
              Sudah dibayar
            </p>
          ) : (
            <p className="flex items-center gap-1 text-xs text-blue-700">
              <CalendarClockIcon size={12} />
              {due.status === "BELUM_DIBUAT"
                ? "Tagihan belum dibuat"
                : `Jatuh tempo ${due.dueDate}`}
            </p>
          )}
        </div>

        {due.status === "TERTUNDA" && (
          <PaymentDrawer amount={due.amount}>
            <Button size="sm" className="shrink-0">
              Bayar <ChevronRight size={14} />
            </Button>
          </PaymentDrawer>
        )}
      </div>
    </div>
  );
}

function OverdueSummary({
  count,
  total,
}: {
  count: number;
  total: number;
}) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-0.5">
          <div className="inline-flex items-center gap-1 rounded-sm bg-red-200 px-2 py-0.5 text-[11px] font-semibold text-red-800">
            <Clock size={12} />
            Tertunggak
          </div>
          <p className="text-xs text-red-700">
            {count} bulan tagihan belum dibayar
          </p>
          <p className="text-lg font-extrabold tabular-nums text-red-800">
            {formatRupiah(total)}
          </p>
        </div>
        <PaymentDrawer amount={total}>
          <Button
            size="sm"
            variant="destructive"
            className="shrink-0"
          >
            Bayar Semua <ChevronRight size={14} />
          </Button>
        </PaymentDrawer>
      </div>
    </div>
  );
}

function DuesRow({ due }: { due: DuesItem }) {
  const label = monthLabel(due.month, due.year);
  const isPaid = due.status === "PAID";
  const paymentSuccess = due.payment?.status === "SUCCESS";

  return (
    <div className="rounded-2xl border border-border bg-card text-card-foreground shadow-sm">
      <div className="flex items-center gap-3 p-4">
        {/* Icon */}
        <div
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-xl",
            isPaid
              ? "bg-emerald-100 text-emerald-600"
              : due.isOverdue
                ? "bg-red-100 text-red-600"
                : "bg-muted text-muted-foreground",
          )}
        >
          {isPaid ? (
            <CheckCircle2 size={18} />
          ) : (
            <Receipt size={18} />
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold">{label}</h3>
            {due.isOverdue && (
              <Badge variant="destructive" className="shrink-0 text-[10px]">
                Tertunggak
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Jatuh tempo {due.dueDate}
          </p>
        </div>

        {/* Right side */}
        <div className="shrink-0 text-right">
          <p className="text-sm font-bold tabular-nums">
            {formatRupiah(due.amount)}
          </p>
          {isPaid ? (
            <Badge
              variant="outline"
              className="mt-0.5 border-emerald-200 bg-emerald-50 text-emerald-700"
            >
              {paymentSuccess ? "Lunas" : "Menunggu"}
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className={cn(
                "mt-0.5 border-amber-200 bg-amber-50 text-amber-700",
                due.isOverdue &&
                  "border-red-200 bg-red-50 text-red-700",
              )}
            >
              {due.isOverdue ? "Lewat" : "Tertunda"}
            </Badge>
          )}
        </div>
      </div>

      {/* Payment detail expand */}
      {paymentSuccess && due.payment && (
        <div className="border-t border-border px-4 py-2.5">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>Dibayar {due.payment.paidAt}</span>
            <span className="text-muted-foreground/40">|</span>
            <span>{due.payment.paymentMethod}</span>
            <span className="text-muted-foreground/40">|</span>
            <span className="font-medium text-emerald-600">
              {formatRupiah(due.payment.amountPaid)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
