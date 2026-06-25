"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  Megaphone,
  Search,
  X,
  Clock,
  CheckCircle2,
  ChevronRight,
  Waves,
} from "lucide-react";
import HeaderProfile from "../components/header-profile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

// ─── Types ───────────────────────────────────────────────────────────────────

type AnnouncementItem = {
  id: number;
  category: string;
  title: string;
  description: string;
  imageUrl: string | null;
  eventDate: string | null;
  createdAt: string;
  status: string;
};

type AnnouncementPageProps = {
  announcements: AnnouncementItem[];
};

// ─── Status Helpers ──────────────────────────────────────────────────────────

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  upcoming: {
    label: "Akan Datang",
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  ongoing: {
    label: "Berlangsung",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  done: {
    label: "Selesai",
    color: "bg-gray-50 text-gray-500 border-gray-200",
  },
};

function getStatusLabel(status: string) {
  return (
    STATUS_MAP[status] ?? {
      label: status,
      color: "bg-gray-50 text-gray-500 border-gray-200",
    }
  );
}

// ─── Category Color Map ──────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  Kegiatan: "bg-blue-50 text-blue-700 border-blue-200",
  KegiatanWarga: "bg-blue-50 text-blue-700 border-blue-200",
  Keuangan: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Keamanan: "bg-rose-50 text-rose-700 border-rose-200",
  Informasi: "bg-violet-50 text-violet-700 border-violet-200",
  Info: "bg-violet-50 text-violet-700 border-violet-200",
};

function getCategoryColor(category: string): string {
  return (
    CATEGORY_COLORS[category] ??
    "bg-orange-50 text-orange-700 border-orange-200"
  );
}

// ─── Page Component ──────────────────────────────────────────────────────────

