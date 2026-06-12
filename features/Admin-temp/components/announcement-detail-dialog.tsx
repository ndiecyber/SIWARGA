"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { CalendarDays, Tag, Info, X } from "lucide-react";

type Announcement = {
  id: number;
  category: string;
  title: string;
  description: string;
  eventDate: Date | null;
  status: string;
  createdAt: Date;
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  announcement: Announcement | null;
};

const STATUS_MAP: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  upcoming: { label: "Akan Datang", variant: "default" },
  ongoing: { label: "Berlangsung", variant: "secondary" },
  done: { label: "Selesai", variant: "outline" },
};

export function AnnouncementDetailDialog({ open, onOpenChange, announcement }: Props) {
  if (!announcement) return null;

  const status = STATUS_MAP[announcement.status] ?? { label: announcement.status, variant: "outline" as const };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
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

        <div className="space-y-4 py-1">
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
          <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">
            {announcement.description}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
