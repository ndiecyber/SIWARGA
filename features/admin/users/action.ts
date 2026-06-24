// features/admin/users/action.ts
"use server";

import { revalidatePath } from "next/cache";
import { CreateUserSchema, UpdateUserSchema } from "./schema";
import { auth } from "@/lib/auth";
import { findUserByPhone, updateUser, deleteUser, deleteBatchUsers } from "@/lib/repositories/users";
import { handleDbError } from "@/lib/repositories/error";

export async function createUserAction(values: CreateUserSchema) {
  console.log({ values });

  const newEmail = `user-${Date.now()}@gmail.com`;

  try {
    const existing = await findUserByPhone(values.phoneNumber);

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
    return handleDbError(error);
  }
}

export async function updateUserAction(values: UpdateUserSchema, id: string) {
  try {
    const result = await updateUser(id, {
      ...values,
      ktpUrl: "",
      kkUrl: "",
    });

    if (!result.success) {
      return result;
    }

    revalidatePath("/admin/users");

    return {
      success: true,
      message: "Data warga berhasil dirubah",
    };
  } catch (error) {
    return handleDbError(error);
  }
}

export async function deleteUserAction(id: string) {
  const result = await deleteUser(id);
  revalidatePath("/admin/users");
  return result;
}

export async function deleteBatchUsersAction(ids: string[]) {
  await deleteBatchUsers(ids);
  revalidatePath("/admin/users");
}
