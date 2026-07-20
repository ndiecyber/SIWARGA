"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { housesLogger } from "@/lib/logger";
import { ActionResponse } from "@/lib/types";
import { House } from "@/generated/prisma/browser";

import { createFormSchema, InputFormSchema, updateFormSchema } from "./schemas";

export async function createHouseAction(
  data: InputFormSchema,
): Promise<ActionResponse<House | null, InputFormSchema>> {
  try {
    const parsedData = createFormSchema.parse(data);

    const result = await prisma.house.create({ data: parsedData });

    revalidatePath("/admin/houses");

    return {
      success: true,
      message: "Data rumah berhasil ditambahkan",
      data: result,
    };
  } catch (error) {
    housesLogger.error({ err: error }, "Gagal tambah rumah");
    return {
      success: false,
      message: "Data rumah gagal ditambahkan",
      globalError:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function updateHouseAction(
  id: string,
  data: InputFormSchema,
): Promise<ActionResponse<House | null, InputFormSchema>> {
  try {
    const parsedData = updateFormSchema.parse(data);

    const result = await prisma.house.update({
      where: { id },
      data: parsedData,
    });

    revalidatePath("/admin/houses");

    return {
      success: true,
      message: "Data rumah berhasil diperbarui",
      data: result,
    };
  } catch (error) {
    housesLogger.error({ err: error, houseId: id }, "Gagal update rumah");
    return {
      success: false,
      message: "Data rumah gagal diperbarui",
      globalError:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function deleteHouseAction(
  id: string,
): Promise<ActionResponse<string>> {
  try {
    await prisma.house.delete({ where: { id } });

    revalidatePath("/admin/houses");

    return {
      success: true,
      message: "Data rumah berhasil dihapus",
      data: "",
    };
  } catch (error) {
    housesLogger.error({ err: error, houseId: id }, "Gagal hapus rumah");

    return {
      success: false,
      message: "Data rumah gagal dihapus",
      globalError:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function deleteBatchHousesAction(ids: string[]) {
  try {
    await prisma.house.deleteMany({ where: { id: { in: ids } } });
    revalidatePath("/admin/houses");
  } catch (error) {
    housesLogger.error(
      { err: error, houseIds: ids },
      "Gagal hapus batch rumah",
    );
  }
}

export async function getOwnersLookupAction(
  search: string = "",
): Promise<
  ActionResponse<{ id: string; name: string; isResident: boolean }[]>
> {
  const sanitizedSearch = search.trim();

  try {
    const owners = await prisma.user.findMany({
      where: {
        name: {
          contains: sanitizedSearch,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
        residentProfile: {
          select: { id: true },
        },
      },
      take: 10,
      orderBy: {
        name: "asc",
      },
    });

    return {
      success: true,
      message: "Data pemilik berhasil diambil",
      data: owners.map((u) => ({
        id: u.id,
        name: u.name,
        isResident: u.residentProfile !== null,
      })),
    };
  } catch (error) {
    housesLogger.warn({ err: error, search }, "Gagal ambil data pemilik");
    return {
      success: false,
      message: "Gagal mengambil data pemilik",
      globalError:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function getResidentsLookupAction(
  search: string = "",
  excludeHouseId?: string,
): Promise<ActionResponse<{ id: string; name: string }[]>> {
  const sanitizedSearch = search.trim();
  try {
    const users = await prisma.user.findMany({
      where: {
        name: { contains: sanitizedSearch, mode: "insensitive" },
        OR: [
          { residentProfile: null },
          ...(excludeHouseId
            ? [{ residentProfile: { houseId: excludeHouseId } }]
            : []),
        ],
      },
      select: { id: true, name: true },
      take: 10,
      orderBy: { name: "asc" },
    });
    return {
      success: true,
      message: "Data pengguna berhasil diambil",
      data: users,
    };
  } catch (error) {
    housesLogger.warn({ err: error, search }, "Gagal ambil data pengguna");
    return {
      success: false,
      message: "Gagal mengambil data pengguna",
      globalError:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
