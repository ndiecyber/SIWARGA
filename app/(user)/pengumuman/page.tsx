import type { Metadata } from "next";

import prisma from "@/lib/db";
import AnnouncementPage from "@/features/users/pages/announcement-page";
import { calculateAnnouncementStatus } from "@/lib/announcement-status";
import layoutWithAuthUser, {
  LayoutWithAuthUserProps,
} from "@/components/layouts/auth/layout-with-auth-user";

export const metadata: Metadata = {
  title: "Pengumuman Warga",
  description:
    "Lihat pengumuman terbaru dan informasi penting lingkungan melalui portal warga SIWARGA.",
};

async function Page({ user }: LayoutWithAuthUserProps) {
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
  });

  const formattedAnnouncements = announcements.map((a) => ({
    id: a.id,
    category: a.category,
    title: a.title,
    description: a.description,
    imageUrl: a.imageUrl,
    eventDate: a.eventDate
      ? new Intl.DateTimeFormat("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(new Date(a.eventDate))
      : null,
    createdAt: new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(a.createdAt)),
    status: calculateAnnouncementStatus(a.eventDate),
  }));

  return <AnnouncementPage announcements={formattedAnnouncements} />;
}

export default layoutWithAuthUser(Page);
