"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";

export type AnnouncementFormData = {
  category: string;
  title: string;
  description: string;
  eventDate?: string | null;
  status: string;
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
  await prisma.announcement.create({
    data: {
      category: data.category,
      title: data.title,
      description: data.description,
      eventDate: data.eventDate ? new Date(data.eventDate) : null,
      status: data.status,
    },
  });
  revalidatePath("/admin/announcment");
}

export async function updateAnnouncement(
  id: number,
  data: AnnouncementFormData
) {
  await prisma.announcement.update({
    where: { id },
    data: {
      category: data.category,
      title: data.title,
      description: data.description,
      eventDate: data.eventDate ? new Date(data.eventDate) : null,
      status: data.status,
    },
  });
  revalidatePath("/admin/announcment");
}

export async function deleteAnnouncement(id: number) {
  await prisma.announcement.delete({ where: { id } });
  revalidatePath("/admin/announcment");
}

export async function deleteBatchAnnouncementsAction(ids: number[]) {
  await prisma.announcement.deleteMany({ where: { id: { in: ids } } });
  revalidatePath("/admin/announcment");
}
