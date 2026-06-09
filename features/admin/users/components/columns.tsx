import { UserDummy } from "@/seed/users-dummy";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, SquareArrowUpRight, Trash2 } from "lucide-react";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

export const columns: ColumnDef<UserDummy>[] = [
  // {
  //   accessorKey: "residentCode",
  //   header: "Kode Warga",
  //   cell: ({ row }) => (
  //     <span className="font-mono text-sm font-medium text-muted-foreground">
  //       {row.original.residentCode}
  //     </span>
  //   ),
  // },
  {
    accessorKey: "name",
    header: "Nama",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.name}</span>
        <span className="font-mono text-xs text-muted-foreground">
          {row.original.nik}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "block",
    header: "Blok",
    cell: ({ row }) => (
      <span className="font-semibold">{row.original.block}</span>
    ),
  },
  {
    accessorKey: "familyMembers",
    header: "Anggota Keluarga",
    cell: ({ row }) => <span>{row.original.familyMembers} orang</span>,
  },
  {
    accessorKey: "phoneNumber",
    header: "Nomor Telepon",
  },
  {
    accessorKey: "kkUrl",
    header: "Lampiran",
    cell: ({ row }) => (
      <ButtonGroup>
        <Button variant="outline" asChild>
          <a
            href={row.original.kkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs"
          >
            <SquareArrowUpRight className="h-3.5 w-3.5" />
            Lihat KK
          </a>
        </Button>
        <Button variant="outline" asChild>
          <a
            href={row.original.ktpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs"
          >
            <SquareArrowUpRight className="h-3.5 w-3.5" />
            Lihat KTP
          </a>
        </Button>
      </ButtonGroup>
    ),
  },
  {
    id: "aksi",
    header: "Aksi",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="flex items-center gap-1">
          {/* View */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => {
              // TODO: buka dialog/sheet detail
              console.log("View:", user.id);
            }}
            title="Lihat detail"
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only">Lihat detail</span>
          </Button>

          {/* Edit */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-blue-600"
            onClick={() => {
              // TODO: buka form edit
              console.log("Edit:", user.id);
            }}
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>

          {/* Delete */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                title="Hapus"
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
                  <span className="font-semibold text-foreground">
                    {user.name}
                  </span>{" "}
                  ({user.residentCode}) akan dihapus secara permanen dan tidak
                  dapat dikembalikan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => {
                    // TODO: panggil API delete
                    console.log("Delete:", user.id);
                  }}
                >
                  Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];
