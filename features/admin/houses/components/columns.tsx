"use client";

import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { HouseStatus } from "@/generated/prisma/browser";
import DetailUserDialog from "@/features/admin/users/components/detail-user-dialog";

import { HouseWithOwner, HouseWithResidents } from "../types";

// ─── Column Definitions ───────────────────────────────────────────────────────

export const columns: ColumnDef<HouseWithOwner & HouseWithResidents>[] = [
  // ── House Number (block + number merged) ────────────────────────────────────
  {
    id: "houseNumber",
    enableGlobalFilter: true,
    header: () => <div className="flex justify-start">Nomor Rumah</div>,
    accessorFn: (row) => row.block + row.houseNumber,
    filterFn: (row, _columnId, filterValues: string[]) => {
      if (!filterValues.length) return true;
      return filterValues.includes(row.original.block.toLowerCase());
    },
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return (
        <div className="font-semibold uppercase text-start">
          <span className="font-mono">{value}</span>
        </div>
      );
    },
  },

  // ── Owner ─────────────────────────────────────────────────────────────────────
  {
    id: "owner",
    accessorFn: (row) => row.owner?.name ?? "",
    enableGlobalFilter: true,
    // header: ({ column }) => <SortableHeader column={column} label="Owner" />,
    header: () => "Owner",
    cell: ({ row }) => {
      const name: string = row.getValue("owner");
      return name ? (
        <DetailUserDialog user={row.original.owner!}>
          <Button variant="outline" className="justify-between w-full">
            {name}
            <ArrowUpRight />
          </Button>
        </DetailUserDialog>
      ) : (
        <span className="italic text-muted-foreground">—</span>
      );
    },
  },

  // ── Residents ─────────────────────────────────────────────────────────────────
  {
    accessorKey: "residents",
    header: () => "Residents",
    cell: ({ row }) => {
      const residentsArray = row.getValue("residents") as [];
      const count = residentsArray?.length ?? 0;

      return <span className="tabular-nums">{count} Orang</span>;
    },
  },

  // ── Status ────────────────────────────────────────────────────────────────────
  {
    accessorKey: "status",
    // header: ({ column }) => <SortableHeader column={column} label="Status" />,
    header: () => "Status",
    filterFn: (row, columnId, filterValues: string[]) => {
      if (!filterValues.length) return true;
      return filterValues.includes(row.getValue(columnId));
    },
    cell: ({ row }) => {
      const status: HouseStatus = row.getValue("status");
      return (
        <Badge
          variant={status === HouseStatus.OCCUPIED ? "default" : "secondary"}
          className={
            status === HouseStatus.OCCUPIED
              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
              : "bg-slate-100 text-slate-600 hover:bg-slate-100"
          }
        >
          {status === HouseStatus.OCCUPIED ? "Occupied" : "Vacant"}
        </Badge>
      );
    },
  },
];
