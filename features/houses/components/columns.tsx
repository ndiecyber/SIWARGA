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
import DetailUserDialog from "@/features/admin/users/components/detail-user-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import HouseShow from "../pages/show";
import { HouseWithOwner } from "../types";
import { FieldDialog } from "@/components/shared/field-dialog";
import { HouseEditForm } from "./edit-form";

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
        <div className="flex items-center gap-1">
          {/* View */}
          <HouseShow house={house}>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-muted-foreground hover:text-foreground"
              title="Lihat detail"
            >
              <Eye className="w-4 h-4" />
              <span className="sr-only">Lihat detail</span>
            </Button>
          </HouseShow>

          {/* Edit */}
          <FieldDialog
            title="Edit house"
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 text-muted-foreground hover:text-blue-600"
                title="Edit"
              >
                <Pencil className="w-4 h-4" />
                <span className="sr-only">Edit</span>
              </Button>
            }
          >
            <HouseEditForm house={house} />
          </FieldDialog>

          {/* Delete */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 text-muted-foreground hover:text-destructive"
                title="Hapus"
              >
                <Trash2 className="w-4 h-4" />
                <span className="sr-only">Hapus</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus warga?</AlertDialogTitle>
                <AlertDialogDescription>
                  Data{" "}
                  <span className="font-semibold text-foreground">
                    {/* {user.name} */}
                  </span>{" "}
                  {/* ({user.residentCode})  */}
                  327806xxxxxxxxxx akan dihapus secara permanen dan tidak dapat
                  dikembalikan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => {
                    // TODO: panggil API delete
                    console.log("Delete:", house.id);
                  }}
                >
                  Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];
