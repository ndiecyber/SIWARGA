import { NextRequest, NextResponse } from "next/server";
import ReactPDF from "@react-pdf/renderer";
import prisma from "@/lib/db";

import { ExpenseReportPDF } from "@/features/admin/expenses/components/expense-report-pdf";
import type { ExpenseRow, ExpenseReportData } from "@/features/admin/expenses/components/expense-report-pdf";

const MONTHS_FULL = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export async function GET(request: NextRequest) {
  const month = Number(
    request.nextUrl.searchParams.get("month") ?? new Date().getMonth() + 1,
  );
  const year = Number(
    request.nextUrl.searchParams.get("year") ?? new Date().getFullYear(),
  );

  if (month < 1 || month > 12 || year < 2000) {
    return NextResponse.json({ error: "Invalid month or year" }, { status: 400 });
  }

  const expenses = await prisma.expense.findMany({
    where: {
      date: {
        gte: new Date(year, month - 1, 1),
        lt: new Date(year, month, 1),
      },
    },
    include: { approvedBy: true },
    orderBy: { date: "asc" },
  });

  const expenseRows: ExpenseRow[] = [];
  let totalExpenses = 0;
  const categoryTotals: Record<string, number> = {};

  for (const exp of expenses) {
    const amount = Number(exp.amount);
    expenseRows.push({
      date: formatDate(exp.date),
      description: exp.description,
      category: exp.category,
      amount,
      status: exp.status === "APPROVED" ? "Disetujui" : "Diajukan",
      approvedBy: exp.approvedBy?.name ?? "-",
    });
    totalExpenses += amount;
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + amount;
  }

  const categoryBreakdown = Object.entries(categoryTotals).map(([category, total]) => ({
    category,
    total,
  }));

  const reportData: ExpenseReportData = {
    periodLabel: `${MONTHS_FULL[month - 1]} ${year}`,
    printDate: formatDate(new Date()),
    totalExpenses,
    totalCount: expenses.length,
    expenses: expenseRows,
    categoryBreakdown,
  };

  const pdfStream = await ReactPDF.renderToStream(
    <ExpenseReportPDF data={reportData} />,
  );

  const chunks: Buffer[] = [];
  for await (const chunk of pdfStream) {
    chunks.push(Buffer.from(chunk));
  }
  const pdfBuffer = Buffer.concat(chunks);

  const monthName = MONTHS_FULL[month - 1].toLowerCase();
  const filename = `Laporan_Pengeluaran_${monthName}_${year}.pdf`;

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
