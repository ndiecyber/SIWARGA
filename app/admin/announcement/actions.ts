"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import { announcementLogger } from "@/lib/logger";

function calculateStatus(eventDate: string | null | undefined): string {
  if (!eventDate) return "upcoming";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const event = new Date(eventDate);
  event.setHours(0, 0, 0, 0);

  if (event < today) return "done";
  if (event.getTime() === today.getTime()) return "ongoing";
  return "upcoming";
}

export type AnnouncementFormData = {
  category: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  eventDate?: string | null;
  status?: string;
};

export async function getAnnouncements() {
  return await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getAnnouncementById(id: number) {
  return await prisma.announcement.findUnique({ where: { id } });
}

export async function createAnnouncement(data: AnnouncementFormData) {
  try {
    await prisma.announcement.create({
      data: {
        category: data.category,
        title: data.title,
        description: data.description,
        eventDate: data.eventDate ? new Date(data.eventDate) : null,
        status: calculateStatus(data.eventDate),
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
        status: calculateStatus(data.eventDate),
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
