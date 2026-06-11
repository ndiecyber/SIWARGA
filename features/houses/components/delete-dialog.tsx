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
import { House } from "@/generated/prisma/browser";
import { useState } from "react";
import { toast } from "sonner";
import { deleteHouseAction } from "../actions";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

interface DeleteHouseDialogProps {
  house: House;
}

function DeleteHouseDialog({ house }: DeleteHouseDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);

    const deleteHouse = deleteHouseAction(house.id);

    toast.promise(deleteHouse, {
      loading: "Menghapus data rumah...",
      success: (response) => response.message || `Data rumah berhasil dihapus!`,
      error: (error) => `Terjadi kesalahan: ${error}`,
    });

    try {
      await deleteHouse;
    } catch (error) {
      console.error("DELETE_HOUSE_ERROR: ", error);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 text-muted-foreground hover:text-destructive"
          title="Hapus"
          disabled={isDeleting}
        >
          <Trash2 className="w-4 h-4" />
          <span className="sr-only">Hapus</span>
        </Button>
      </AlertDialogTrigger>
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
          <Button
            className="text-white bg-destructive hover:bg-destructive/90"
            onClick={() => handleDelete()}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Menghapus...
              </>
            ) : (
              "Hapus"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteHouseDialog;
