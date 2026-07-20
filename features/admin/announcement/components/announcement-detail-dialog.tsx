"use client";

import { CalendarDays, Info, Tag, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Announcement = {
  id: number;
  category: string;
  title: string;
  description: string;
  imageUrl: string | null;
  eventDate: Date | null;
  status: string;
  createdAt: Date;
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  announcement: Announcement | null;
};

const STATUS_MAP: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  upcoming: { label: "Akan Datang", variant: "default" },
  ongoing: { label: "Berlangsung", variant: "secondary" },
  done: { label: "Selesai", variant: "outline" },
};

export function AnnouncementDetailDialog({
  open,
  onOpenChange,
  announcement,
}: Props) {
  if (!announcement) return null;

  const status = STATUS_MAP[announcement.status] ?? {
    label: announcement.status,
    variant: "outline" as const,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" showCloseButton={false}>
        {/* Image at top if available */}
        {announcement.imageUrl && (
          <div className="-m-6 -mb-4 overflow-hidden rounded-t-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={announcement.imageUrl}
              alt={announcement.title}
              className="object-cover w-full aspect-video"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}

        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <Badge variant={status.variant} className="mb-1">
                {status.label}
              </Badge>
              <DialogTitle className="text-xl leading-snug">
                {announcement.title}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="py-1 space-y-4">
          {/* Meta */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Tag className="size-4" />
              {announcement.category}
            </span>
            {announcement.eventDate && (
              <span className="flex items-center gap-1.5">
                <CalendarDays className="size-4" />
                {new Date(announcement.eventDate).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Info className="size-4" />
              Dibuat{" "}
              {new Date(announcement.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Divider */}
          <hr className="border-border" />

          {/* Description */}
          <p className="text-sm leading-relaxed whitespace-pre-line text-foreground">
            {announcement.description}
          </p>
        </div>

        <DialogClose asChild>
          <Button variant="outline" className="w-full rounded-xl">
            Tutup
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
