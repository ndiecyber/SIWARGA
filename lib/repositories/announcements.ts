import prisma from "@/lib/db";
import { handleDbError } from "./error";
import { PaginatedInput, buildPaginationArgs, toPaginatedResult } from "./pagination";

export async function createAnnouncement(data: Parameters<typeof prisma.announcement.create>[0]["data"]) {
  try {
    return { success: true as const, data: await prisma.announcement.create({ data }) };
  } catch (error) {
    return handleDbError(error);
  }
}

export async function updateAnnouncement(id: number, data: Parameters<typeof prisma.announcement.update>[0]["data"]) {
  try {
    return { success: true as const, data: await prisma.announcement.update({ where: { id }, data }) };
  } catch (error) {
    return handleDbError(error);
  }
}

export async function deleteAnnouncement(id: number) {
  try {
    await prisma.announcement.delete({ where: { id } });
    return { success: true as const, message: "Pengumuman berhasil dihapus." };
  } catch (error) {
    return handleDbError(error);
  }
}

export async function deleteBatchAnnouncements(ids: number[]) {
  try {
    await prisma.announcement.deleteMany({ where: { id: { in: ids } } });
    return { success: true as const, message: `${ids.length} pengumuman berhasil dihapus.` };
  } catch (error) {
    return handleDbError(error);
  }
}

export async function paginateAnnouncements(input: PaginatedInput) {
  const args = buildPaginationArgs(input);
  const [data, totalCount] = await Promise.all([
    prisma.announcement.findMany(args),
    prisma.announcement.count({ where: args.where }),
  ]);
  return toPaginatedResult(data, totalCount, input);
}
