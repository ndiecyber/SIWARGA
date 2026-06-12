"use client";

import React from "react";

import { AlertTriangle, UsersRoundIcon } from "lucide-react";

import { FilterCategory } from "@/lib/types/filter";
import { DataTable } from "@/components/shared/data-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { UserWithResident } from "../types";
import { columns } from "../components/columns";
import { CreateUserDialog } from "../components/create-user-dialog";

// ─── Constants ───────────────────────────────────────────────────────────────

const FILTER_CATEGORIES: FilterCategory[] = [
  // {
  //   id: "duesStatus",
  //   label: "Status Iuran",
  //   options: [
  //     {
  //       label: "Lunas",
  //       value: "LUNAS",
  //       icon: (
  //         <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
  //       ),
  //     },
  //     {
  //       label: "Menunggak",
  //       value: "MENUNGGAK",
  //       icon: <span className="inline-block w-2 h-2 bg-red-500 rounded-full" />,
  //     },
  //   ],
  // },
  {
    id: "role",
    label: "Role",
    options: [
      { label: "Admin", value: "ADMIN" },
      { label: "Warga", value: "WARGA" },
    ],
  },
];

export type UserPageProps = {
  users: UserWithResident[];
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

          {/* Create User Button */}
          <CreateUserDialog />
        </div>

        <Alert className="text-yellow-800 border-yellow-200 bg-yellow-50">
          <AlertTriangle className="w-4 h-4" />
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
