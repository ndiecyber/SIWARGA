import { SquareArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ButtonGroup } from "@/components/ui/button-group";

import { UserWithResident } from "../types";

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

export const columns: ColumnDef<UserWithResident>[] = [
  {
    accessorKey: "name",
    header: "Nama",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.name}</span>
        <span className="font-mono text-xs text-muted-foreground">
          {row.original.identificationNumber}
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
    // 1. Point to the relation path for tracking updates/sorting accurately
    id: "familyCount",
    header: "Anggota Keluarga",
    // 2. Use an explicit accessorFn so TanStack can sort/filter by this calculated number
    accessorFn: (row) => row.residentProfile?.familyMembers?.length ?? 0,
    cell: ({ getValue }) => {
      const count = getValue() as number;

      return (
        <span>
          {count === 0 ? "Tidak ada anggota keluarga" : `${count} orang`}
        </span>
      );
    },
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
        <Button variant="outline" disabled={row.original.kkUrl === ""} asChild>
          <a
            href={row.original.kkUrl ?? ""}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs"
          >
            <SquareArrowUpRight className="h-3.5 w-3.5" />
            Lihat KK
          </a>
        </Button>
        <Button variant="outline" disabled={row.original.ktpUrl === ""} asChild>
          <a
            href={row.original.ktpUrl ?? ""}
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
];
