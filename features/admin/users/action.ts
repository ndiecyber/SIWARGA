// features/admin/users/action.ts
"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { CreateUserSchema, UpdateUserSchema } from "./schema";
import { Prisma } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";

export async function createUserAction(values: CreateUserSchema) {
  console.log({ values });

  const newEmail = `user-${Date.now()}@gmail.com`;

  try {
    const existing = await prisma.user.findUnique({
      where: { phoneNumber: values.phoneNumber },
    });

    if (existing) {
      throw new Error("Nomor telepon sudah terdaftar. Gunakan nomor lain.");
    }

    const newUser = await auth.api.signUpEmail({
      body: {
        name: values.name,
        email: newEmail,
        password: "password1234",
        username: values.phoneNumber,
        displayUsername: values.name,
        phoneNumber: values.phoneNumber,
        identificationNumber: values.identificationNumber,
        kkUrl: "",
        ktpUrl: "",
      },
    });

    if (!newUser?.user?.id) {
      throw new Error("Gagal dalam membuat user.");
    }

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

    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
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

export async function deleteBatchUsersAction(ids: string[]) {
  await prisma.user.deleteMany({ where: { id: { in: ids } } });
  revalidatePath("/admin/users");
}
