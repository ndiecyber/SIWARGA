"use client";

import { useState, useTransition } from "react";
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
}: Props) {
  const isEdit = !!announcement;
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState<FormData>(() =>
    announcement
      ? {
          category: announcement.category,
          title: announcement.title,
          description: announcement.description,
          eventDate: announcement.eventDate
            ? announcement.eventDate.toISOString().split("T")[0]
            : "",
          status: announcement.status,
        }
      : { ...empty }
  );

  function handleOpenChange(v: boolean) {
    if (v) {
      setForm(
        announcement
          ? {
              category: announcement.category,
              title: announcement.title,
              description: announcement.description,
              eventDate: announcement.eventDate
                ? announcement.eventDate.toISOString().split("T")[0]
                : "",
              status: announcement.status,
            }
          : { ...empty }
      );
    }
    onOpenChange(v);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      // TODO: connect to server action when DB is ready
      await new Promise((r) => setTimeout(r, 600)); // simulate delay
      if (isEdit) {
        toast.success("Pengumuman berhasil diperbarui!");
      } else {
        toast.success("Pengumuman berhasil ditambahkan!");
      }
      onOpenChange(false);
      setForm({ ...empty });
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
            <Label htmlFor="category">Kategori</Label>
            <Select
              value={form.category}
              onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
              required
            >
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Pilih kategori..." />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Judul */}
          <div className="space-y-1.5">
            <Label htmlFor="title">Judul</Label>
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
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              placeholder="Isi pengumuman..."
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              required
            />
          </div>

          {/* Tanggal Acara */}
          <div className="space-y-1.5">
            <Label htmlFor="eventDate">Tanggal Acara (opsional)</Label>
            <Input
              id="eventDate"
              type="date"
              value={form.eventDate}
              onChange={(e) =>
                setForm((f) => ({ ...f, eventDate: e.target.value }))
              }
            />
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label htmlFor="status">Status</Label>
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
