"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { MonthlyDuesStatus, PaymentStatus } from "@/generated/prisma/enums";
import { handleDbError } from "@/lib/repositories/error";

interface MarkAsPaidInput {
  monthlyDueId: string;
  amountPaid: number;
  paymentMethod: string;
}

export async function markAsPaidAction(input: MarkAsPaidInput) {
  try {
    const { monthlyDueId, amountPaid, paymentMethod } = input;

    const monthlyDue = await prisma.monthlyDues.findUnique({
      where: { id: monthlyDueId },
    });

    if (!monthlyDue) {
      return {
        success: false as const,
        message: "Data tagihan tidak ditemukan",
      };
    }

    if (monthlyDue.status === MonthlyDuesStatus.PAID) {
      return {
        success: false as const,
        message: "Tagihan ini sudah lunas",
      };
    }

    const payment = await prisma.$transaction(async (tx) => {
      const p = await tx.payment.create({
        data: {
          amountPaid,
          paidAt: new Date(),
          paymentMethod,
          status: PaymentStatus.SUCCESS,
        },
      });

      await tx.monthlyDues.update({
        where: { id: monthlyDueId },
        data: {
          status: MonthlyDuesStatus.PAID,
          paymentId: p.id,
        },
      });

      return p;
    });

    revalidatePath("/admin/fees");

    return {
      success: true as const,
      message: "Pembayaran berhasil dicatat",
      data: { paymentId: payment.id },
    };
  } catch (error) {
    return handleDbError(error);
  }
}
