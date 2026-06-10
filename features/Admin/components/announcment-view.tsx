"use client";

import { useState, useMemo, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  Megaphone,
  CalendarDays,
  Tag,
  Filter,
} from "lucide-react";
import { AnnouncementFormDialog } from "./announcement-form-dialog";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";
import { AnnouncementDetailDialog } from "./announcement-detail-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Announcement = {
  id: number;
  category: string;
  title: string;
  description: string;
  eventDate: Date | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

type Props = {
  announcements: Announcement[];
};

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline"; className: string }
> = {
  upcoming: {
    label: "Akan Datang",
    variant: "default",
    className: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100",
  },
  ongoing: {
    label: "Berlangsung",
    variant: "secondary",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
  },
  done: {
    label: "Selesai",
    variant: "outline",
    className: "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-100",
  },
};

const CATEGORY_COLORS: Record<string, string> = {
  Keamanan: "bg-red-50 text-red-600 border-red-100",
  Kebersihan: "bg-green-50 text-green-600 border-green-100",
  Keuangan: "bg-yellow-50 text-yellow-700 border-yellow-100",
  Sosial: "bg-purple-50 text-purple-600 border-purple-100",
  Infrastruktur: "bg-orange-50 text-orange-600 border-orange-100",
  Lainnya: "bg-slate-50 text-slate-600 border-slate-100",
};

