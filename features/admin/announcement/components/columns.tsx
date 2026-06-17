"use client";

import { CalendarDaysIcon, TagIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Announcement = {
  id: number;
  category: string;
  title: string;
  description: string;
  eventDate: Date | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  upcoming: {
    label: "Akan Datang",
    className: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100",
  },
  ongoing: {
    label: "Berlangsung",
    className:
      "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
  },
  done: {
    label: "Selesai",
    className: "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-100",
  },
};

const CATEGORY_COLORS: Record<string, string> = {
  Keamanan: "bg-red-50 text-red-600 border-red-100",
  Kebersihan: "bg-green-50 text-green-600 border-green-100",
  Keuangan: "bg-yellow-50 text-yellow-700 border-yellow-100",
  Sosial: "bg-purple-50 text-purple-600 border-purple-100",
  Infrastruktur: "bg-orange-50 text-orange-600 border-orange-100",
  Lainnya: "bg-slate-50 text-slate-600 border-slate-100",
};

// ─── Column Factory ───────────────────────────────────────────────────────────

export const column: ColumnDef<Announcement>[] = [
  // ── Title + description ──────────────────────────────────────────────────
  {
    accessorKey: "title",
    enableGlobalFilter: true,
    header: () => "Judul",
    cell: ({ row }) => (
      <div className="max-w-xs">
        <p className="font-medium text-foreground line-clamp-1">
          {row.getValue("title")}
        </p>
        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
          {row.original.description}
        </p>
      </div>
    ),
  },

  // ── Category ─────────────────────────────────────────────────────────────
  {
    accessorKey: "category",
    enableGlobalFilter: true,
    header: () => "Kategori",
    filterFn: (row, columnId, filterValues: string[]) => {
      if (!filterValues.length) return true;
      return filterValues.includes(row.getValue(columnId));
    },
    cell: ({ row }) => {
      const category: string = row.getValue("category");
      const colorClass = CATEGORY_COLORS[category] ?? CATEGORY_COLORS.Lainnya;
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${colorClass}`}
        >
          <TagIcon className="size-3" />
          {category}
        </span>
      );
    },
  },

  // ── Event date ───────────────────────────────────────────────────────────
  {
    accessorKey: "eventDate",
    header: () => "Tgl. Acara",
    cell: ({ row }) => {
      const date: Date | null = row.getValue("eventDate");
      return date ? (
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <CalendarDaysIcon className="size-3.5" />
          {new Date(date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      ) : (
        <span className="text-muted-foreground/50">—</span>
      );
    },
  },

  // ── Status ───────────────────────────────────────────────────────────────
  {
    accessorKey: "status",
    header: () => "Status",
    filterFn: (row, columnId, filterValues: string[]) => {
      if (!filterValues.length) return true;
      return filterValues.includes(row.getValue(columnId));
    },
    cell: ({ row }) => {
      const status: string = row.getValue("status");
      const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.done;
      return (
        <Badge variant="outline" className={config.className}>
          {config.label}
        </Badge>
      );
    },
  },
];
