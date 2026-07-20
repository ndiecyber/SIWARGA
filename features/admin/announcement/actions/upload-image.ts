"use server";

import { uploadToCloudinary } from "@/lib/cloudinary";

export async function uploadAnnouncementImage(
  file: File,
): Promise<string> {
  if (!file || file.size === 0) return "";
  return await uploadToCloudinary(file, "siwarga/announcements");
}