export function AnnouncementDashboard({ announcements }: Props) {
  const dbCategories = useMemo(() => {
    return Array.from(new Set(announcements.map((a) => a.category)));
  }, [announcements]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Form dialog state
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Announcement | null>(null);

  // Delete dialog state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null);

  // Detail dialog state
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailTarget, setDetailTarget] = useState<Announcement | null>(null);

  // Filtered list
  const filtered = announcements.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    const matchCategory = categoryFilter === "all" || a.category === categoryFilter;
    return matchSearch && matchStatus && matchCategory;
  });

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, categoryFilter, pageSize]);

  // Paginated list calculations
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginated = filtered.slice(startIndex, endIndex);

  function openCreate() {
    setEditTarget(null);
    setFormOpen(true);
  }

  function openEdit(a: Announcement) {
    setEditTarget(a);
    setFormOpen(true);
  }

  function openDelete(a: Announcement) {
    setDeleteTarget(a);
    setDeleteOpen(true);
  }

  function openDetail(a: Announcement) {
    setDetailTarget(a);
    setDetailOpen(true);
  }

  // Stats
  const total = announcements.length;
  const upcoming = announcements.filter((a) => a.status === "upcoming").length;
  const ongoing = announcements.filter((a) => a.status === "ongoing").length;
  const done = announcements.filter((a) => a.status === "done").length;

  return (
    <>
      {/* ───── Header ───── */}
      <div className="px-6 pt-6 pb-2 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
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
          <Button onClick={openCreate} className="gap-2 shrink-0" id="btn-add-announcement">
            <Plus className="size-4" />
            Tambah Pengumuman
          </Button>
        </div>

        {/* ───── Stats Cards ───── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total", value: total, color: "text-foreground", bg: "bg-card border" },
            { label: "Akan Datang", value: upcoming, color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
            { label: "Berlangsung", value: ongoing, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
            { label: "Selesai", value: done, color: "text-gray-500", bg: "bg-gray-50 border-gray-100" },
          ].map((s) => (
            <div
              key={s.label}
              className={`rounded-xl border px-4 py-3 ${s.bg} transition-all`}
            >
              <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
              <p className={`text-2xl font-bold mt-0.5 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* ───── Filters ───── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="search-announcement"
              placeholder="Cari judul, kategori, atau isi..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <Filter className="size-4 text-muted-foreground shrink-0" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-44" id="filter-category">
                  <SelectValue placeholder="Semua Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {dbCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-44" id="filter-status">
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="upcoming">Akan Datang</SelectItem>
                  <SelectItem value="ongoing">Berlangsung</SelectItem>
                  <SelectItem value="done">Selesai</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* ───── Table ───── */}
      <div className="px-6 pb-8">
        <Card className="overflow-hidden border shadow-sm">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <Megaphone className="size-8 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">
                {search || statusFilter !== "all"
                  ? "Tidak ada pengumuman yang cocok"
                  : "Belum ada pengumuman"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {search || statusFilter !== "all"
                  ? "Coba ubah filter atau kata kunci pencarian"
                  : "Klik tombol Tambah Pengumuman untuk memulai"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground w-8">
                      No
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Judul
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden md:table-cell">
                      Kategori
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden lg:table-cell">
                      Tgl. Acara
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Status
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginated.map((a, idx) => {
                    const status =
                      STATUS_CONFIG[a.status] ?? STATUS_CONFIG.done;
                    const catColor =
                      CATEGORY_COLORS[a.category] ?? CATEGORY_COLORS.Lainnya;
                    const globalIdx = startIndex + idx + 1;

                    return (
                      <tr
                        key={a.id}
                        className="hover:bg-muted/30 transition-colors group"
                      >
                        {/* No */}
                        <td className="px-4 py-3.5 text-muted-foreground font-medium w-8">
                          {globalIdx}
                        </td>

                        {/* Judul + preview */}
                        <td className="px-4 py-3.5 max-w-xs">
                          <p className="font-medium text-foreground line-clamp-1">
                            {a.title}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {a.description}
                          </p>
                        </td>

                        {/* Kategori */}
                        <td className="px-4 py-3.5 hidden md:table-cell">
                          <span
                            className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${catColor}`}
                          >
                            <Tag className="size-3" />
                            {a.category}
                          </span>
                        </td>

                        {/* Tgl Acara */}
                        <td className="px-4 py-3.5 hidden lg:table-cell">
                          {a.eventDate ? (
                            <span className="flex items-center gap-1.5 text-muted-foreground">
                              <CalendarDays className="size-3.5" />
                              {new Date(a.eventDate).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/50">—</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${status.className}`}
                          >
                            {status.label}
                          </span>
                        </td>

                        {/* Aksi */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              id={`btn-detail-${a.id}`}
                              size="icon"
                              variant="ghost"
                              className="size-8 text-muted-foreground hover:text-foreground"
                              title="Lihat Detail"
                              onClick={() => openDetail(a)}
                            >
                              <Eye className="size-4" />
                            </Button>
                            <Button
                              id={`btn-edit-${a.id}`}
                              size="icon"
                              variant="ghost"
                              className="size-8 text-muted-foreground hover:text-primary"
                              title="Edit"
                              onClick={() => openEdit(a)}
                            >
                              <Pencil className="size-4" />
                            </Button>
                            <Button
                              id={`btn-delete-${a.id}`}
                              size="icon"
                              variant="ghost"
                              className="size-8 text-muted-foreground hover:text-destructive"
                              title="Hapus"
                              onClick={() => openDelete(a)}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="border-t px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                <div>
                  Menampilkan <span className="font-medium text-foreground">{totalItems === 0 ? 0 : startIndex + 1}</span> sampai{" "}
                  <span className="font-medium text-foreground">{endIndex}</span> dari{" "}
                  <span className="font-medium text-foreground">{totalItems}</span> pengumuman
                  {filtered.length !== announcements.length && (
                    <span> (difilter dari {total} total)</span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  {/* Page Size Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs">Baris per halaman:</span>
                    <Select
                      value={String(pageSize)}
                      onValueChange={(v) => setPageSize(Number(v))}
                    >
                      <SelectTrigger className="h-8 w-16 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-2"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Sebelumnya
                    </Button>
                    <span className="text-xs font-medium px-2">
                      Halaman {currentPage} dari {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-2"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Selanjutnya
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* ───── Dialogs ───── */}
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
