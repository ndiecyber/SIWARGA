"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

// ─── Types ────────────────────────────────────────────────────────────────────

export enum HouseStatus {
  OCCUPIED = "OCCUPIED",
  VACANT = "VACANT",
}

export type User = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  phoneNumber: string;
};

export type House = {
  id: string;
  houseNumber: string;
  block: string;
  status: HouseStatus;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string | null;
  owner: User;
  /** Derived field: number of residents (supply from your data layer) */
  residents?: number;
};

// ─── Dummy Data ───────────────────────────────────────────────────────────────

export const dummyUsers: User[] = [
  {
    id: "usr_001",
    createdAt: new Date("2025-01-10T08:00:00Z"),
    updatedAt: new Date("2025-01-10T08:00:00Z"),
    name: "John Doe",
    phoneNumber: "+6281234567890",
  },
  {
    id: "usr_002",
    createdAt: new Date("2025-01-12T09:30:00Z"),
    updatedAt: new Date("2025-03-01T14:20:00Z"),
    name: "Jane Smith",
    phoneNumber: "+6289876543210",
  },
  {
    id: "usr_003",
    createdAt: new Date("2025-02-05T11:15:00Z"),
    updatedAt: new Date("2025-02-20T16:45:00Z"),
    name: "Michael Johnson",
    phoneNumber: "+628111223344",
  },
];

export const dummyHouses: House[] = [
  {
    id: "house_001",
    houseNumber: "A1",
    block: "A",
    status: HouseStatus.OCCUPIED,
    createdAt: new Date("2025-01-15T08:00:00Z"),
    updatedAt: new Date("2025-02-01T10:00:00Z"),
    ownerId: dummyUsers[0].id,
    owner: dummyUsers[0],
    residents: 4,
  },
  {
    id: "house_002",
    houseNumber: "A2",
    block: "A",
    status: HouseStatus.OCCUPIED,
    createdAt: new Date("2025-01-16T08:00:00Z"),
    updatedAt: new Date("2025-02-02T10:00:00Z"),
    ownerId: dummyUsers[1].id,
    owner: dummyUsers[1],
    residents: 2,
  },
  {
    id: "house_003",
    houseNumber: "B1",
    block: "B",
    status: HouseStatus.OCCUPIED,
    createdAt: new Date("2025-01-17T08:00:00Z"),
    updatedAt: new Date("2025-02-03T10:00:00Z"),
    ownerId: dummyUsers[2].id,
    owner: dummyUsers[2],
    residents: 3,
  },
  {
    id: "house_004",
    houseNumber: "B2",
    block: "B",
    status: HouseStatus.VACANT,
    createdAt: new Date("2025-01-18T08:00:00Z"),
    updatedAt: new Date("2025-01-18T08:00:00Z"),
    ownerId: null,
    owner: {
      id: "",
      name: "",
      phoneNumber: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    residents: 0,
  },
];

// ─── Sortable Header Helper ────────────────────────────────────────────────────

function SortableHeader({
  column,
  label,
}: {
  column: Parameters<NonNullable<ColumnDef<House>["header"]>>[0]["column"];
  label: string;
}) {
  const sorted = column.getIsSorted();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 gap-1 font-medium"
      onClick={() => column.toggleSorting(sorted === "asc")}
    >
      {label}
      {sorted === "asc" ? (
        <ArrowUp className="h-3.5 w-3.5" />
      ) : sorted === "desc" ? (
        <ArrowDown className="h-3.5 w-3.5" />
      ) : (
        <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
      )}
    </Button>
  );
}

// ─── Column Definitions ───────────────────────────────────────────────────────

export const columns: ColumnDef<House>[] = [
  // ── Checkbox select ─────────────────────────────────────────────────────────
  {
    id: "select",
    enableSorting: false,
    enableHiding: false,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },

  // ── House number ─────────────────────────────────────────────────────────────
  {
    accessorKey: "houseNumber",
    enableGlobalFilter: true,
    header: ({ column }) => <SortableHeader column={column} label="House" />,
    cell: ({ row }) => (
      <span className="font-mono font-medium">
        {row.getValue("houseNumber")}
      </span>
    ),
  },

  // ── Block ────────────────────────────────────────────────────────────────────
  {
    accessorKey: "block",
    enableGlobalFilter: true,
    header: ({ column }) => <SortableHeader column={column} label="Block" />,
    filterFn: (row, columnId, filterValues: string[]) => {
      if (!filterValues.length) return true;
      return filterValues.includes(row.getValue(columnId));
    },
    cell: ({ row }) => (
      <span className="rounded bg-muted px-2 py-0.5 text-xs font-semibold uppercase tracking-wide">
        {row.getValue("block")}
      </span>
    ),
  },

  // ── Owner ─────────────────────────────────────────────────────────────────────
  {
    id: "owner",
    accessorFn: (row) => row.owner?.name ?? "",
    enableGlobalFilter: true,
    header: ({ column }) => <SortableHeader column={column} label="Owner" />,
    cell: ({ row }) => {
      const name: string = row.getValue("owner");
      return name ? (
        <span>{name}</span>
      ) : (
        <span className="text-muted-foreground italic">—</span>
      );
    },
  },

  // ── Residents ─────────────────────────────────────────────────────────────────
  {
    accessorKey: "residents",
    header: ({ column }) => (
      <SortableHeader column={column} label="Residents" />
    ),
    cell: ({ row }) => {
      const count: number = row.getValue("residents") ?? 0;
      return <span className="tabular-nums">{count}</span>;
    },
  },

  // ── Status ────────────────────────────────────────────────────────────────────
  {
    accessorKey: "status",
    header: ({ column }) => <SortableHeader column={column} label="Status" />,
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

  // ── Updated date ──────────────────────────────────────────────────────────────
  {
    id: "updatedAt",
    accessorFn: (row) => row.updatedAt,
    header: ({ column }) => <SortableHeader column={column} label="Updated" />,
    sortingFn: "datetime",
    cell: ({ row }) => {
      const date: Date = row.getValue("updatedAt");
      return (
        <span className="tabular-nums text-muted-foreground">
          {date.toLocaleDateString("en-CA")} {/* YYYY-MM-DD */}
        </span>
      );
    },
  },
];
