import { UserDummy } from "@/seed/users-dummy";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, SquareArrowUpRight } from "lucide-react";
import { ButtonGroup } from "@/components/ui/button-group";

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
  {
    accessorKey: "residentCode",
    header: "Kode Warga",
    cell: ({ row }) => (
      <span className="font-mono text-sm font-medium text-muted-foreground">
        {row.original.residentCode}
      </span>
    ),
  },
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
  // {
  //   accessorKey: "role",
  //   header: "Role",
  //   cell: ({ row }) => {
  //     const role = row.original.role;
  //     return (
  //       <Badge variant={role === "ADMIN" ? "default" : "secondary"}>
  //         {role}
  //       </Badge>
  //     );
  //   },
  // },
  // {
  //   accessorKey: "duesStatus",
  //   header: "Status Iuran",
  //   cell: ({ row }) => {
  //     const status = row.original.duesStatus;
  //     return (
  //       <Badge
  //         variant={status === "LUNAS" ? "default" : "destructive"}
  //         className={
  //           status === "LUNAS"
  //             ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200"
  //             : "bg-red-100 text-red-700 hover:bg-red-100 border-red-200"
  //         }
  //       >
  //         {status}
  //       </Badge>
  //     );
  //   },
  // },
  // {
  //   accessorKey: "duesAmount",
  //   header: "Nominal Iuran",
  //   cell: ({ row }) => (
  //     <span className="tabular-nums">
  //       {formatCurrency(row.original.duesAmount)}
  //     </span>
  //   ),
  // },
  {
    accessorKey: "kkUrl",
    header: "Lampiran",
    cell: ({ row }) => (
      <ButtonGroup>
        <Button variant={"outline"}>
          <SquareArrowUpRight />
          <a
            className="text-xs"
            href={row.original.kkUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Lihat KK
          </a>
        </Button>{" "}
        <Button variant={"outline"}>
          <Link />
          <a
            className="text-xs"
            href={row.original.ktpUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Lihat KTP
          </a>
        </Button>
      </ButtonGroup>
    ),
  },
  {
    accessorKey: "ktpUrl",
    header: "KTP",
    cell: ({ row }) => (
      <Button variant={"outline"}>
        <Link />
        <a
          href={row.original.ktpUrl}
          target="_blank"
          rel="noopener noreferrer"
          className=""
        >
          Lihat KTP
        </a>
      </Button>
    ),
  },
  // {
  //   accessorKey: "createdAt",
  //   header: "Tanggal Dibuat",
  //   cell: ({ row }) => formatDate(row.original.createdAt),
  // },
  // {
  //   accessorKey: "updatedAt",
  //   header: "Terakhir Diubah",
  //   cell: ({ row }) => formatDate(row.original.updatedAt),
  // },
];
