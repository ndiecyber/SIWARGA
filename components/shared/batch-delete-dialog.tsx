"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2Icon, Trash2Icon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "../ui/scroll-area";

interface BatchDeleteDialogProps<TId extends string | number> {
  items: { id: TId; label: string }[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (ids: TId[]) => Promise<void>;
  entityLabel: string;
}

export function BatchDeleteDialog<TId extends string | number>({
  items,
  open,
  onOpenChange,
  onDelete,
  entityLabel,
}: BatchDeleteDialogProps<TId>) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await onDelete(items.map((item) => item.id));
      toast.success(`${items.length} ${entityLabel} berhasil dihapus`);
      onOpenChange(false);
    } catch {
      toast.error(`Gagal menghapus ${entityLabel}. Silakan coba lagi.`);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus {entityLabel}?</AlertDialogTitle>
          <AlertDialogDescription>
            {items.length > 1 ? (
              <>
                <span className="font-semibold text-foreground">
                  {items.length} {entityLabel}
                </span>{" "}
                akan dihapus secara permanen dan tidak dapat dikembalikan.
              </>
            ) : (
              <>
                Data{" "}
                <span className="font-semibold text-foreground">
                  {items[0]?.label}
                </span>{" "}
                akan dihapus secara permanen dan tidak dapat dikembalikan.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {items.length > 1 && (
          <ul>
            <ScrollArea className="w-full h-40 p-2 text-sm border rounded-md text-muted-foreground">
              {items.map((item) => (
                <li key={String(item.id)} className="truncate">
                  • {item.label}
                </li>
              ))}
            </ScrollArea>
          </ul>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={isDeleting}
            onClick={handleDelete}
          >
            <span
              className={cn("flex items-center gap-2", isDeleting && "hidden")}
            >
              <Trash2Icon className="size-4" />
              Hapus
            </span>
            <span
              className={cn("flex items-center gap-2", !isDeleting && "hidden")}
            >
              <Loader2Icon className="size-4 animate-spin" />
              Menghapus...
            </span>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