export default function AnnouncementPage({
  announcements,
}: AnnouncementPageProps) {
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState<AnnouncementItem | null>(null);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(announcements.map((a) => a.category)));
    return ["Semua", ...cats];
  }, [announcements]);

  const filtered = useMemo(() => {
    let result = announcements;
    if (activeCategory !== "Semua") {
      result = result.filter((a) => a.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q),
      );
    }
    return result;
  }, [announcements, activeCategory, searchQuery]);

  return (
    <>
      <HeaderProfile name="Warga" />

      <div className="flex min-h-dvh flex-col gap-4 bg-muted/40 px-4 py-6">
        {/* ── Hero Section ───────────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary to-primary/80 p-5 text-primary-foreground shadow-sm">
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -right-6 -top-6 size-28 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-8 -left-8 size-36 rounded-full bg-white/5" />

          <div className="relative space-y-4">
            {/* Greeting */}
            <p className="flex items-center gap-1.5 text-sm font-medium text-primary-foreground/90">
              <Waves className="size-4" />
              Selamat Datang
            </p>

            {/* Title + Description */}
            <div>
              <h1 className="text-xl font-extrabold tracking-tight">
                Pengumuman Warga
              </h1>
              <p className="mt-1 text-xs leading-relaxed text-primary-foreground/80">
                Informasi terbaru dan kegiatan di lingkungan Anda
              </p>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari pengumuman..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 rounded-xl border-0 bg-white/20 pl-9 text-sm text-primary-foreground placeholder:text-primary-foreground/60 ring-1 ring-white/20 focus-visible:ring-white/40 focus-visible:ring-2"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-foreground/70 hover:text-primary-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Category Filter ────────────────────────────────────── */}
        <div className="-mx-4 overflow-x-auto px-4 pb-1 scrollbar-hide">
          <div className="flex snap-x gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "snap-start shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200",
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-card text-muted-foreground border border-border hover:border-primary/30 hover:text-foreground",
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── Announcement Feed ──────────────────────────────────── */}
        <section className="flex-1">
          {filtered.length === 0 ? (
            <EmptyState
              hasAnnouncements={announcements.length > 0}
              hasSearch={searchQuery.trim().length > 0}
              onClearSearch={() => setSearchQuery("")}
              onClearFilter={() => setActiveCategory("Semua")}
            />
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filtered.map((item, i) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                  >
                    {item.imageUrl ? (
                      <SocialCardWithImage
                        item={item}
                        onDetail={() => setSelected(item)}
                      />
                    ) : (
                      <SocialCard
                        item={item}
                        onDetail={() => setSelected(item)}
                      />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>
      </div>

      {/* ── Detail Dialog ────────────────────────────────────────── */}
      <Dialog
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent
          className="max-w-lg rounded-2xl sm:rounded-2xl"
          showCloseButton={false}
        >
          {selected && <AnnouncementDetail item={selected} />}
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────

function EmptyState({
  hasAnnouncements,
  hasSearch,
  onClearSearch,
  onClearFilter,
}: {
  hasAnnouncements: boolean;
  hasSearch: boolean;
  onClearSearch: () => void;
  onClearFilter: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className="grid size-16 place-items-center rounded-2xl bg-muted text-muted-foreground">
        <Megaphone size={28} />
      </div>
      <div className="text-center">
        {hasSearch ? (
          <>
            <h2 className="text-sm font-bold">Pencarian Tidak Ditemukan</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Tidak ada pengumuman dengan kata kunci tersebut.
            </p>
            <button
              onClick={onClearSearch}
              className="mt-3 text-xs font-semibold text-primary hover:underline"
            >
              Hapus pencarian
            </button>
          </>
        ) : hasAnnouncements ? (
          <>
            <h2 className="text-sm font-bold">Tidak Ada Hasil</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Tidak ada pengumuman di kategori ini.
            </p>
            <button
              onClick={onClearFilter}
              className="mt-3 text-xs font-semibold text-primary hover:underline"
            >
              Tampilkan semua kategori
            </button>
          </>
        ) : (
          <>
            <h2 className="text-sm font-bold">Belum Ada Pengumuman</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Belum ada pengumuman yang dipublikasikan.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Social Card (Without Image) ─────────────────────────────────────────────

function SocialCard({
  item,
  onDetail,
}: {
  item: AnnouncementItem;
  onDetail: () => void;
}) {
  const statusInfo = getStatusLabel(item.status);

  return (
    <button
      onClick={onDetail}
      className="group w-full text-left rounded-2xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.99]"
    >
      <div className="p-4">
        {/* Top row: category + status */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <span
            className={cn(
              "inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold",
              getCategoryColor(item.category),
            )}
          >
            {item.category}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold",
              statusInfo.color,
            )}
          >
            {item.status === "upcoming" && <Clock className="size-3" />}
            {item.status === "ongoing" && <CheckCircle2 className="size-3" />}
            {item.status === "done" && <CheckCircle2 className="size-3" />}
            {statusInfo.label}
          </span>
        </div>

        {/* Date */}
        <div className="mb-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <CalendarDays className="size-3.5" />
          {item.createdAt}
          {item.eventDate && (
            <>
              <span className="text-muted-foreground/40">•</span>
              <span>Acara: {item.eventDate}</span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors duration-200">
          {item.title}
        </h3>

        {/* Description */}
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-3">
          {item.description}
        </p>

        {/* Read more - always visible */}
        <div className="mt-3 flex items-center gap-0.5 text-xs font-semibold text-primary">
          Baca Selengkapnya
          <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </button>
  );
}

// ─── Social Card (With Image) ────────────────────────────────────────────────

function SocialCardWithImage({
  item,
  onDetail,
}: {
  item: AnnouncementItem;
  onDetail: () => void;
}) {
  const statusInfo = getStatusLabel(item.status);
  const [imgError, setImgError] = useState(false);

  if (imgError || !item.imageUrl) {
    return <SocialCard item={item} onDetail={onDetail} />;
  }

  return (
    <button
      onClick={onDetail}
      className="group w-full text-left overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.99]"
    >
      {/* Thumbnail Image — full width, top of card (like Instagram/Facebook) */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.imageUrl}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          onError={() => setImgError(true)}
        />
      </div>

      <div className="p-4">
        {/* Top row: category + status */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <span
            className={cn(
              "inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold",
              getCategoryColor(item.category),
            )}
          >
            {item.category}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold",
              statusInfo.color,
            )}
          >
            {statusInfo.label}
          </span>
        </div>

        {/* Date */}
        <div className="mb-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <CalendarDays className="size-3.5" />
          {item.createdAt}
          {item.eventDate && (
            <>
              <span className="text-muted-foreground/40">•</span>
              <span>Acara: {item.eventDate}</span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors duration-200">
          {item.title}
        </h3>

        {/* Description */}
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
          {item.description}
        </p>

        {/* Read more - always visible */}
        <div className="mt-3 flex items-center gap-0.5 text-xs font-semibold text-primary">
          Baca Selengkapnya
          <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </button>
  );
}

// ─── Detail Dialog Content ───────────────────────────────────────────────────

function AnnouncementDetail({ item }: { item: AnnouncementItem }) {
  const statusInfo = getStatusLabel(item.status);
  const [imgError, setImgError] = useState(false);

  return (
    <>
      <DialogHeader>
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold",
              getCategoryColor(item.category),
            )}
          >
            {item.category}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold",
              statusInfo.color,
            )}
          >
            {statusInfo.label}
          </span>
        </div>
        <DialogTitle className="mt-3 text-base font-extrabold">
          {item.title}
        </DialogTitle>
        <div className="mt-1 space-y-0.5">
          <DialogDescription className="flex items-center gap-1.5 text-xs">
            <CalendarDays className="size-3.5 shrink-0" />
            Dipublikasikan {item.createdAt}
          </DialogDescription>
          {item.eventDate && (
            <DialogDescription className="flex items-center gap-1.5 text-xs">
              <Clock className="size-3.5 shrink-0" />
              Tanggal Acara: {item.eventDate}
            </DialogDescription>
          )}
        </div>
      </DialogHeader>

      {/* Image in dialog */}
      {item.imageUrl && !imgError && (
        <div className="-mx-6 -mt-2 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.imageUrl}
            alt={item.title}
            className="aspect-video w-full object-cover"
            onError={() => setImgError(true)}
          />
        </div>
      )}

      <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
        {item.description}
      </div>

      <DialogClose asChild>
        <Button variant="outline" className="mt-2 w-full rounded-xl">
          Tutup
        </Button>
      </DialogClose>
    </>
  );
}
