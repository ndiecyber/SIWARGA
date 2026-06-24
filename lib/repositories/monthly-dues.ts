import prisma from "@/lib/db";
import { handleDbError } from "./error";
import { HouseStatus, MonthlyDuesStatus } from "@/generated/prisma/enums";

const DUES_AMOUNT = 25000;

export async function generateDuesForMonth(month: number, year: number) {
  try {
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

    await prisma.$transaction(async (tx) => {
      for (const house of houses) {
        const existing = await tx.monthlyDues.findUnique({
          where: {
            houseId_month_year: { houseId: house.id, month, year },
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
          if (year < residentYear || (year === residentYear && month < residentMonth)) {
            skippedNotYetResident++;
            continue;
          }
        }

        await tx.monthlyDues.create({
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
    });

    return {
      success: true as const,
      message: `Berhasil membuat ${created} tagihan.`,
      data: { created, skipped: skippedExisting + skippedNotYetResident },
    };
  } catch (error) {
    return handleDbError(error);
  }
}

export async function getDuesStats(month: number, year: number) {
  const [paid, unpaid] = await Promise.all([
    prisma.monthlyDues.count({ where: { month, year, status: MonthlyDuesStatus.PAID } }),
    prisma.monthlyDues.count({ where: { month, year, status: MonthlyDuesStatus.UNPAID } }),
  ]);
  return { paid, unpaid, total: paid + unpaid };
}
