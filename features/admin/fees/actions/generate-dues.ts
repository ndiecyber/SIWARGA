"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { HouseStatus, MonthlyDuesStatus } from "@/generated/prisma/enums";

const DUES_AMOUNT = 25000;

interface GenerateDuesInput {
  month: number;
  year: number;
}

function formatMonthYear(month: number, year: number): string {
  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1));
}

export async function generateDuesAction(input: GenerateDuesInput) {
  try {
    const { month, year } = input;
    const houses = await prisma.house.findMany({
      where: { status: HouseStatus.OCCUPIED },
      select: {
        id: true,
        block: true,
        houseNumber: true,
        residents: {
          select: { createdAt: true },
          orderBy: { createdAt: "asc" },
          take: 1,
        },
      },
    });

    let created = 0;
    let skippedExisting = 0;
    let skippedNotYetResident = 0;

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
        skippedExisting++;
        continue;
      }

      const earliestResident = house.residents[0];
      if (earliestResident) {
        const residentDate = earliestResident.createdAt;
        const residentMonth = residentDate.getMonth() + 1;
        const residentYear = residentDate.getFullYear();

        if (
          year < residentYear ||
          (year === residentYear && month < residentMonth)
        ) {
          skippedNotYetResident++;
          continue;
        }
      }

      await prisma.monthlyDues.create({
        data: {
          houseId: house.id,
          amount: DUES_AMOUNT,
          month,
          year,
          dueDate: new Date(year, month - 1, new Date(year, month, 0).getDate(), 12),
          status: MonthlyDuesStatus.UNPAID,
        },
      });

      created++;
    }

    revalidatePath("/admin/fees");

    const parts: string[] = [`Berhasil membuat ${created} tagihan.`];
    if (skippedExisting > 0) {
      parts.push(
        `${skippedExisting} rumah sudah memiliki tagihan dan dilewatkan.`,
      );
    }
    if (skippedNotYetResident > 0) {
      parts.push(
        `${skippedNotYetResident} rumah belum dihuni pada ${formatMonthYear(month, year)} dan dilewatkan.`,
      );
    }

    return {
      success: true as const,
      message: parts.join(" "),
      data: { created, skipped: skippedExisting + skippedNotYetResident },
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
