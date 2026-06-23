"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import {
  createAnnouncement as repoCreateAnnouncement,
  updateAnnouncement as repoUpdateAnnouncement,
  deleteAnnouncement as repoDeleteAnnouncement,
  deleteBatchAnnouncements,
} from "@/lib/repositories/announcements";
import { handleDbError } from "@/lib/repositories/error";

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
  await repoCreateAnnouncement({
    category: data.category,
    title: data.title,
    description: data.description,
    eventDate: data.eventDate ? new Date(data.eventDate) : null,
    status: data.status,
  });
  revalidatePath("/admin/announcment");
}

export async function updateAnnouncement(
  id: number,
  data: AnnouncementFormData
) {
  await repoUpdateAnnouncement(id, {
    category: data.category,
    title: data.title,
    description: data.description,
    eventDate: data.eventDate ? new Date(data.eventDate) : null,
    status: data.status,
  });
  revalidatePath("/admin/announcment");
}

export async function deleteAnnouncement(id: number) {
  const result = await repoDeleteAnnouncement(id);
  revalidatePath("/admin/announcment");
  return result;
}

export async function deleteBatchAnnouncementsAction(ids: number[]) {
  await deleteBatchAnnouncements(ids);
  revalidatePath("/admin/announcment");
}
