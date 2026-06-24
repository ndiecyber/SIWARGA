import prisma from "@/lib/db";
import { handleDbError } from "./error";
import { PaginatedInput, buildPaginationArgs, toPaginatedResult } from "./pagination";

export async function findUserByPhone(phoneNumber: string) {
  return prisma.user.findUnique({ where: { phoneNumber } });
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function createUser(data: Parameters<typeof prisma.user.create>[0]["data"]) {
  try {
    return { success: true as const, data: await prisma.user.create({ data }) };
  } catch (error) {
    return handleDbError(error);
  }
}

export async function updateUser(id: string, data: Parameters<typeof prisma.user.update>[0]["data"]) {
  try {
    return { success: true as const, data: await prisma.user.update({ where: { id }, data }) };
  } catch (error) {
    return handleDbError(error);
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({ where: { id } });
    return { success: true as const, message: "Data warga berhasil dihapus." };
  } catch (error) {
    return handleDbError(error);
  }
}

export async function deleteBatchUsers(ids: string[]) {
  try {
    await prisma.user.deleteMany({ where: { id: { in: ids } } });
    return { success: true as const, message: `${ids.length} warga berhasil dihapus.` };
  } catch (error) {
    return handleDbError(error);
  }
}

export async function searchUsers(search: string, take = 10) {
  return prisma.user.findMany({
    where: { name: { contains: search, mode: "insensitive" } },
    select: { id: true, name: true },
    take,
    orderBy: { name: "asc" },
  });
}

export async function paginateUsers(input: PaginatedInput) {
  const args = buildPaginationArgs(input);
  const [data, totalCount] = await Promise.all([
    prisma.user.findMany(args),
    prisma.user.count({ where: args.where }),
  ]);
  return toPaginatedResult(data, totalCount, input);
}
