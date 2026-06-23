"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "@/lib/types";
import { House } from "@/generated/prisma/browser";

import { createFormSchema, InputFormSchema, updateFormSchema } from "./schemas";
import { createHouse, updateHouse, deleteHouse, deleteBatchHouses } from "@/lib/repositories/houses";
import { handleDbError } from "@/lib/repositories/error";

export async function createHouseAction(
  data: InputFormSchema,
): Promise<ActionResponse<House | null, InputFormSchema>> {
  try {
    const parsedData = createFormSchema.parse(data);

    const repoResult = await createHouse(parsedData);

    if (!repoResult.success) {
      return {
        success: false,
        message: "Data rumah gagal ditambahkan",
        globalError: repoResult.message,
      };
    }

    revalidatePath("/admin/houses");

    return {
      success: true,
      message: "Data rumah berhasil ditambahkan",
      data: repoResult.data,
    };
  } catch (error) {
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

    const repoResult = await updateHouse(id, parsedData);

    if (!repoResult.success) {
      return {
        success: false,
        message: "Data rumah gagal diperbarui",
        globalError: repoResult.message,
      };
    }

    revalidatePath("/admin/houses");

    return {
      success: true,
      message: "Data rumah berhasil diperbarui",
      data: repoResult.data,
    };
  } catch (error) {
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
  const repoResult = await deleteHouse(id);

  if (!repoResult.success) {
    return {
      success: false,
      message: "Data rumah gagal dihapus",
      globalError: repoResult.message,
    };
  }

  revalidatePath("/admin/houses");

  return {
    success: true,
    message: "Data rumah berhasil dihapus",
    data: "",
  };
}

export async function deleteBatchHousesAction(ids: string[]) {
  await deleteBatchHouses(ids);
  revalidatePath("/admin/houses");
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
          ...(excludeHouseId ? [{ residentProfile: { houseId: excludeHouseId } }] : []),
        ],
      },
      select: { id: true, name: true },
      take: 10,
      orderBy: { name: "asc" },
    });
    return { success: true, message: "Data pengguna berhasil diambil", data: users };
  } catch (error) {
    return {
      success: false,
      message: "Gagal mengambil data pengguna",
      globalError: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
