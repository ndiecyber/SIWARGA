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
import { Button } from "@/components/ui/button";
import { User } from "@/generated/prisma/client";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteUserAction } from "../action";
import { toast } from "sonner";

type DeleteUserDialogProps = {
  user: User;
};

export function DeleteUserDialog({ user }: DeleteUserDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteUserAction(user.id);
      toast.success(`Data ${user.name} berhasil dihapus`);
      setOpen(false);
    } catch {
      toast.error("Gagal menghapus data. Silahkan coba lagi.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          title="Hapus"
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Hapus</span>
        </Button>
      </AlertDialogTrigger>
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
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
