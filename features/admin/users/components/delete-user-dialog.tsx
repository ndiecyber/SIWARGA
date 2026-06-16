import { useState } from "react";

import { toast } from "sonner";
import { Loader2Icon, Trash2Icon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { User } from "@/generated/prisma/client";
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

import { deleteUserAction } from "../action";

type DeleteUserDialogProps = {
  user: User;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
};

export function DeleteUserDialog({
  user,
  open,
  onOpenChange,
  children,
}: DeleteUserDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleOpenChange = (nextOpenState: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextOpenState);
    }
    onOpenChange?.(nextOpenState);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteUserAction(user.id);
      toast.success(`Data ${user.name} berhasil dihapus`);
      handleOpenChange(false);
    } catch {
      toast.error("Gagal menghapus data. Silahkan coba lagi.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      {children && <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>}
      {/* <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4" />
          <span>Hapus</span>
        </Button>
      </AlertDialogTrigger> */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus warga?</AlertDialogTitle>
          <AlertDialogDescription>
            Data{" "}
            <span className="font-semibold text-foreground">{user.name}</span>{" "}
            akan dihapus secara permanen dan tidak dapat dikembalikan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={isDeleting}
            onClick={handleDelete}
          >
            <>
              <span
                className={cn(
                  "flex items-center gap-2",
                  isDeleting && "hidden",
                )}
              >
                <Trash2Icon className="w-4 h-4" />
                Hapus
              </span>
              <span
                className={cn(
                  "flex items-center gap-2",
                  !isDeleting && "hidden",
                )}
              >
                <Loader2Icon className="w-4 h-4 animate-spin" />
                Menghapus...
              </span>
            </>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
