"use client";

import { useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DetailExpenseDialog({
  expense,
  children,
  open,
  onOpenChange,
}: Props) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleOpenChange = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Detail Pengeluaran</DialogTitle>
          <DialogDescription>
            Informasi lengkap pengeluaran RT
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Tanggal</p>
                <p className="font-medium">
                  {format(new Date(expense.date), "dd MMMM yyyy", { locale: id })}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Kategori</p>
                <p className="font-medium">{expense.category}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Jumlah</p>
                <p className="font-semibold">{formatRupiah(Number(expense.amount))}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge
                  variant={expense.status === "APPROVED" ? "default" : "secondary"}
                  className={
                    expense.status === "APPROVED"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }
                >
                  {expense.status === "APPROVED" ? "Disetujui" : "Diajukan"}
                </Badge>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Deskripsi</p>
              <p className="font-medium">{expense.description}</p>
            </div>

            {expense.note && (
              <div>
                <p className="text-xs text-muted-foreground">Catatan</p>
                <p className="font-medium">{expense.note}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Dibuat Oleh</p>
                <p className="font-medium">{expense.createdBy?.name ?? "-"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tanggal Buat</p>
                <p className="font-medium">
                  {format(new Date(expense.createdAt), "dd MMM yyyy", { locale: id })}
                </p>
              </div>
            </div>

            {expense.approvedBy && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Disetujui Oleh</p>
                  <p className="font-medium">{expense.approvedBy.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tanggal Approval</p>
                  <p className="font-medium">
                    {expense.approvedAt
                      ? format(new Date(expense.approvedAt), "dd MMM yyyy", { locale: id })
                      : "-"}
                  </p>
                </div>
              </div>
            )}

            {expense.proofUrl && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">Bukti</p>
                <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                  <Image
                    src={expense.proofUrl}
                    alt="Bukti pengeluaran"
                    fill
                    className="object-contain"
                    sizes="400px"
                  />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
