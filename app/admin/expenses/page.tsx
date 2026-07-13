import type { Metadata } from "next";
import layoutWithAuthAdmin from "@/components/layouts/auth/layout-with-auth-admin";
import prisma from "@/lib/db";
import { connection } from "next/server";

import ExpensesPage from "@/features/admin/expenses/pages/expenses-page";
import type { ExpenseWithCreator } from "@/features/admin/expenses/types";

export const metadata: Metadata = {
  title: "Pengeluaran | SIWARGA",
  description: "Kelola data pengeluaran kas RT",
};

async function Page(_props: { user: { name: string; email?: string } }) {
  await connection();

  const rawExpenses = await prisma.expense.findMany({
    include: {
      createdBy: true,
      approvedBy: true,
    },
    orderBy: { date: "desc" },
  });

  const expenses = JSON.parse(JSON.stringify(rawExpenses)) as ExpenseWithCreator[];

  return <ExpensesPage expenses={expenses} />;
}

export default layoutWithAuthAdmin(Page);
