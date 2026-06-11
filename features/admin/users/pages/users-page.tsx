"use client";

import React from "react";

import { AlertTriangle, UsersRoundIcon } from "lucide-react";

import { usersDummy } from "@/seed/users-dummy";
import { FilterCategory } from "@/lib/types/filter";
import { DataTable } from "@/components/shared/data-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { columns } from "../components/columns";

// ─── Constants ───────────────────────────────────────────────────────────────

const FILTER_CATEGORIES: FilterCategory[] = [
  {
    id: "duesStatus",
    label: "Status Iuran",
    options: [
      {
        label: "Lunas",
        value: "LUNAS",
        icon: (
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
        ),
      },
      {
        label: "Menunggak",
        value: "MENUNGGAK",
        icon: <span className="inline-block h-2 w-2 rounded-full bg-red-500" />,
      },
    ],
  },
  {
    id: "role",
    label: "Role",
    options: [
      { label: "Admin", value: "ADMIN" },
      { label: "Warga", value: "WARGA" },
    ],
  },
];
import { CreateUserDialog } from "../components/create-user-dialog";
import { UserModelSchema } from "@/generated/zod/schemas";
import z from "zod";
import { Role } from "@/generated/prisma/enums";
import { User } from "../types";

export type UserPageProps = {
  users: User[];
};

const UserPage = (props: UserPageProps) => {
  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-md bg-primary p-2.5">
              <UsersRoundIcon className="text-white" />
            </div>

            <div>
              <h2 className="text-xl font-medium">
                Data Penduduk RT 04 Perum Arjamukti Kencana Raya
              </h2>

              <p className="text-muted-foreground">
                Kelola dan perbarui data penduduk RT 04 Perum Arjamukti Kencana
                Raya secara akurat.
              </p>
            </div>
          </div>

          {/* <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Warga
          </Button> */}
          <CreateUserDialog />
        </div>

        <Alert className="border-yellow-200 bg-yellow-50 text-yellow-800">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Perhatian</AlertTitle>
          <AlertDescription>
            Periksa kembali data sebelum disimpan. Pastikan nama, nomor telepon,
            dan dokumen pendukung sudah sesuai agar tidak terjadi kesalahan
            administrasi.
          </AlertDescription>
        </Alert>
      </div>

      <div className="bg-white">
        <DataTable
          data={props.users}
          columns={columns}
          filterCategories={FILTER_CATEGORIES}
        />
      </div>
    </section>
  );
};

export default UserPage;
