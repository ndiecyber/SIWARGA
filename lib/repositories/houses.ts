import prisma from "@/lib/db";
import { handleDbError } from "./error";
import { PaginatedInput, buildPaginationArgs, toPaginatedResult } from "./pagination";

export async function findHouseById(id: string) {
  return prisma.house.findUnique({ where: { id } });
}

export async function createHouse(data: Parameters<typeof prisma.house.create>[0]["data"]) {
  try {
    return { success: true as const, data: await prisma.house.create({ data }) };
  } catch (error) {
    return handleDbError(error);
  }
}

export async function updateHouse(id: string, data: Parameters<typeof prisma.house.update>[0]["data"]) {
  try {
    return { success: true as const, data: await prisma.house.update({ where: { id }, data }) };
  } catch (error) {
    return handleDbError(error);
  }
}

export async function deleteHouse(id: string) {
  try {
    await prisma.house.delete({ where: { id } });
    return { success: true as const, message: "Data rumah berhasil dihapus." };
  } catch (error) {
    return handleDbError(error);
  }
}

export async function deleteBatchHouses(ids: string[]) {
  try {
    await prisma.house.deleteMany({ where: { id: { in: ids } } });
    return { success: true as const, message: `${ids.length} rumah berhasil dihapus.` };
  } catch (error) {
    return handleDbError(error);
  }
}

export async function paginateHouses(input: PaginatedInput) {
  const args = buildPaginationArgs(input);
  const [data, totalCount] = await Promise.all([
    prisma.house.findMany(args),
    prisma.house.count({ where: args.where }),
  ]);
  return toPaginatedResult(data, totalCount, input);
}

export async function getOccupiedHouses() {
  return prisma.house.findMany({
    where: { status: "OCCUPIED" },
    select: { id: true, block: true, houseNumber: true },
  });
}
