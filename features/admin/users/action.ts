// features/admin/users/action.ts
"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { CreateUserSchema } from "./schema";
import { Prisma } from "@/generated/prisma/client";

export async function createUserAction(values: CreateUserSchema) {
  const { ktpFile, kkFile, ...newData } = values;

  try {
    await prisma.user.create({
      data: {
        ...newData,
        ktpUrl: "",
        kkUrl: "",
      },
    });

    revalidatePath("/admin/users");

    return {
      success: true,
      message: "Data warga berhasil ditambahkan",
    };
  } catch (error) {
    console.error("CREATE_USER_ERROR:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          success: false,
          message: "Nomor telepon sudah terdaftar. Gunakan nomor lain.",
        };
      }
    }

    return {
      success: false,
      message: "Terjadi kesalahan saat menambahkan data warga.",
    };
  }
}