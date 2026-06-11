// features/admin/users/action.ts
"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { CreateUserSchema, UpdateUserSchema } from "./schema";
import { Prisma } from "@/generated/prisma/client";

export async function createUserAction(values: CreateUserSchema) {
  try {
    await prisma.user.create({
      data: {
        ...values,
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
    console.error("CREATE_USER_ERROR: ", error);

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

export async function updateUserAction(values: UpdateUserSchema, id: string) {
  try {
    await prisma.user.update({
      where: { id },
      data: {
        ...values,
        ktpUrl: "",
        kkUrl: "",
      },
    });

    revalidatePath("/admin/users");

    return {
      success: true,
      message: "Data warga berhasil dirubah",
    };
  } catch (error) {
    console.error("UPDATE_USER_ERROR: ", error);

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
      message: "Terjadi kesalahan saat merubah data warga.",
    };
  }
}

export async function deleteUserAction(id: string) {
  await prisma.user.delete({
    where: { id },
  });

  revalidatePath("/admin/users");
}