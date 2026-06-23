"use client";

import { useState } from "react";

import {
  AlertTriangle,
  Download,
  EyeIcon,
  PencilIcon,
  Trash2Icon,
  UsersRoundIcon,
} from "lucide-react";

import { SortOption } from "@/lib/types/sort";
import { FilterCategory } from "@/lib/types/filter";
import { UserGetPayload } from "@/generated/prisma/models";
import type { User as UserBase } from "@/generated/prisma/browser";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ActionOption,
  DataTable,
  withActionColumn,
  withSelectColumn,
} from "@/components/shared/data-table";

import { columns } from "../components/columns";
import DetailUserDialog from "../components/detail-user-dialog";
import { CreateUserDialog } from "../components/create-user-dialog";
import { UpdateUserDialog } from "../components/update-user-dialog";
import { DeleteUserDialog } from "../components/delete-user-dialog";
import { BatchDeleteDialog } from "@/components/shared/batch-delete-dialog";
import { deleteBatchUsersAction } from "../action";

type User = UserGetPayload<{
  include: {
    residentProfile: {
      include: { house: true; familyMembers: true };
    };
  };
}>;

// ─── Constants ───────────────────────────────────────────────────────────────

const filterCategories: FilterCategory[] = [
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

const sortOptions: SortOption[] = [
  {
    id: "name",
    label: "Nama",
  },
  {
    id: "houseNumber",
    label: "Nomor Rumah",
  },
];

export type Props = {
  users: User[];
};

const UserPage = (props: Props) => {
  const [detailTarget, setDetailTarget] = useState<UserBase | null>(null);
  const [editTarget, setEditTarget] = useState<UserBase | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserBase | null>(null);
  const [batchDeleteTarget, setBatchDeleteTarget] = useState<User[] | null>(
    null,
  );

  const batchActions: ActionOption<User>[] = [
    {
      label: "Delete",
      icon: <Trash2Icon size={16} />,
      onClick: (rows) => setBatchDeleteTarget(rows as User[]),
      destructive: true,
    },
  ];

  const usersColumns = withActionColumn(withSelectColumn(columns), [
    {
      label: "Detail",
      icon: <EyeIcon size={16} />,
      onClick: (row) => setDetailTarget(row as UserBase),
    },
    {
      label: "Edit",
      icon: <PencilIcon size={16} />,
      onClick: (row) => setEditTarget(row as UserBase),
    },
    {
      label: "Delete",
      icon: <Trash2Icon size={16} />,
      onClick: (row) => setDeleteTarget(row as UserBase),
      destructive: true,
    },
  ]);

  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
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
          columns={usersColumns}
          filterCategories={filterCategories}
          sortOptions={sortOptions}
          batchActions={batchActions}
          totalCount={props.users.length}
          pageCount={1}
          page={0}
          pageSize={10}
          onPageChange={() => {}}
        />
      </div>

      {detailTarget && (
        <DetailUserDialog
          user={detailTarget}
          open={true}
          onOpenChange={(open) => {
            if (!open) setDetailTarget(null);
          }}
        />
      )}

      {editTarget && (
        <UpdateUserDialog
          id={editTarget.id}
          open={true}
          onOpenChange={(open) => {
            if (!open) setEditTarget(null);
          }}
        />
      )}

      {deleteTarget && (
        <DeleteUserDialog
          user={deleteTarget}
          open={true}
          onOpenChange={(open) => {
            if (!open) setDeleteTarget(null);
          }}
        />
      )}

      {batchDeleteTarget && (
        <BatchDeleteDialog
          items={batchDeleteTarget.map((u) => ({ id: u.id, label: u.name }))}
          open={true}
          onOpenChange={(open) => {
            if (!open) setBatchDeleteTarget(null);
          }}
          onDelete={deleteBatchUsersAction}
          entityLabel="warga"
        />
      )}
    </section>
  );
};

export default UserPage;
