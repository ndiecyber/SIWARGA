"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CheckCircleIcon, Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
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

import { approveExpenseAction } from "../actions";
import { expensesLogger } from "@/lib/logger";
import type { ExpenseWithCreator } from "../types";

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

interface Props {
  expense: ExpenseWithCreator;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export function ApproveExpenseDialog({
  expense,
  open,
  onOpenChange,
  trigger,
}: Props) {
  const [isApproving, setIsApproving] = useState(false);
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleOpenChange = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  async function handleApprove() {
    setIsApproving(true);

    const approveAction = approveExpenseAction(expense.id);

    toast.promise(approveAction, {
      loading: "Menyetujui pengeluaran...",
      success: (response) => {
        handleOpenChange(false);
        return response.message || "Pengeluaran berhasil disetujui!";
      },
      error: (error) => `Terjadi kesalahan: ${error}`,
    });

    try {
      await approveAction;
    } catch (error) {
      expensesLogger.error({ err: error, expenseId: expense.id }, "Gagal approve pengeluaran dari dialog");
    } finally {
      setIsApproving(false);
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Setujui pengeluaran?</AlertDialogTitle>
          <AlertDialogDescription>
            Pengeluaran{" "}
            <span className="font-semibold text-foreground">
              {expense.description}
            </span>{" "}
            sebesar{" "}
            <span className="font-semibold text-foreground">
              {formatRupiah(Number(expense.amount))}
            </span>{" "}
            akan ditandai sebagai disetujui.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isApproving}>Batal</AlertDialogCancel>
          <Button variant="default" disabled={isApproving} onClick={handleApprove}>
            {isApproving ? (
              <Loader2Icon className="mr-2 animate-spin size-4" />
            ) : (
              <CheckCircleIcon className="mr-2 size-4" />
            )}
            Setujui
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
