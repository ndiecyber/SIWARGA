"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2Icon, Trash2Icon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Expense } from "@/generated/prisma/browser";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { deleteExpenseAction } from "../actions";
import { expensesLogger } from "@/lib/logger";

type Props = {
  expense: Expense;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
};

function DeleteExpenseDialog({ expense, open, onOpenChange, trigger }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleOpenChange = (nextOpenState: boolean) => {
    if (!isControlled) setInternalOpen(nextOpenState);
    onOpenChange?.(nextOpenState);
  };

  async function handleDelete() {
    setIsDeleting(true);

    const deleteAction = deleteExpenseAction(expense.id);

    toast.promise(deleteAction, {
      loading: "Menghapus pengeluaran...",
      success: (response) => {
        handleOpenChange(false);
        return response.message || "Pengeluaran berhasil dihapus!";
      },
      error: (error) => `Terjadi kesalahan: ${error}`,
    });

    try {
      await deleteAction;
    } catch (error) {
      expensesLogger.error({ err: error, expenseId: expense.id }, "Gagal hapus pengeluaran dari dialog");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus pengeluaran?</AlertDialogTitle>
          <AlertDialogDescription>
            Pengeluaran{" "}
            <span className="font-semibold text-foreground">
              {expense.description}
            </span>{" "}
            akan dihapus secara permanen dan tidak dapat dikembalikan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
          <Button variant="destructive" disabled={isDeleting} onClick={handleDelete}>
            <span className={cn("flex items-center gap-2", isDeleting && "hidden")}>
              <Trash2Icon className="w-4 h-4" />
              Hapus
            </span>
            <span className={cn("flex items-center gap-2", !isDeleting && "hidden")}>
              <Loader2Icon className="w-4 h-4 animate-spin" />
              Menghapus...
            </span>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteExpenseDialog;
