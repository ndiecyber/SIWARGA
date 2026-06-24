// features/dashboard/components/dues-progress-card.tsx

import {
  CalendarCheck,
  CalendarClock,
  ChevronRight,
  ReceiptText,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DuesProgressCardProps = {
  paidMonths: number;
  totalMonths: number;
  className?: string;
};

export default function DuesProgressCard({
  paidMonths, totalMonths, className,
}: DuesProgressCardProps) {
  const safePaidMonths = Math.min(Math.max(paidMonths, 0), totalMonths);
  const remainingMonths = totalMonths - safePaidMonths;

  const percentage =
    totalMonths > 0 ? Math.round((safePaidMonths / totalMonths) * 100) : 0;

  const radius = 54;
  const stroke = 12;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Progress Iuran
          </p>
          <h2 className="mt-1 text-base font-bold tracking-tight">
            Pembayaran Tahun Ini
          </h2>
        </div>

        <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
          <ReceiptText size={18} />
        </div>
      </div>

      <div className="mt-5 flex justify-center">
        <div className="relative grid size-36 place-items-center">
          <svg
            width="144"
            height="144"
            viewBox="0 0 120 120"
            className="-rotate-90"
          >
            <circle
              cx="60"
              cy="60"
              r={normalizedRadius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth={stroke}
              className="text-muted"
            />

            <circle
              cx="60"
              cy="60"
              r={normalizedRadius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="text-primary transition-all duration-700 ease-out"
            />
          </svg>

          <div className="absolute text-center">
            <p className="text-[11px] font-medium text-muted-foreground">
              Terbayar
            </p>
            <p className="text-xl font-extrabold tracking-tight tabular-nums">
              {percentage}%
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {safePaidMonths}/{totalMonths} bulan
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2.5">
        <div className="rounded-lg border border-border bg-muted/40 px-3 py-2.5">
          <div className="flex items-center gap-1.5 text-primary">
            <CalendarCheck size={14} />
            <span className="text-[11px] font-semibold">Sudah Bayar</span>
          </div>

          <p className="mt-1 text-sm font-bold tabular-nums">
            {safePaidMonths} bulan
          </p>
        </div>

        <div className="rounded-lg border border-border bg-muted/40 px-3 py-2.5">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <CalendarClock size={14} />
            <span className="text-[11px] font-semibold">Belum Bayar</span>
          </div>

          <p className="mt-1 text-sm font-bold tabular-nums">
            {remainingMonths} bulan
          </p>
        </div>
      </div>

      <Button asChild className="mt-4 w-full text-xs" size="sm">
        <Link href="/iuran">
          Lihat Detail Iuran <ChevronRight size={14} />
        </Link>
      </Button>
    </section>
  );
}
