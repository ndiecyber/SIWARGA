"use client";

import { useState, useTransition, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import {
  createAnnouncement,
  updateAnnouncement,
} from "@/app/admin/announcment/actions";

type Announcement = {
  id: number;
  category: string;
  title: string;
  description: string;
  eventDate: Date | null;
  status: string;
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  /** Pass an announcement to edit; undefined/null = create mode */
  announcement?: Announcement | null;
  existingCategories?: string[];
};

const CATEGORIES = [
  "Keamanan",
  "Kebersihan",
  "Keuangan",
  "Sosial",
  "Infrastruktur",
  "Lainnya",
];

const STATUSES = [
  { value: "upcoming", label: "Akan Datang" },
  { value: "ongoing", label: "Berlangsung" },
  { value: "done", label: "Selesai" },
];

type FormData = {
  category: string;
  title: string;
  description: string;
  eventDate: string;
  status: string;
};

const empty: FormData = {
  category: "",
  title: "",
  description: "",
  eventDate: "",
  status: "upcoming",
};

export function AnnouncementFormDialog({
  open,
  onOpenChange,
  announcement,
  existingCategories = [],
}: Props) {
  const isEdit = !!announcement;
  const [isPending, startTransition] = useTransition();

  const categoriesList = useMemo(() => {
    return Array.from(
      new Set([
        ...CATEGORIES,
        ...existingCategories.filter(
          (cat) => cat && cat !== "custom" && cat.trim() !== "",
        ),
      ]),
    );
  }, [existingCategories]);

  const [isCustomCategory, setIsCustomCategory] = useState(() =>
    announcement ? !categoriesList.includes(announcement.category) : false,
  );

  const [form, setForm] = useState<FormData>(() =>
    announcement
      ? {
          category: announcement.category,
          title: announcement.title,
          description: announcement.description ?? "",
          eventDate: announcement.eventDate
            ? new Date(announcement.eventDate).toISOString().split("T")[0]
            : "",
          status: announcement.status,
        }
      : { ...empty },
  );

  useEffect(() => {
    if (open) {
      setIsCustomCategory(
        announcement ? !categoriesList.includes(announcement.category) : false,
      );
      setForm(
        announcement
          ? {
              category: announcement.category,
              title: announcement.title,
              description: announcement.description ?? "",
              eventDate: announcement.eventDate
                ? new Date(announcement.eventDate).toISOString().split("T")[0]
                : "",
              status: announcement.status,
            }
          : { ...empty },
      );
    }
  }, [open, announcement, categoriesList]);

  function handleOpenChange(v: boolean) {
    if (v) {
      setIsCustomCategory(
        announcement ? !categoriesList.includes(announcement.category) : false,
      );
      setForm(
        announcement
          ? {
              category: announcement.category,
              title: announcement.title,
              description: announcement.description ?? "",
              eventDate: announcement.eventDate
                ? new Date(announcement.eventDate).toISOString().split("T")[0]
                : "",
              status: announcement.status,
            }
          : { ...empty },
      );
    }
    onOpenChange(v);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const categoryVal = form.category.trim();
    const titleVal = form.title.trim();
    const descVal = form.description.trim() || null;
    const dateVal = form.eventDate.trim();

    if (!categoryVal) {
      toast.error("Kategori wajib dipilih atau diisi.");
      return;
    }
    if (!titleVal) {
      toast.error("Judul wajib diisi.");
      return;
    }
    if (!dateVal) {
      toast.error("Tanggal Acara wajib diisi.");
      return;
    }

    startTransition(async () => {
      try {
        const data = {
          category: categoryVal,
          title: titleVal,
          description: descVal,
          eventDate: dateVal,
          status: form.status,
        };

        if (isEdit && announcement) {
          await updateAnnouncement(announcement.id, {
            category: data.category,
            title: data.title,
            description: data.description ? data.description : "",
            eventDate: data.eventDate,
            status: data.status,
          });
          toast.success("Pengumuman berhasil diperbarui!");
        } else {
          await createAnnouncement({
            category: data.category,
            title: data.title,
            description: data.description ? data.description : "",
            eventDate: data.eventDate,
            status: data.status,
          });
          toast.success("Pengumuman berhasil ditambahkan!");
        }
        onOpenChange(false);
        setForm({ ...empty });
      } catch (error) {
        console.error(error);
        toast.error("Terjadi kesalahan. Silakan coba lagi.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {isEdit ? "Edit Pengumuman" : "Tambah Pengumuman"}
          </DialogTitle>
        </DialogHeader>

        <form
          id="announcement-form"
          onSubmit={handleSubmit}
          className="space-y-4 py-2"
        >
          {/* Kategori */}
          <div className="space-y-1.5">
            <Label htmlFor="category">
              Kategori <span className="text-destructive">*</span>
            </Label>
            <Select
              value={isCustomCategory ? "custom" : form.category}
              onValueChange={(v) => {
                if (v === "custom") {
                  setIsCustomCategory(true);
                  setForm((f) => ({ ...f, category: "" }));
                } else {
                  setIsCustomCategory(false);
                  setForm((f) => ({ ...f, category: v }));
                }
              }}
              required
            >
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Pilih kategori..." />
              </SelectTrigger>
              <SelectContent>
                {categoriesList.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
                <SelectItem value="custom">Kustom (Input Manual)...</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Kategori Kustom */}
          {isCustomCategory && (
            <div className="space-y-1.5 animate-in fade-in duration-200">
              <Label htmlFor="customCategory">
                Nama Kategori Baru <span className="text-destructive">*</span>
              </Label>
              <Input
                id="customCategory"
                placeholder="Masukkan nama kategori baru..."
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                required
              />
            </div>
          )}

          {/* Judul */}
          <div className="space-y-1.5">
            <Label htmlFor="title">
              Judul <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Judul pengumuman..."
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              required
            />
          </div>

          {/* Deskripsi */}
          <div className="space-y-1.5">
            <Label htmlFor="description">
              Deskripsi{" "}
              <span className="text-muted-foreground text-xs font-normal">
                (opsional)
              </span>
            </Label>
            <Textarea
              id="description"
              placeholder="Isi pengumuman..."
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </div>

          {/* Tanggal Acara */}
          <div className="space-y-1.5">
            <Label htmlFor="eventDate">
              Tanggal Acara <span className="text-destructive">*</span>
            </Label>
            <Input
              id="eventDate"
              type="date"
              value={form.eventDate}
              onChange={(e) =>
                setForm((f) => ({ ...f, eventDate: e.target.value }))
              }
              required
            />
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label htmlFor="status">
              Status <span className="text-destructive">*</span>
            </Label>
            <Select
              value={form.status}
              onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}
            >
              <SelectTrigger id="status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </form>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline" type="button" disabled={isPending}>
              Batal
            </Button>
          </DialogClose>
          <Button type="submit" form="announcement-form" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            {isEdit ? "Simpan Perubahan" : "Tambah"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
