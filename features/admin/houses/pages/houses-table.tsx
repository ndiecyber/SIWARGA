"use client";

import { useState } from "react";

import {
  Download,
  DownloadIcon,
  EyeIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";

import { SortOption } from "@/lib/types/sort";
import { ColumnDef } from "@tanstack/react-table";
import { FilterCategory } from "@/lib/types/filter";
import { DataTable } from "@/components/shared/data-table";
import {
  ActionOption,
  withActionColumn,
  withSelectColumn,
} from "@/components/shared/column-helpers";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import HouseShow from "./show";
import { HouseWithOwner } from "../types";
import { HouseEditForm } from "../components/edit-form";
import DeleteHouseDialog from "../components/delete-dialog";

// ─── Constants ───────────────────────────────────────────────────────────────

const filterCategories: FilterCategory[] = [
  {
    id: "block",
    label: "Block",
    options: [
      {
        label: "A",
        value: "A",
        icon: (
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
        ),
      },
      {
        label: "B",
        value: "B",
        icon: <span className="inline-block w-2 h-2 bg-red-500 rounded-full" />,
      },
      {
        label: "C",
        value: "C",
        icon: (
          <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
        ),
      },
      {
        label: "D",
        value: "D",
        icon: <span className="inline-block w-2 h-2 rounded-full bg-sky-500" />,
      },
    ],
  },
];

const sortOptions: SortOption[] = [
  {
    id: "houseNumber",
    label: "House",
  },
  {
    id: "block",
    label: "Block",
  },
  {
    id: "owner",
    label: "Owner",
  },
  {
    id: "status",
    label: "Status",
  },
];

const batchActions: ActionOption<HouseWithOwner>[] = [
  {
    label: "Export",
    icon: <DownloadIcon size={16} />,
    onClick: (rows) => console.log("edit", rows),
  },
  {
    label: "Delete",
    icon: <Trash2Icon size={16} />,
    onClick: (rows) => console.log("delete", rows),
    destructive: true,
  },
];

interface Props {
  columns: ColumnDef<HouseWithOwner>[];
  data: HouseWithOwner[];
}

function HousesTable({ columns, data }: Props) {
  const [detailTarget, setDetailTarget] = useState<HouseWithOwner | null>(null);
  const [editTarget, setEditTarget] = useState<HouseWithOwner | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<HouseWithOwner | null>(null);

  const houseColumns = withActionColumn(withSelectColumn(columns), [
    {
      label: "Detail",
      icon: <EyeIcon size={16} />,
      onClick: (row) => setDetailTarget(row as HouseWithOwner),
    },
    {
      label: "Edit",
      icon: <PencilIcon size={16} />,
      onClick: (row) => setEditTarget(row as HouseWithOwner),
    },
    {
      label: "Delete",
      icon: <Trash2Icon size={16} />,
      onClick: (row) => setDeleteTarget(row as HouseWithOwner),
      destructive: true,
    },
  ]);

  return (
    <>
      <DataTable
        columns={houseColumns}
        data={data}
        filterCategories={filterCategories}
        sortOptions={sortOptions}
        batchActions={batchActions}
      />

      {detailTarget && (
        <HouseShow
          house={detailTarget}
          open={detailTarget !== null}
          onOpenChange={(open) => {
            if (!open) setDetailTarget(null);
          }}
        />
      )}

      <Dialog
        open={editTarget !== null}
        onOpenChange={(open) => {
          if (!open) setEditTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit data rumah</DialogTitle>
            <DialogDescription>
              Edit data rumah, data hanya dapat diubah
            </DialogDescription>
          </DialogHeader>
          {editTarget && (
            <HouseEditForm
              house={editTarget}
              onSuccess={() => setEditTarget(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {deleteTarget && (
        <DeleteHouseDialog
          house={deleteTarget}
          open={true}
          onOpenChange={(open) => {
            if (!open) setDeleteTarget(null);
          }}
        />
      )}
    </>
  );
}

export default HousesTable;
