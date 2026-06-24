import prisma from "@/lib/db";
import { handleDbError } from "./error";

export async function createPayment(data: Parameters<typeof prisma.payment.create>[0]["data"]) {
  try {
    return { success: true as const, data: await prisma.payment.create({ data }) };
  } catch (error) {
    return handleDbError(error);
  }
}

export async function getRecentPayments(take = 5) {
  return prisma.payment.findMany({
    take,
    orderBy: { paidAt: "desc" },
    include: {
      monthlyDues: {
        include: {
          house: { include: { owner: true } },
        },
      },
    },
  });
}

export async function getTotalCollectedFunds() {
  const result = await prisma.payment.aggregate({
    where: { status: "SUCCESS" },
    _sum: { amountPaid: true },
  });
  return Number(result._sum.amountPaid || 0);
}
