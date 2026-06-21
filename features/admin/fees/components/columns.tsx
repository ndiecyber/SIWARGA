"use client";

import { Home, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";

import type { FeeRow, FeeStatus, OwnershipStatus } from "../types";

const STATUS_CONFIG: Record<FeeStatus, { label: string; className: string }> = {
  LUNAS: {
    label: "Lunas",
    className:
      "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
  },
  TERTUNDA: {
    label: "Tertunda",
    className:
      "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100",
  },
  BELUM_DIBUAT: {
    label: "Belum Dibuat",
    className:
      "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-100",
  },
};

const OWNERSHIP_CONFIG: Record<
  OwnershipStatus,
  { label: string; className: string }
> = {
  MILIK_SENDIRI: {
    label: "Milik Sendiri",
    className:
      "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100",
  },
  MENGONTRAK: {
    label: "Mengontrak",
    className:
      "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-100",
  },
};

export const columns: ColumnDef<FeeRow>[] = [
  {
    accessorKey: "houseNumber",
    enableGlobalFilter: true,
    header: () => "Rumah",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Home className="size-4 text-muted-foreground" />
        <span className="font-medium capitalize">
          {row.original.block}
          {row.original.houseNumber}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "residentName",
    enableGlobalFilter: true,
    header: () => "Penghuni",
    cell: ({ row }) => {
      const name: string = row.getValue("residentName");
      return (
        <div className="flex items-center gap-2">
          <User className="size-4 text-muted-foreground" />
          <span>{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "ownershipStatus",
    header: () => "Status",
    cell: ({ row }) => {
      const status: OwnershipStatus | null = row.getValue("ownershipStatus");
      if (!status) return <span className="text-sm text-muted-foreground/50">—</span>;
      const config = OWNERSHIP_CONFIG[status];
      return (
        <Badge variant="outline" className={config.className}>
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => "Status Iuran",
    filterFn: (row, columnId, filterValues: string[]) => {
      if (!filterValues.length) return true;
      return filterValues.includes(row.getValue(columnId));
    },
    cell: ({ row }) => {
      const status: FeeStatus = row.getValue("status");
      const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.BELUM_DIBUAT;
      return (
        <Badge variant="outline" className={config.className}>
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "lastPaymentDate",
    header: () => "Terakhir Bayar",
    cell: ({ row }) => {
      const date: string | null = row.getValue("lastPaymentDate");
      return date ? (
        <span className="text-sm text-muted-foreground">{date}</span>
      ) : (
        <span className="text-sm text-muted-foreground/50">—</span>
      );
    },
  },
];
