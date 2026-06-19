"use client";

import { useState } from "react";

import {
  DownloadIcon,
  EyeIcon,
  HousePlusIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { fraunces } from "@/lib/fonts";
import { SortOption } from "@/lib/types/sort";
import { Button } from "@/components/ui/button";
import { FilterCategory } from "@/lib/types/filter";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ActionOption,
  DataTable,
  withActionColumn,
  withSelectColumn,
} from "@/components/shared/data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import HouseShow from "./detail-show";
import { HouseWithOwner, HouseWithResidents } from "../types";
import { columns } from "../components/columns";
import { HouseEditForm } from "../components/edit-form";
import { HouseCreateForm } from "../components/create-form";
import DeleteHouseDialog from "../components/delete-dialog";

// ─── Constants ───────────────────────────────────────────────────────────────

const filterCategories: FilterCategory[] = [
  {
    id: "houseNumber",
    label: "Block",
    options: [
      {
        label: "A",
        value: "a",
        icon: (
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
        ),
      },
      {
        label: "B",
        value: "b",
        icon: <span className="inline-block w-2 h-2 bg-red-500 rounded-full" />,
      },
      {
        label: "C",
        value: "c",
        icon: (
          <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
        ),
      },
      {
        label: "D",
        value: "d",
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
  houses: (HouseWithOwner & HouseWithResidents)[];
  // houses: HouseWithOwner[];
}

export default function HousesPage({ houses }: Props) {
  const [detailTarget, setDetailTarget] = useState<HouseWithOwner | null>(null);
  const [editTarget, setEditTarget] = useState<
    (HouseWithOwner & HouseWithResidents) | null
  >(null);
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
      onClick: (row) =>
        setEditTarget(row as HouseWithOwner & HouseWithResidents),
    },
    {
      label: "Delete",
      icon: <Trash2Icon size={16} />,
      onClick: (row) => setDeleteTarget(row as HouseWithOwner),
      destructive: true,
    },
  ]);

  return (
    <main className="container mx-auto">
      <header className="flex items-center justify-between py-4 md:py-6">
        <h1 className={cn(fraunces.className, "text-3xl font-bold")}>Houses</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">
              <HousePlusIcon size={16} />
              <span className="ml-2">Tambah Rumah</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="h-screen max-w-screen md:min-w-[calc(100%-52rem)] md:h-fit gap-0">
            <DialogHeader className="sticky pb-4 -mx-6 space-y-4 border-b">
              <main className="px-6">
                <DialogTitle className="text-2xl font-semibold tracking-tight text-primary ">
                  Tambah Rumah Baru
                </DialogTitle>

                <DialogDescription>
                  Lengkapi informasi properti, kepemilikan, dan penghuni
                </DialogDescription>
              </main>
            </DialogHeader>

            {/* FIXME: house select block input focus state and form buttons are clipped */}
            <ScrollArea className="h-[calc(100vh-12rem)] -mr-6 pr-6 ">
              <HouseCreateForm className="pt-6" />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </header>

      <>
        <DataTable
          columns={houseColumns}
          data={houses}
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

        {editTarget && (
          <Dialog
            open={editTarget !== null}
            onOpenChange={(open) => {
              if (!open) setEditTarget(null);
            }}
          >
            <DialogContent className="h-screen max-w-screen md:min-w-[calc(100%-52rem)] md:h-fit gap-0">
              <DialogHeader className="sticky pb-4 -mx-6 space-y-4 border-b">
                <main className="px-6">
                  <DialogTitle className="text-2xl font-semibold tracking-tight text-primary ">
                    Update Data Rumah
                  </DialogTitle>

                  <DialogDescription>
                    Perbaharui informasi properti, kepemilikan, dan penghuni
                  </DialogDescription>
                </main>
              </DialogHeader>

              {/* FIXME: house select block input focus state and form buttons are clipped */}
              <ScrollArea className="h-[calc(100vh-12rem)] -mr-6 pr-6 ">
                <HouseEditForm
                  house={editTarget}
                  onSuccess={() => setEditTarget(null)}
                  className="pt-6"
                />
              </ScrollArea>
            </DialogContent>
          </Dialog>
        )}

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
    </main>
  );
}
