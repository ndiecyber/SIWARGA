"use server";

import { revalidatePath } from "next/cache";
import { getPrismaClient } from "@/lib/prisma";

export type AnnouncementFormData = {
  category: string;
  title: string;
  description: string;
  eventDate?: string | null;
  status: string;
};

export async function getAnnouncements() {
  const prisma = getPrismaClient();
  return await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getAnnouncementById(id: number) {
  const prisma = getPrismaClient();
  return await prisma.announcement.findUnique({ where: { id } });
}

export async function createAnnouncement(data: AnnouncementFormData) {
  const prisma = getPrismaClient();
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
  const prisma = getPrismaClient();
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
  const prisma = getPrismaClient();
  await prisma.announcement.delete({ where: { id } });
  revalidatePath("/admin/announcment");
}
