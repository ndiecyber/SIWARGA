"use client";

import { useState, useTransition, useMemo, useRef } from "react";
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
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImageIcon, Loader2, X } from "lucide-react";
import {
  createAnnouncement,
  updateAnnouncement,
  type AnnouncementFormData,
} from "@/app/admin/announcement/actions";
import { uploadAnnouncementImage } from "@/features/admin/announcement/actions/upload-image";
import { announcementLogger } from "@/lib/logger";

type Announcement = {
  id: number;
  category: string;
  title: string;
  description: string;
  imageUrl: string | null;
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

type FormData = {
  category: string;
  title: string;
  description: string;
  eventDate: string;
};

const empty: FormData = {
  category: "",
  title: "",
  description: "",
  eventDate: "",
};

export function AnnouncementFormDialog({
  open,
  onOpenChange,
  announcement,
  existingCategories = [],
}: Props) {
  const isEdit = !!announcement;
  const [isPending, startTransition] = useTransition();
  const imageRef = useRef<HTMLInputElement>(null);

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

  const initForm = (a?: Announcement | null): FormData =>
    a
      ? {
          category: a.category,
          title: a.title,
          description: a.description ?? "",
          eventDate: a.eventDate
            ? new Date(a.eventDate).toISOString().split("T")[0]
            : "",
        }
      : { ...empty };

  const [form, setForm] = useState<FormData>(() => initForm(announcement));
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    announcement?.imageUrl ?? null,
  );

  function handleOpenChange(v: boolean) {
    if (v) {
      setIsCustomCategory(
        announcement ? !categoriesList.includes(announcement.category) : false,
      );
      setForm(initForm(announcement));
      setSelectedFile(null);
      setPreviewUrl(announcement?.imageUrl ?? null);
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
        let imageUrl = previewUrl ?? "";

        if (selectedFile) {
          imageUrl = await uploadAnnouncementImage(selectedFile);
        }

        const data: AnnouncementFormData = {
          category: categoryVal,
          title: titleVal,
          description: descVal ?? "",
          imageUrl,
          eventDate: dateVal,
        };

        if (isEdit && announcement) {
          await updateAnnouncement(announcement.id, data);
          toast.success("Pengumuman berhasil diperbarui!");
        } else {
          await createAnnouncement(data);
          toast.success("Pengumuman berhasil ditambahkan!");
        }
        onOpenChange(false);
        setForm({ ...empty });
        setSelectedFile(null);
        setPreviewUrl(null);
      } catch (error) {
        announcementLogger.error(
          { err: error, title: titleVal },
          "Gagal simpan pengumuman dari dialog",
        );
        toast.error("Terjadi kesalahan. Silakan coba lagi.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="h-screen max-w-screen md:min-w-[calc(100%-32rem)] md:h-fit gap-0">
        <DialogHeader className="sticky pb-4 -mx-6 space-y-4 border-b mb-4">
          <main className="px-6">
            <DialogTitle className="text-2xl font-semibold tracking-tight text-primary">
              {isEdit ? "Edit Pengumuman" : "Tambah Pengumuman"}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Ubah data pengumuman yang sudah ada."
                : "Buat pengumuman baru untuk warga perumahan."}
            </DialogDescription>
          </main>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(100vh-12rem)] -mr-6 pr-6">
          <form
            id="announcement-form"
            onSubmit={handleSubmit}
            className="space-y-4 py-2 px-6"
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
                <SelectContent position="popper">
                  {categoriesList.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">
                    Kustom (Input Manual)...
                  </SelectItem>
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

            {/* Gambar */}
            <div className="space-y-1.5">
              <Label htmlFor="imageUrl">
                Gambar{" "}
                <span className="text-muted-foreground text-xs font-normal">
                  (opsional)
                </span>
              </Label>

              {/* Drop zone / upload area */}
              <div
                className="relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/30 p-4 transition-colors hover:border-muted-foreground/40"
                onClick={() => imageRef.current?.click()}
              >
                {previewUrl ? (
                  <div className="relative w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-h-48 w-full rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-2 rounded-full bg-background/80 p-1 text-foreground shadow-xs transition-colors hover:bg-background"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        setPreviewUrl(null);
                        if (imageRef.current) imageRef.current.value = "";
                      }}
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="size-8 text-muted-foreground/50" />
                    <p className="text-xs text-muted-foreground">
                      Klik untuk upload gambar
                    </p>
                    <p className="text-[10px] text-muted-foreground/60">
                      PNG, JPG atau WebP
                    </p>
                  </>
                )}
              </div>

              <Input
                id="imageUrl"
                type="file"
                accept="image/*"
                ref={imageRef}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setSelectedFile(file);
                    setPreviewUrl(URL.createObjectURL(file));
                  }
                }}
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
          </form>

          <DialogFooter className="gap-2 px-6 pb-4">
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
