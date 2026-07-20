"use client";

import { useTransition } from "react";

import { toast } from "sonner";
import { AlertTriangle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { announcementLogger } from "@/lib/logger";
import { deleteAnnouncement } from "@/app/admin/announcement/actions";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  announcementId: number;
  announcementTitle: string;
};

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  announcementId,
  announcementTitle,
}: Props) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteAnnouncement(announcementId);
        toast.success("Pengumuman berhasil dihapus!");
        onOpenChange(false);
      } catch (error) {
        announcementLogger.error(
          { err: error, announcementId },
          "Gagal hapus pengumuman dari dialog",
        );
        toast.error("Terjadi kesalahan. Silakan coba lagi.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full shrink-0 bg-destructive/10">
              <AlertTriangle className="size-5 text-destructive" />
            </div>
            <DialogTitle>Hapus Pengumuman</DialogTitle>
          </div>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Apakah Anda yakin ingin menghapus pengumuman{" "}
          <span className="font-medium text-foreground">
            &ldquo;{announcementTitle}&rdquo;
          </span>
          ? Tindakan ini tidak dapat dibatalkan.
        </p>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>
              Batal
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={handleDelete}
          >
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
