"use client";

import { useState } from "react";

import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  EyeIcon,
  HandCoins,
  Receipt,
  Wallet,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import type { FeeRow } from "../types";

// ─── Constants ───────────────────────────────────────────────────────────────

const filterCategories: FilterCategory<FeeRow>[] = [
  {
    id: "status",
    label: "Status",
    options: [
      {
        label: "Lunas",
        value: "LUNAS",
        icon: <span className="inline-block size-2 rounded-full bg-emerald-500" />,
      },
      {
        label: "Tertunda",
        value: "TERTUNDA",
        icon: <span className="inline-block size-2 rounded-full bg-amber-500" />,
      },
      {
        label: "Belum Dibuat",
        value: "BELUM_DIBUAT",
        icon: <span className="inline-block size-2 rounded-full bg-slate-400" />,
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

export default function FeesPage() {
  const [detailTarget, setDetailTarget] = useState<FeeRow | null>(null);

  const feeColumns = withActionColumn(withSelectColumn(columns), [
    {
      label: "Detail",
      icon: <EyeIcon size={16} />,
      onClick: (row) => setDetailTarget(row as FeeRow),
    },
  ]);

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

      {/* ── Summary Cards ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Tagihan
            </CardTitle>
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Receipt className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp —</div>
            <p className="mt-1 text-xs text-muted-foreground">Periode bulan ini</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Lunas
            </CardTitle>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600">
              <CheckCircle2 className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="mt-1 text-xs text-muted-foreground">
              0% dari total rumah
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tertunda
            </CardTitle>
            <div className="rounded-lg bg-amber-500/10 p-2 text-amber-600">
              <Clock className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="mt-1 text-xs text-muted-foreground">
              0% dari total rumah
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Kas Masuk
            </CardTitle>
            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600">
              <Wallet className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp —</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Dari total target Rp —
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Alert Info ───────────────────────────────────────────────────── */}
      <Alert className="border-blue-200 bg-blue-50 text-blue-800">
        <AlertTriangle className="size-4" />
        <AlertTitle>Informasi Periode</AlertTitle>
        <AlertDescription>
          Tagihan bulan ini belum digenerate. Klik tombol{" "}
          <strong>&ldquo;Generate Tagihan&rdquo;</strong> untuk membuat tagihan iuran
          bulan{" "}
          {new Intl.DateTimeFormat("id-ID", {
            month: "long",
            year: "numeric",
          }).format(new Date())}
          .
        </AlertDescription>
      </Alert>

      {/* ── Data Table ───────────────────────────────────────────────────── */}
      <div className="bg-white">
        <DataTable
          data={[]}
          columns={feeColumns}
          filterCategories={filterCategories}
          sortOptions={sortOptions}
          batchActions={batchActions}
        />
      </div>

      {/* ── Detail Dialog (placeholder) ──────────────────────────────────── */}
      {detailTarget && (
        <p>TODO: Detail dialog untuk {detailTarget.ownerName}</p>
      )}
    </section>
  );
}
