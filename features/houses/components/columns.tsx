"use client";

import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  ChevronsUpDown,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { HouseStatus } from "@/generated/prisma/browser";
import { FieldDialog } from "@/components/shared/field-dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import ButtonActionDropdown from "@/components/shared/button-action-dropdown";
import DetailUserDialog from "@/features/admin/users/components/detail-user-dialog";

import HouseShow from "../pages/show";
import { HouseWithOwner } from "../types";
import { HouseEditForm } from "./edit-form";
import DeleteHouseDialog from "./delete-dialog";

// ─── Sortable Header Helper ────────────────────────────────────────────────────

function SortableHeader({
  column,
  label,
}: {
  column: Parameters<
    NonNullable<ColumnDef<HouseWithOwner>["header"]>
  >[0]["column"];
  label: string;
}) {
  const sorted = column.getIsSorted();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 gap-1 -ml-3 font-medium"
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

export const columns: ColumnDef<HouseWithOwner>[] = [
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

  // ── Actions ──────────────────────────────────────────────────────────────
  {
    id: "aksi",
    header: "Aksi",
    enableHiding: false,
    cell: ({ row }) => {
      const house = row.original;

      return (
        <ButtonActionDropdown>
          {/* View */}
          <HouseShow house={house}>
            <DropdownMenuItem>
              <Eye size={16} />
              Detail
            </DropdownMenuItem>
          </HouseShow>

          {/* Edit */}
          <FieldDialog
            title="Edit house"
            trigger={
              <DropdownMenuItem>
                <Pencil size={16} />
                Edit
              </DropdownMenuItem>
            }
          >
            <HouseEditForm house={house} />
          </FieldDialog>

          {/* Delete */}
          <DeleteHouseDialog
            house={house}
            trigger={
              <DropdownMenuItem variant="destructive">
                <Trash2 size={16} />
                Hapus
              </DropdownMenuItem>
            }
          />
        </ButtonActionDropdown>
      );
    },
  },
];
