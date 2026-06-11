import { UserDummy } from "@/seed/users-dummy";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, SquareArrowUpRight, Trash2 } from "lucide-react";
import { ButtonGroup } from "@/components/ui/button-group";

import { User } from "../types";
import { UpdateUserDialog } from "./update-user-dialog";
import { DeleteUserDialog } from "./delete-user-dialog";
import DetailUserDialog from "./detail-user-dialog";
import ButtonActionDropdownProps from "@/components/shared/button-action-dropdown";
import ButtonActionDropdown from "@/components/shared/button-action-dropdown";

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

export const columns: ColumnDef<User>[] = [
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
          {/* {row.original.resident_number} */}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "block",
    header: "Blok",
    cell: ({ row }) => (
      <span className="font-semibold">{/* {row.original.block} */}A</span>
    ),
  },
  {
    accessorKey: "familyMembers",
    header: "Anggota Keluarga",
    cell: ({ row }) => <span>{/* {row.original.familyMembers} */}7 orang</span>,
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

      // return (
      //   <div className="flex items-center gap-1">
      //     {/* View */}
      //     <DetailUserDialog user={user}>
      //       <Button
      //         variant={"ghost"}
      //         className="size-8 text-muted-foreground hover:text-foreground"
      //         title="Lihat Detail"
      //         size={"icon"}
      //       >
      //         <Eye className="size-4" />
      //         <span className="sr-only">Lihat Detail</span>
      //       </Button>
      //     </DetailUserDialog>

      //     {/* Update */}
      //     <UpdateUserDialog id={row.original.id} />

      //     {/* Delete */}
      //     <DeleteUserDialog user={user} />
      //   </div>
      // );
      return (
        <ButtonActionDropdown>
          {/* Detail */}
          <DetailUserDialog user={user}>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Eye className="size-4" />
              <span>Detail</span>
            </Button>
          </DetailUserDialog>

          {/* Update */}
          <UpdateUserDialog id={row.original.id} />

          {/* Delete */}
          <DeleteUserDialog user={user} />
        </ButtonActionDropdown>
      );
    },
  },
];
