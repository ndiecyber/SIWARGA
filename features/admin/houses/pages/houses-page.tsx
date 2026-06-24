"use client";

import { useState } from "react";

import {
  ArrowLeft,
  DownloadIcon,
  EyeIcon,
  HomeIcon,
  HousePlusIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { SortOption } from "@/lib/types/sort";
import { Button } from "@/components/ui/button";
import { FilterCategory } from "@/lib/types/filter";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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

import { columns } from "../components/columns";
import { HouseEditForm } from "../components/edit-form";
import { HouseCreateForm } from "../components/create-form";
import DeleteHouseDialog from "../components/delete-dialog";
import HouseDetailPane from "../components/house-detail-pane";
import { HouseWithOwner, HouseWithResidentsWithUser } from "../types";
import { useIsMobile } from "@/hooks/use-mobile";
import { BatchDeleteDialog } from "@/components/shared/batch-delete-dialog";
import { deleteBatchHousesAction } from "../actions";

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

interface Props {
  houses: (HouseWithOwner & HouseWithResidentsWithUser)[];
  // houses: HouseWithOwner[];
}

export default function HousesPage({ houses }: Props) {
  const isMobile = useIsMobile();

  const [selectedHouse, setSelectedHouse] = useState<
    (HouseWithOwner & HouseWithResidentsWithUser) | null
  >(null);
  const [editTarget, setEditTarget] = useState<
    (HouseWithOwner & HouseWithResidentsWithUser) | null
  >(null);
  const [deleteTarget, setDeleteTarget] = useState<HouseWithOwner | null>(null);
  const [batchDeleteTarget, setBatchDeleteTarget] = useState<
    HouseWithOwner[] | null
  >(null);

  const batchActions: ActionOption<HouseWithOwner>[] = [
    {
      label: "Delete",
      icon: <Trash2Icon size={16} />,
      onClick: (rows) => setBatchDeleteTarget(rows as HouseWithOwner[]),
      destructive: true,
    },
  ];

  const houseColumns = withActionColumn(withSelectColumn(columns), [
    {
      label: "Detail",
      icon: <EyeIcon size={16} />,
      onClick: (row) =>
        setSelectedHouse(row as HouseWithOwner & HouseWithResidentsWithUser),
    },
    {
      label: "Edit",
      icon: <PencilIcon size={16} />,
      onClick: (row) =>
        setEditTarget(row as HouseWithOwner & HouseWithResidentsWithUser),
    },
    {
      label: "Delete",
      icon: <Trash2Icon size={16} />,
      onClick: (row) => setDeleteTarget(row as HouseWithOwner),
      destructive: true,
    },
  ]);

  return (
    <main className="container flex h-[calc(100vh-5.1rem)] max-h-screen gap-6 mx-auto overflow-clip">
      {/* Left: Table */}
      <ScrollArea className="flex-1 min-w-0 max-h-[calc(100vh-5.1rem)]">
        <header className="flex flex-col justify-between gap-4 pb-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="rounded-md bg-primary p-2.5">
              <HomeIcon className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-medium">Data Perumahan</h2>
              <p className="text-muted-foreground">
                Kelola dan perbarui data perumahan RT 04 Perum Arjamukti Kencana
                Raya.
              </p>
            </div>
          </div>
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
              <ScrollArea className="max-h-[calc(100vh-12rem)] -mr-6 pr-6 ">
                <HouseCreateForm className="pt-6" />
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </header>

        <div className={cn(isMobile && "")}>
          <DataTable
            columns={houseColumns}
            data={houses}
            filterCategories={filterCategories}
            sortOptions={sortOptions}
            batchActions={batchActions}
            onRowClick={(row) =>
              setSelectedHouse(
                row as HouseWithOwner & HouseWithResidentsWithUser,
              )
            }
          />
        </div>
      </ScrollArea>

      {/* Desktop: permanent info pane */}
      <aside className="hidden -mb-6 w-80 shrink-0 md:block">
        <ScrollArea className="h-[calc(100vh-5.1rem)] sticky top-0">
          <HouseDetailPane house={selectedHouse} />
        </ScrollArea>
      </aside>

      {/* Mobile: full-screen sheet */}
      <div className="md:hidden">
        <Sheet
          open={selectedHouse !== null && isMobile}
          onOpenChange={(open) => {
            if (!open) setSelectedHouse(null);
          }}
        >
          <SheetContent
            side="right"
            className="w-full p-0 bg-transparent shadow-none"
            showCloseButton={false}
          >
            <SheetHeader className="rounded-bl-lg bg-sidebar">
              <main className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedHouse(null)}
                >
                  <ArrowLeft size={16} />
                </Button>
                <div>
                  <SheetTitle>Kembali</SheetTitle>
                  <SheetDescription>
                    Data Rumah{" "}
                    <span className="font-bold leading-tight uppercase">
                      {selectedHouse?.block}
                      {selectedHouse?.houseNumber}
                    </span>
                  </SheetDescription>
                </div>
              </main>
            </SheetHeader>
            <ScrollArea className="bg-transparent h-[calc(100vh-5rem)] pb-4">
              {selectedHouse && <HouseDetailPane house={selectedHouse} />}
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

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
            <ScrollArea className="max-h-[calc(100vh-12rem)] -mr-6 pr-6 ">
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

      {batchDeleteTarget && (
        <BatchDeleteDialog
          items={batchDeleteTarget.map((h) => ({
            id: h.id,
            label: `${h.block}${h.houseNumber}`,
          }))}
          open={true}
          onOpenChange={(open) => {
            if (!open) setBatchDeleteTarget(null);
          }}
          onDelete={deleteBatchHousesAction}
          entityLabel="rumah"
        />
      )}
    </main>
  );
}
