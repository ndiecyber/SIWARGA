// features/admin/users/action.ts
"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createUserSchema, updateUserSchema } from "./schema";
import { Prisma } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function createUserAction(formData: FormData) {
  try {
    const kkFile = formData.get("kkFile") as File | null;
    const ktpFile = formData.get("ktpFile") as File | null;

    const rawValues = {
      name: formData.get("name") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      identificationNumber: formData.get("identificationNumber") as string,
      role: formData.get("role") as "admin" | "user",
      kkFile: kkFile && kkFile.size > 0 ? kkFile : undefined,
      ktpFile: ktpFile && ktpFile.size > 0 ? ktpFile : undefined,
    };

    const parsed = createUserSchema.safeParse(rawValues);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map((e) => e.message).join(", ");
      throw new Error(errorMsg);
    }

    const values = parsed.data;

    const existing = await prisma.user.findUnique({
      where: { phoneNumber: values.phoneNumber },
    });

    if (existing) {
      throw new Error("Nomor telepon sudah terdaftar. Gunakan nomor lain.");
    }

    // Upload files to Cloudinary if provided
    let kkUrl = "";
    let ktpUrl = "";

    if (rawValues.kkFile) {
      kkUrl = await uploadToCloudinary(rawValues.kkFile, "siwarga/kk");
    }

    if (rawValues.ktpFile) {
      ktpUrl = await uploadToCloudinary(rawValues.ktpFile, "siwarga/ktp");
    }

    const newEmail = `user-${Date.now()}@gmail.com`;

    const newUser = await auth.api.signUpEmail({
      body: {
        name: values.name,
        email: newEmail,
        password: "password1234",
        username: values.phoneNumber,
        displayUsername: values.name,
        phoneNumber: values.phoneNumber,
        identificationNumber: values.identificationNumber,
        kkUrl,
        ktpUrl,
      },
    });

    if (!newUser?.user?.id) {
      throw new Error("Gagal dalam membuat user.");
    }

    // Update the role in DB (Better Auth defaults new users to basic user type/role depending on schema, we ensure role is set)
    await prisma.user.update({
      where: { id: newUser.user.id },
      data: {
        role: values.role,
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

export async function updateUserAction(formData: FormData, id: string) {
  try {
    const kkFile = formData.get("kkFile") as File | null;
    const ktpFile = formData.get("ktpFile") as File | null;

    const rawValues = {
      name: formData.get("name") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      identificationNumber: formData.get("identificationNumber") as string,
      role: formData.get("role") as "admin" | "user",
      kkFile: kkFile && kkFile.size > 0 ? kkFile : undefined,
      ktpFile: ktpFile && ktpFile.size > 0 ? ktpFile : undefined,
    };

    const parsed = updateUserSchema.safeParse(rawValues);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map((e) => e.message).join(", ");
      throw new Error(errorMsg);
    }

    const values = parsed.data;

    // Get current user to retain old Cloudinary URLs if new files are not uploaded
    const currentUser = await prisma.user.findUnique({
      where: { id },
      select: { kkUrl: true, ktpUrl: true },
    });

    let kkUrl = currentUser?.kkUrl || "";
    let ktpUrl = currentUser?.ktpUrl || "";

    if (rawValues.kkFile) {
      kkUrl = await uploadToCloudinary(rawValues.kkFile, "siwarga/kk");
    }

    if (rawValues.ktpFile) {
      ktpUrl = await uploadToCloudinary(rawValues.ktpFile, "siwarga/ktp");
    }

    await prisma.user.update({
      where: { id },
      data: {
        name: values.name,
        phoneNumber: values.phoneNumber,
        identificationNumber: values.identificationNumber,
        role: values.role,
        kkUrl,
        ktpUrl,
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

    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
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
