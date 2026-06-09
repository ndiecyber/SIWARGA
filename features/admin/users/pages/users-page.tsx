"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

import React from "react";
import { DataTable } from "../components/data-table";
import { usersDummy } from "@/seed/users-dummy";
import { columns } from "../components/columns";

const UserPage = () => {
  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-medium">
            Data Penduduk RT 04 Perum Arjamukti Kencana Raya
          </h2>

          <p className="text-muted-foreground">
            Kelola dan perbarui data penduduk RT 04 Perum Arjamukti Kencana Raya
            secara akurat.
          </p>
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
        <DataTable data={usersDummy} columns={columns} />
      </div>
    </section>
  );
};

export default UserPage;
