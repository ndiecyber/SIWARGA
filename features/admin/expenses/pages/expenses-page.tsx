"use client";

import { useState } from "react";
import {
  EyeIcon,
  HandCoinsIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";

import { SortOption } from "@/lib/types/sort";
import { Button } from "@/components/ui/button";
import { FilterCategory } from "@/lib/types/filter";
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
import { ScrollArea } from "@/components/ui/scroll-area";

import { columns } from "../components/columns";
import { ExpenseCreateForm } from "../components/create-form";
import { ExpenseEditForm } from "../components/edit-form";
import { DetailExpenseDialog } from "../components/detail-dialog";
import { ApproveExpenseDialog } from "../components/approve-dialog";
import DeleteExpenseDialog from "../components/delete-dialog";
import { BatchDeleteDialog } from "@/components/shared/batch-delete-dialog";
import { deleteBatchExpensesAction } from "../actions";
import type { ExpenseWithCreator } from "../types";

const CATEGORY_OPTIONS = [
  { label: "ATK & Perlengkapan", value: "ATK & Perlengkapan" },
  { label: "Listrik & Air", value: "Listrik & Air" },
  { label: "Perbaikan Fasilitas", value: "Perbaikan Fasilitas" },
  { label: "Kegiatan & Acara", value: "Kegiatan & Acara" },
  { label: "Sumbangan & Sosial", value: "Sumbangan & Sosial" },
  { label: "Transportasi", value: "Transportasi" },
  { label: "Lainnya", value: "Lainnya" },
];

const filterCategories: FilterCategory[] = [
  {
    id: "category",
    label: "Kategori",
    options: CATEGORY_OPTIONS.map((opt) => ({
      label: opt.label,
      value: opt.value,
    })),
  },
  {
    id: "status",
    label: "Status",
    options: [
      { label: "Diajukan", value: "SUBMITTED" },
      { label: "Disetujui", value: "APPROVED" },
    ],
  },
];

const sortOptions: SortOption[] = [
  { id: "date", label: "Tanggal" },
  { id: "amount", label: "Jumlah" },
  { id: "description", label: "Deskripsi" },
];

interface Props {
  expenses: ExpenseWithCreator[];
}

export default function ExpensesPage({ expenses }: Props) {
  const [editTarget, setEditTarget] = useState<ExpenseWithCreator | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ExpenseWithCreator | null>(null);
  const [detailTarget, setDetailTarget] = useState<ExpenseWithCreator | null>(null);
  const [approveTarget, setApproveTarget] = useState<ExpenseWithCreator | null>(null);
  const [batchDeleteTarget, setBatchDeleteTarget] = useState<ExpenseWithCreator[] | null>(null);

  const batchActions: ActionOption<ExpenseWithCreator>[] = [
    {
      label: "Delete",
      icon: <Trash2Icon size={16} />,
      onClick: (rows) => setBatchDeleteTarget(rows as ExpenseWithCreator[]),
      destructive: true,
    },
  ];

  const expenseColumns = withActionColumn(withSelectColumn(columns), [
    {
      label: "Detail",
      icon: <EyeIcon size={16} />,
      onClick: (row) => setDetailTarget(row as ExpenseWithCreator),
    },
    {
      label: "Edit",
      icon: <PencilIcon size={16} />,
      onClick: (row) => {
        const expense = row as ExpenseWithCreator;
        if (expense.status === "SUBMITTED") setEditTarget(expense);
      },
    },
    {
      label: "Setujui",
      icon: <HandCoinsIcon size={16} />,
      onClick: (row) => {
        const expense = row as ExpenseWithCreator;
        if (expense.status === "SUBMITTED") setApproveTarget(expense);
      },
    },
    {
      label: "Delete",
      icon: <Trash2Icon size={16} />,
      onClick: (row) => {
        const expense = row as ExpenseWithCreator;
        if (expense.status === "SUBMITTED") setDeleteTarget(expense);
      },
      destructive: true,
    },
  ]);

  return (
    <main className="container max-h-screen mx-auto overflow-clip">
      <ScrollArea className="flex-1 min-w-0 max-h-[calc(100vh-5.1rem)]">
        <header className="flex flex-col justify-between gap-4 pb-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="rounded-md bg-primary p-2.5">
              <HandCoinsIcon className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-medium">Data Pengeluaran</h2>
              <p className="text-muted-foreground">
                Kelola pencatatan pengeluaran kas RT
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default">
                  <PlusIcon size={16} />
                  <span className="ml-2">Tambah Pengeluaran</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Tambah Pengeluaran Baru</DialogTitle>
                  <DialogDescription>
                    Catat pengeluaran kas RT
                  </DialogDescription>
                </DialogHeader>
                <ExpenseCreateForm />
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <DataTable
          columns={expenseColumns}
          data={expenses}
          filterCategories={filterCategories}
          sortOptions={sortOptions}
          batchActions={batchActions}
          onRowClick={(row) => setDetailTarget(row as ExpenseWithCreator)}
        />
      </ScrollArea>

      {detailTarget && (
        <DetailExpenseDialog
          expense={detailTarget}
          open={true}
          onOpenChange={(open) => { if (!open) setDetailTarget(null); }}
        />
      )}

      {editTarget && (
        <Dialog
          open={editTarget !== null}
          onOpenChange={(open) => { if (!open) setEditTarget(null); }}
        >
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Pengeluaran</DialogTitle>
              <DialogDescription>Perbarui data pengeluaran</DialogDescription>
            </DialogHeader>
            <ExpenseEditForm
              expense={editTarget}
              onSuccess={() => setEditTarget(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {approveTarget && (
        <ApproveExpenseDialog
          expense={approveTarget}
          open={true}
          onOpenChange={(open) => { if (!open) setApproveTarget(null); }}
        />
      )}

      {deleteTarget && (
        <DeleteExpenseDialog
          expense={deleteTarget}
          open={true}
          onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        />
      )}

      {batchDeleteTarget && (
        <BatchDeleteDialog
          items={batchDeleteTarget.map((e) => ({
            id: e.id,
            label: e.description,
          }))}
          open={true}
          onOpenChange={(open) => { if (!open) setBatchDeleteTarget(null); }}
          onDelete={async (ids) => { await deleteBatchExpensesAction(ids); }}
          entityLabel="pengeluaran"
        />
      )}
    </main>
  );
}
