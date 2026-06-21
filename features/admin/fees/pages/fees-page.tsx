"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  Download,
  EyeIcon,
  FileSpreadsheet,
  HandCoins,
  Receipt,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ActionOption,
  DataTable,
  withActionColumn,
  withSelectColumn,
} from "@/components/shared/data-table";
import { FilterCategory } from "@/lib/types/filter";
import { SortOption } from "@/lib/types/sort";

import { columns } from "../components/columns";
import { GenerateFeesDialog } from "../components/generate-fees-dialog";
import { MarkPaidDialog } from "../components/mark-paid-dialog";
import type { FeeRow, FeesPageProps } from "../types";

// ─── Constants ───────────────────────────────────────────────────────────────

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const filterCategories: FilterCategory<FeeRow>[] = [
  {
    id: "status",
    label: "Status",
    options: [
      {
        label: "Lunas",
        value: "LUNAS",
        icon: (
          <span className="inline-block size-2 rounded-full bg-emerald-500" />
        ),
      },
      {
        label: "Tertunda",
        value: "TERTUNDA",
        icon: (
          <span className="inline-block size-2 rounded-full bg-amber-500" />
        ),
      },
      {
        label: "Belum Dibuat",
        value: "BELUM_DIBUAT",
        icon: (
          <span className="inline-block size-2 rounded-full bg-slate-400" />
        ),
      },
    ],
  },
];

const sortOptions: SortOption<FeeRow>[] = [
  { id: "houseNumber", label: "Rumah" },
  { id: "ownerName", label: "Pemilik" },
  { id: "status", label: "Status" },
];

const batchActions: ActionOption<FeeRow>[] = [
  {
    label: "Export",
    icon: <Download size={16} />,
    onClick: () => {},
  },
];

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// ─── Period Selector ─────────────────────────────────────────────────────────

function PeriodSelector({ month, year }: { month: number; year: number }) {
  const router = useRouter();

  const goToPeriod = (m: number, y: number) => {
    router.push(`/admin/fees?month=${m}&year=${y}`);
  };

  const goPrevMonth = () => {
    if (month === 1) {
      goToPeriod(12, year - 1);
    } else {
      goToPeriod(month - 1, year);
    }
  };

  const goNextMonth = () => {
    if (month === 12) {
      goToPeriod(1, year + 1);
    } else {
      goToPeriod(month + 1, year);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" onClick={goPrevMonth}>
        <ChevronLeft className="size-4" />
      </Button>
      <span className="min-w-35 text-center text-sm font-medium">
        {MONTHS[month - 1]} {year}
      </span>
      <Button variant="ghost" size="icon" onClick={goNextMonth}>
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function FeesPage({ houses, stats, period }: FeesPageProps) {
  const [detailTarget, setDetailTarget] = useState<FeeRow | null>(null);
  const [paidTarget, setPaidTarget] = useState<FeeRow | null>(null);

  const feeColumns = withActionColumn(withSelectColumn(columns), [
    {
      label: "Detail",
      icon: <EyeIcon size={16} />,
      onClick: (row) => setDetailTarget(row as FeeRow),
    },
    {
      label: "Catat Pembayaran",
      icon: <FileSpreadsheet size={16} />,
      onClick: (row) => {
        const fee = row as FeeRow;
        if (fee.monthlyDueId) {
          setPaidTarget(fee);
        } else {
          toast.error(
            "Tagihan belum dibuat. Generate tagihan terlebih dahulu.",
          );
        }
      },
    },
  ]);

  const hasGeneratedData = stats.notGeneratedCount < stats.totalHouses;
  const allGenerated = stats.notGeneratedCount === 0;

  return (
    <section className="space-y-8">
      {/* ── Header + Actions ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-md bg-primary p-2.5">
            <HandCoins className="text-white" />
          </div>

          <div>
            <h2 className="text-xl font-medium">Data Iuran Warga</h2>
            <p className="text-muted-foreground">
              Kelola tagihan iuran bulanan perumahan secara terpusat.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2" />
            Export Laporan
          </Button>
          <GenerateFeesDialog />
        </div>
      </div>

      {/* ── Period Navigation ────────────────────────────────────────────── */}
      <div className="flex items-center justify-center">
        <PeriodSelector month={period.month} year={period.year} />
      </div>

      {/* ── Summary Cards ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Tagihan
            </CardTitle>
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Receipt className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">
              {hasGeneratedData ? formatRupiah(stats.totalTagihan) : "Rp —"}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {stats.totalHouses} rumah terdaftar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Lunas
            </CardTitle>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600">
              <CheckCircle2 className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.paidCount}</div>
            <p className="mt-1 text-xs text-muted-foreground tabular-nums">
              {stats.totalHouses > 0
                ? `${Math.round((stats.paidCount / stats.totalHouses) * 100)}% dari total rumah`
                : "Belum ada data"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tertunda
            </CardTitle>
            <div className="rounded-lg bg-amber-500/10 p-2 text-amber-600">
              <Clock className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unpaidCount}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              {stats.totalHouses > 0
                ? `${Math.round((stats.unpaidCount / stats.totalHouses) * 100)}% dari total rumah`
                : "Belum ada data"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Kas Masuk
            </CardTitle>
            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600">
              <Wallet className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hasGeneratedData ? formatRupiah(stats.paidAmount) : "Rp —"}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {hasGeneratedData
                ? `Dari total target ${formatRupiah(stats.totalTarget)}`
                : "Generate tagihan terlebih dahulu"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Alert Info ───────────────────────────────────────────────────── */}
      {!allGenerated && (
        <Alert className="border-blue-200 bg-blue-50 text-blue-800">
          <AlertTriangle className="size-4" />
          <AlertTitle>Informasi Periode</AlertTitle>
          <AlertDescription>
            {stats.notGeneratedCount === stats.totalHouses ? (
              <>
                Tagihan bulan {MONTHS[period.month - 1]} {period.year} belum
                digenerate. Klik tombol{" "}
                <strong>&ldquo;Generate Tagihan&rdquo;</strong> untuk membuat
                tagihan iuran.
              </>
            ) : (
              <>
                {stats.notGeneratedCount} rumah belum memiliki tagihan untuk
                periode ini. Klik{" "}
                <strong>&ldquo;Generate Tagihan&rdquo;</strong> untuk
                melengkapinya.
              </>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* ── Data Table ───────────────────────────────────────────────────── */}
      <div className="bg-white">
        <DataTable
          data={houses}
          columns={feeColumns}
          filterCategories={filterCategories}
          sortOptions={sortOptions}
          batchActions={batchActions}
        />
      </div>

      {/* ── Detail Dialog ────────────────────────────────────────────────── */}
      {detailTarget && (
        <MarkPaidDialog
          key="detail"
          monthlyDueId={detailTarget.monthlyDueId}
          houseLabel={`${detailTarget.block}-${detailTarget.houseNumber} (${detailTarget.ownerName})`}
          open={detailTarget !== null}
          onOpenChange={(open) => {
            if (!open) setDetailTarget(null);
          }}
        />
      )}

      {/* ── Mark Paid Dialog ─────────────────────────────────────────────── */}
      {paidTarget && (
        <MarkPaidDialog
          key="paid"
          monthlyDueId={paidTarget.monthlyDueId}
          houseLabel={`${paidTarget.block}-${paidTarget.houseNumber} (${paidTarget.ownerName})`}
          open={paidTarget !== null}
          onOpenChange={(open) => {
            if (!open) setPaidTarget(null);
          }}
        />
      )}
    </section>
  );
}
