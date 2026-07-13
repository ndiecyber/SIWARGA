"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ActionResponse } from "@/lib/types";
import { Expense } from "@/generated/prisma/browser";
import { ExpenseStatus } from "@/generated/prisma/enums";

import { createFormSchema, InputFormSchema, updateFormSchema } from "./schemas";
import { expensesLogger } from "@/lib/logger";

async function getCurrentUserId(): Promise<string> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function createExpenseAction(
  data: InputFormSchema,
): Promise<ActionResponse<Expense | null, InputFormSchema>> {
  try {
    const userId = await getCurrentUserId();
    const parsedData = createFormSchema.parse(data);

    const result = await prisma.expense.create({
      data: {
        date: parsedData.date,
        description: parsedData.description,
        category: parsedData.category,
        amount: parsedData.amount,
        note: parsedData.note ?? null,
        proofUrl: parsedData.proofUrl ?? null,
        createdById: userId,
      },
    });

    revalidatePath("/admin/expenses");
    revalidatePath("/admin");

    return {
      success: true,
      message: "Pengeluaran berhasil dicatat",
      data: result,
    };
  } catch (error) {
    expensesLogger.error({ err: error }, "Gagal tambah pengeluaran");
    return {
      success: false,
      message: "Pengeluaran gagal dicatat",
      globalError:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function updateExpenseAction(
  id: string,
  data: InputFormSchema,
): Promise<ActionResponse<Expense | null, InputFormSchema>> {
  try {
    const parsedData = updateFormSchema.parse(data);

    const existing = await prisma.expense.findUnique({ where: { id } });
    if (!existing || existing.status !== ExpenseStatus.SUBMITTED) {
      return {
        success: false,
        message: "Hanya pengeluaran dengan status Diajukan yang dapat diedit",
      };
    }

    const result = await prisma.expense.update({
      where: { id },
      data: {
        date: parsedData.date,
        description: parsedData.description,
        category: parsedData.category,
        amount: parsedData.amount,
        note: parsedData.note ?? null,
        proofUrl: parsedData.proofUrl ?? null,
      },
    });

    revalidatePath("/admin/expenses");
    revalidatePath("/admin");

    return {
      success: true,
      message: "Pengeluaran berhasil diperbarui",
      data: result,
    };
  } catch (error) {
    expensesLogger.error({ err: error, expenseId: id }, "Gagal update pengeluaran");
    return {
      success: false,
      message: "Pengeluaran gagal diperbarui",
      globalError:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function approveExpenseAction(
  id: string,
): Promise<ActionResponse<Expense | null>> {
  try {
    const userId = await getCurrentUserId();

    const existing = await prisma.expense.findUnique({ where: { id } });
    if (!existing || existing.status !== ExpenseStatus.SUBMITTED) {
      return {
        success: false,
        message: "Hanya pengeluaran dengan status Diajukan yang dapat disetujui",
      };
    }

    const result = await prisma.expense.update({
      where: { id },
      data: {
        status: ExpenseStatus.APPROVED,
        approvedById: userId,
        approvedAt: new Date(),
      },
    });

    revalidatePath("/admin/expenses");
    revalidatePath("/admin");

    return {
      success: true,
      message: "Pengeluaran berhasil disetujui",
      data: result,
    };
  } catch (error) {
    expensesLogger.error({ err: error, expenseId: id }, "Gagal approve pengeluaran");
    return {
      success: false,
      message: "Pengeluaran gagal disetujui",
      globalError:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function deleteExpenseAction(
  id: string,
): Promise<ActionResponse<string>> {
  try {
    const existing = await prisma.expense.findUnique({ where: { id } });
    if (!existing || existing.status !== ExpenseStatus.SUBMITTED) {
      return {
        success: false,
        message: "Hanya pengeluaran dengan status Diajukan yang dapat dihapus",
      };
    }

    await prisma.expense.delete({ where: { id } });

    revalidatePath("/admin/expenses");

    return {
      success: true,
      message: "Pengeluaran berhasil dihapus",
      data: "",
    };
  } catch (error) {
    expensesLogger.error({ err: error, expenseId: id }, "Gagal hapus pengeluaran");
    return {
      success: false,
      message: "Pengeluaran gagal dihapus",
      globalError:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function deleteBatchExpensesAction(ids: string[]) {
  try {
    await prisma.expense.deleteMany({
      where: { id: { in: ids }, status: ExpenseStatus.SUBMITTED },
    });
    revalidatePath("/admin/expenses");
  } catch (error) {
    expensesLogger.error({ err: error, expenseIds: ids }, "Gagal hapus batch pengeluaran");
  }
}
