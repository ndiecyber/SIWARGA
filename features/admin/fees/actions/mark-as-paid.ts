"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { MonthlyDuesStatus, PaymentStatus } from "@/generated/prisma/enums";
import { feesLogger } from "@/lib/logger";

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
      feesLogger.warn({ monthlyDueId }, 'Tagihan tidak ditemukan saat mark as paid')
      return {
        success: false as const,
        message: "Data tagihan tidak ditemukan",
      };
    }

    if (monthlyDue.status === MonthlyDuesStatus.PAID) {
      feesLogger.warn({ monthlyDueId }, 'Tagihan sudah lunas')
      return {
        success: false as const,
        message: "Tagihan ini sudah lunas",
      };
    }

    const payment = await prisma.payment.create({
      data: {
        amountPaid,
        paidAt: new Date(),
        paymentMethod,
        status: PaymentStatus.SUCCESS,
      },
    });

    await prisma.monthlyDues.update({
      where: { id: monthlyDueId },
      data: {
        status: MonthlyDuesStatus.PAID,
        paymentId: payment.id,
      },
    });

    revalidatePath("/admin/fees");

    return {
      success: true as const,
      message: "Pembayaran berhasil dicatat",
      data: { paymentId: payment.id },
    };
  } catch (error) {
    feesLogger.error({ err: error, monthlyDueId: input.monthlyDueId }, 'Gagal mencatat pembayaran')
    return {
      success: false as const,
      message:
        error instanceof Error
          ? error.message
          : "Gagal mencatat pembayaran",
    };
  }
}
