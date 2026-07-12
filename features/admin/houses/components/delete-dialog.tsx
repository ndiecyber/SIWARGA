import { useState } from "react";

import { toast } from "sonner";
import { Loader2Icon, Trash2Icon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { House } from "@/generated/prisma/browser";
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

import { deleteHouseAction } from "../actions";
import { housesLogger } from "@/lib/logger";

type Props = {
  house: House;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
};

function DeleteHouseDialog({ house, open, onOpenChange, trigger }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleOpenChange = (nextOpenState: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextOpenState);
    }
    onOpenChange?.(nextOpenState);
  };

  async function handleDelete() {
    setIsDeleting(true);

    const deleteHouse = deleteHouseAction(house.id);

    toast.promise(deleteHouse, {
      loading: "Menghapus data rumah...",
      success: (response) => {
        handleOpenChange(false);
        return response.message || `Data rumah berhasil dihapus!`;
      },
      error: (error) => `Terjadi kesalahan: ${error}`,
    });

    try {
      await deleteHouse;
    } catch (error) {
      housesLogger.error({ err: error, houseId: house.id }, 'Gagal hapus rumah dari dialog');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus rumah?</AlertDialogTitle>
          <AlertDialogDescription>
            Data{" "}
            <span className="font-semibold text-foreground">
              {house.block}
              {house.houseNumber}
            </span>{" "}
            akan dihapus secara permanen dan tidak dapat dikembalikan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
          {/* NOTE: alert dialog action is not used since it is optimistic */}
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

export default DeleteHouseDialog;
