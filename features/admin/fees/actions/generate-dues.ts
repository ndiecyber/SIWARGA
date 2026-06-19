"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { MonthlyDuesStatus } from "@/generated/prisma/enums";

const DUES_AMOUNT = 25000;

interface GenerateDuesInput {
  month: number;
  year: number;
}

export async function generateDuesAction(input: GenerateDuesInput) {
  try {
    const { month, year } = input;
    const houses = await prisma.house.findMany({
      select: { id: true },
    });

    let created = 0;
    let skipped = 0;

    for (const house of houses) {
      const existing = await prisma.monthlyDues.findUnique({
        where: {
          houseId_month_year: {
            houseId: house.id,
            month,
            year,
          },
        },
      });

      if (existing) {
        skipped++;
        continue;
      }

      await prisma.monthlyDues.create({
        data: {
          houseId: house.id,
          amount: DUES_AMOUNT,
          month,
          year,
          dueDate: new Date(year, month, 10),
          status: MonthlyDuesStatus.UNPAID,
        },
      });

      created++;
    }

    revalidatePath("/admin/fees");

    return {
      success: true as const,
      message: `Berhasil membuat ${created} tagihan. ${skipped} rumah sudah memiliki tagihan dan dilewatkan.`,
      data: { created, skipped },
    };
  } catch (error) {
    return {
      success: false as const,
      message:
        error instanceof Error
          ? error.message
          : "Gagal membuat tagihan",
    };
  }
}
