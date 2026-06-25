"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getRondaSchedule() {
  return await prisma.ronda.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          phoneNumber: true,
        },
      },
    },
    orderBy: {
      user: {
        name: "asc",
      },
    },
  });
}

export async function getEligibleUsers() {
  return await prisma.user.findMany({
    where: {
      OR: [
        { role: null },
        { role: { not: "admin" } },
      ],
    },
    select: {
      id: true,
      name: true,
      phoneNumber: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function generateRondaSchedule() {
  try {
    const users = await getEligibleUsers();
    if (users.length === 0) {
      throw new Error("Tidak ada warga yang tersedia untuk dijadwalkan.");
    }

    // Shuffle users
    const shuffled = [...users].sort(() => Math.random() - 0.5);

    // Clear existing schedules and insert new ones inside a transaction
    await prisma.$transaction(async (tx) => {
      await tx.ronda.deleteMany({});

      const dataToInsert = shuffled.map((user, index) => {
        const dayOfWeek = (index % 7) + 1; // 1 = Senin, ..., 7 = Minggu
        return {
          dayOfWeek,
          userId: user.id,
        };
      });

      await tx.ronda.createMany({
        data: dataToInsert,
      });
    });

    revalidatePath("/admin/ronda");
    revalidatePath("/admin");

    return { success: true, message: "Jadwal ronda berhasil di-generate secara otomatis." };
  } catch (error: any) {
    return { success: false, message: error.message || "Gagal membuat jadwal otomatis." };
  }
}

export async function addRondaEntry(dayOfWeek: number, userId: string) {
  try {
    // Check if the user is already assigned to this day
    const existing = await prisma.ronda.findUnique({
      where: {
        dayOfWeek_userId: {
          dayOfWeek,
          userId,
        },
      },
    });

    if (existing) {
      throw new Error("Warga ini sudah terdaftar di hari tersebut.");
    }

    await prisma.ronda.create({
      data: {
        dayOfWeek,
        userId,
      },
    });

    revalidatePath("/admin/ronda");
    revalidatePath("/admin");

    return { success: true, message: "Petugas ronda berhasil ditambahkan." };
  } catch (error: any) {
    return { success: false, message: error.message || "Gagal menambahkan petugas ronda." };
  }
}

export async function removeRondaEntry(id: string) {
  try {
    await prisma.ronda.delete({
      where: { id },
    });

    revalidatePath("/admin/ronda");
    revalidatePath("/admin");

    return { success: true, message: "Petugas ronda berhasil dihapus." };
  } catch (error: any) {
    return { success: false, message: error.message || "Gagal menghapus petugas ronda." };
  }
}
