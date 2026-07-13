"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import { announcementLogger } from "@/lib/logger";
import { calculateAnnouncementStatus } from "@/lib/announcement-status";

export type AnnouncementFormData = {
  category: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  eventDate?: string | null;
  status?: string;
};

export async function getAnnouncements() {
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
  });
  return announcements.map((a) => ({
    ...a,
    status: calculateAnnouncementStatus(a.eventDate),
  }));
}

export async function getAnnouncementById(id: number) {
  const announcement = await prisma.announcement.findUnique({
    where: { id },
  });
  if (!announcement) return null;
  return {
    ...announcement,
    status: calculateAnnouncementStatus(announcement.eventDate),
  };
}

export async function createAnnouncement(data: AnnouncementFormData) {
  try {
    await prisma.announcement.create({
      data: {
        category: data.category,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl || null,
        eventDate: data.eventDate ? new Date(data.eventDate) : null,
        status: calculateAnnouncementStatus(data.eventDate),
      },
    });
  } catch (error) {
    announcementLogger.error(
      { err: error, title: data.title },
      "Gagal buat pengumuman",
    );
  }
  revalidatePath("/admin/announcment");
}

export async function updateAnnouncement(
  id: number,
  data: AnnouncementFormData,
) {
  try {
    await prisma.announcement.update({
      where: { id },
      data: {
        category: data.category,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl || null,
        eventDate: data.eventDate ? new Date(data.eventDate) : null,
        status: calculateAnnouncementStatus(data.eventDate),
      },
    });
  } catch (error) {
    announcementLogger.error(
      { err: error, announcementId: id },
      "Gagal update pengumuman",
    );
  }
  revalidatePath("/admin/announcment");
}

export async function deleteAnnouncement(id: number) {
  try {
    await prisma.announcement.delete({ where: { id } });
    announcementLogger.info(
      { announcementId: id },
      "Pengumuman berhasil dihapus",
    );
    revalidatePath("/admin/announcment");
  } catch (error) {
    announcementLogger.error(
      { err: error, announcementId: id },
      "Gagal hapus pengumuman",
    );
  }
}

export async function deleteBatchAnnouncementsAction(ids: number[]) {
  try {
    await prisma.announcement.deleteMany({ where: { id: { in: ids } } });
    announcementLogger.info(
      { announcementIds: ids },
      "Batch pengumuman berhasil dihapus",
    );
    revalidatePath("/admin/announcment");
  } catch (error) {
    announcementLogger.error(
      { err: error, announcementIds: ids },
      "Gagal hapus batch pengumuman",
    );
  }
}
