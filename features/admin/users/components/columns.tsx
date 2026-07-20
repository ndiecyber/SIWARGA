import { PhoneIcon, SquareArrowUpRight } from "lucide-react";
import { parsePhoneNumberFromString } from "libphonenumber-js";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ButtonGroup } from "@/components/ui/button-group";
import { UserGetPayload } from "@/generated/prisma/models";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// const formatCurrency = (amount: number) =>
//   new Intl.NumberFormat("id-ID", {
//     style: "currency",
//     currency: "IDR",
//     minimumFractionDigits: 0,
//   }).format(amount);

// const formatDate = (dateStr: string) =>
//   new Date(dateStr).toLocaleDateString("id-ID", {
//     day: "2-digit",
//     month: "long",
//     year: "numeric",
//   });

export const columns: ColumnDef<
  UserGetPayload<{
    include: {
      residentProfile: {
        include: {
          house: true;
          familyMembers: true;
        };
      };
    };
  }>
>[] = [
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
    id: "houseNumber",
    // header: "Nomor Rumah",
    header: () => <div className="flex justify-center">Nomor Rumah</div>,
    accessorFn: (row) => {
      if (!row.residentProfile) return "-";

      return (
        row.residentProfile.house.block + row.residentProfile.house.houseNumber
      );
    },
    cell: ({ getValue }) => {
      const houseNumber = getValue() as string;

      return (
        <div className="font-semibold text-center uppercase">{houseNumber}</div>
      );
    },
  },
  {
    id: "familyMembers",
    header: "Anggota Keluarga",
    accessorFn: (row) => {
      if (!row.residentProfile) return 0;

      return row.residentProfile.familyMembers.length;
    },
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
    id: "phoneNumber",
    header: () => <div className="flex justify-center">Nomor Telepon</div>,
    accessorFn: (row) => {
      const phoneNumber = parsePhoneNumberFromString(row.phoneNumber, "ID");

      if (phoneNumber) {
        return phoneNumber.formatNational();
      }

      return row.phoneNumber;
    },
    cell: ({ row, getValue }) => {
      const phoneNumber = getValue() as string;

      const rawPhoneNumber = parsePhoneNumberFromString(
        row.original.phoneNumber,
        "ID",
      );

      const internationalPhoneNumber = rawPhoneNumber!
        .format("E.164")
        .replace("+", "");

      return (
        <div className="flex justify-center gap-1">
          <Badge variant="outline">{phoneNumber}</Badge>
          <Tooltip>
            <TooltipTrigger>
              <a
                href={`https://wa.me/${internationalPhoneNumber}`}
                target="_blank"
              >
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-muted"
                >
                  <PhoneIcon size={12} />
                  Whatsapp
                </Badge>
              </a>
            </TooltipTrigger>
            <TooltipContent>
              <span>Buka di Whatsapp</span>
            </TooltipContent>
          </Tooltip>
        </div>
      );
    },
  },
  {
    accessorKey: "kkUrl",
    // header: "Lampiran",
    header: () => <div className="flex justify-center">Lampiran</div>,
    cell: ({ row }) => (
      <ButtonGroup className="flex justify-center w-full ">
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
