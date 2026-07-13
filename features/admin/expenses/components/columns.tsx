"use client";

import { format } from "date-fns";
import { id } from "date-fns/locale";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";

import type { ExpenseWithCreator } from "../types";

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

export const columns: ColumnDef<ExpenseWithCreator>[] = [
  {
    id: "date",
    enableGlobalFilter: true,
    header: () => "Tanggal",
    accessorFn: (row) => row.date,
    sortingFn: "datetime",
    cell: ({ getValue }) => {
      const value = getValue() as Date;
      return (
        <span className="font-medium tabular-nums">
          {format(new Date(value), "dd MMM yyyy", { locale: id })}
        </span>
      );
    },
  },
  {
    id: "description",
    enableGlobalFilter: true,
    header: () => "Deskripsi",
    accessorFn: (row) => row.description,
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return (
        <span className="max-w-[200px] truncate block" title={value}>
          {value}
        </span>
      );
    },
  },
  {
    id: "category",
    header: () => "Kategori",
    accessorFn: (row) => row.category,
    filterFn: (row, columnId, filterValues: string[]) => {
      if (!filterValues.length) return true;
      return filterValues.includes(row.getValue(columnId));
    },
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return (
        <Badge variant="outline" className="font-normal">
          {value}
        </Badge>
      );
    },
  },
  {
    id: "amount",
    header: () => "Jumlah",
    accessorFn: (row) => Number(row.amount),
    sortingFn: "basic",
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return (
        <span className="font-semibold tabular-nums">
          {formatRupiah(value)}
        </span>
      );
    },
  },
  {
    id: "status",
    header: () => "Status",
    accessorFn: (row) => row.status,
    filterFn: (row, columnId, filterValues: string[]) => {
      if (!filterValues.length) return true;
      return filterValues.includes(row.getValue(columnId));
    },
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return (
        <Badge
          variant={value === "APPROVED" ? "default" : "secondary"}
          className={
            value === "APPROVED"
              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
              : "bg-amber-100 text-amber-800 hover:bg-amber-100"
          }
        >
          {value === "APPROVED" ? "Disetujui" : "Diajukan"}
        </Badge>
      );
    },
  },
];
