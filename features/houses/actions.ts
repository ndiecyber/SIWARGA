"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { HouseStatus } from "@/generated/prisma/enums";

import { InputFormSchema } from "./schemas";
import { ActionResponse } from "@/lib/types";

export async function createHouseAction(
  data: InputFormSchema,
): Promise<ActionResponse> {
  try {
    const result = await prisma.house.create({
      data: {
        ownerId: data.ownerId,
        block: data.block,
        status: data.status as HouseStatus,
        houseNumber: data.houseNumber,
      },
    });

    return {
      success: true,
      message: "Data rumah berhasil ditambahkan",
    };
  } catch (error) {
    return {
      success: false,
      message: "Data rumah gagal ditambahkan",
      errors: error instanceof Error ? { message: [error.message] } : {},
    };
  } finally {
    revalidatePath("/admin/houses");
  }
}
