"use client";

import { useMemo, useState } from "react";

import { Megaphone, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/data-table";
import { FilterCategory } from "@/lib/types/filter";
import { SortOption } from "@/lib/types/sort";

import { Announcement, createColumns } from "./columns";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";
import { AnnouncementFormDialog } from "./announcement-form-dialog";
import { AnnouncementDetailDialog } from "./announcement-detail-dialog";

// ─── Constants ────────────────────────────────────────────────────────────────

const SORT_OPTIONS: SortOption<Announcement>[] = [
  { id: "title", label: "Judul" },
  { id: "category", label: "Kategori" },
  { id: "eventDate", label: "Tgl. Acara" },
  { id: "status", label: "Status" },
];

const STATUS_FILTER: FilterCategory<Announcement> = {
  id: "status",
  label: "Status",
  options: [
    { label: "Akan Datang", value: "upcoming" },
    { label: "Berlangsung", value: "ongoing" },
    { label: "Selesai", value: "done" },
  ],
};

// ─── Stats ────────────────────────────────────────────────────────────────────

function StatsBar({ announcements }: { announcements: Announcement[] }) {
  const stats = useMemo(
    () => [
      {
        label: "Total",
        value: announcements.length,
        color: "text-foreground",
        bg: "bg-card border",
      },
      {
        label: "Akan Datang",
        value: announcements.filter((a) => a.status === "upcoming").length,
        color: "text-blue-600",
        bg: "bg-blue-50 border-blue-100",
      },
      {
        label: "Berlangsung",
        value: announcements.filter((a) => a.status === "ongoing").length,
        color: "text-emerald-600",
        bg: "bg-emerald-50 border-emerald-100",
      },
      {
        label: "Selesai",
        value: announcements.filter((a) => a.status === "done").length,
        color: "text-gray-500",
        bg: "bg-gray-50 border-gray-100",
      },
    ],
    [announcements],
  );

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className={`rounded-xl border px-4 py-3 ${s.bg} transition-all`}
        >
          <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
          <p className={`text-2xl font-bold mt-0.5 ${s.color}`}>{s.value}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

type Props = {
  announcements: Announcement[];
};

export function AnnouncementDashboard({ announcements }: Props) {
  const dbCategories = useMemo(
    () => Array.from(new Set(announcements.map((a) => a.category))),
    [announcements],
  );

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Announcement | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailTarget, setDetailTarget] = useState<Announcement | null>(null);

  const filterCategories: FilterCategory<Announcement>[] = useMemo(
    () => [
      {
        id: "category",
        label: "Kategori",
        options: dbCategories.map((cat) => ({ label: cat, value: cat })),
      },
      STATUS_FILTER,
    ],
    [dbCategories],
  );

  const columns = useMemo(
    () =>
      createColumns({
        onDetail: (a) => {
          setDetailTarget(a);
          setDetailOpen(true);
        },
        onEdit: (a) => {
          setEditTarget(a);
          setFormOpen(true);
        },
        onDelete: (a) => {
          setDeleteTarget(a);
          setDeleteOpen(true);
        },
      }),
    [],
  );

  return (
    <>
      <main className="container mx-auto">
        {/* Header */}
        <header className="flex flex-col justify-between gap-4 py-4 sm:flex-row sm:items-center md:py-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 shadow-sm rounded-xl bg-primary text-primary-foreground">
              <Megaphone className="size-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                Manajemen Pengumuman
              </h1>
              <p className="text-sm text-muted-foreground">
                Kelola pengumuman warga perumahan
              </p>
            </div>
          </div>
          <Button
            onClick={() => {
              setEditTarget(null);
              setFormOpen(true);
            }}
            className="gap-2 shrink-0"
            id="btn-add-announcement"
          >
            <Plus className="size-4" />
            Tambah Pengumuman
          </Button>
        </header>

        <StatsBar announcements={announcements} />

        <div className="mt-6">
          <DataTable
            columns={columns}
            data={announcements}
            filterCategories={filterCategories}
            sortOptions={SORT_OPTIONS}
          />
        </div>
      </main>

      {/* Dialogs */}
      <AnnouncementFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        announcement={editTarget}
        existingCategories={dbCategories}
      />

      {deleteTarget && (
        <DeleteConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          announcementId={deleteTarget.id}
          announcementTitle={deleteTarget.title}
        />
      )}

      <AnnouncementDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        announcement={detailTarget}
      />
    </>
  );
}
