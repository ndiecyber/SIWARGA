import { NextRequest, NextResponse } from "next/server";
import ReactPDF from "@react-pdf/renderer";
import prisma from "@/lib/db";
import { PaymentStatus } from "@/generated/prisma/enums";

import { CashFlowReportPDF } from "@/features/admin/expenses/components/cash-flow-report-pdf";
import type { CashFlowReportData } from "@/features/admin/expenses/components/cash-flow-report-pdf";

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

  // Income from payments
  const payments = await prisma.payment.findMany({
    where: {
      status: PaymentStatus.SUCCESS,
      paidAt: {
        gte: new Date(year, month - 1, 1),
        lt: new Date(year, month, 1),
      },
    },
    include: {
      monthlyDues: {
        include: {
          house: true,
        },
      },
    },
  });

  let totalIncome = 0;
  const incomeByHouse: Record<string, number> = {};

  for (const payment of payments) {
    const amount = Number(payment.amountPaid);
    totalIncome += amount;
    for (const due of payment.monthlyDues) {
      const label = `Blok ${due.house.block} / No. ${due.house.houseNumber}`;
      incomeByHouse[label] = (incomeByHouse[label] || 0) + amount;
    }
  }

  // Expenses
  const expenses = await prisma.expense.findMany({
    where: {
      status: "APPROVED",
      date: {
        gte: new Date(year, month - 1, 1),
        lt: new Date(year, month, 1),
      },
    },
  });

  let totalExpense = 0;
  const expenseByCategory: Record<string, number> = {};

  for (const exp of expenses) {
    const amount = Number(exp.amount);
    totalExpense += amount;
    expenseByCategory[exp.category] = (expenseByCategory[exp.category] || 0) + amount;
  }

  const reportData: CashFlowReportData = {
    periodLabel: `${MONTHS_FULL[month - 1]} ${year}`,
    printDate: formatDate(new Date()),
    totalIncome,
    totalExpense,
    netCashFlow: totalIncome - totalExpense,
    incomeBreakdown: Object.entries(incomeByHouse).map(([label, amount]) => ({ label, amount })),
    expenseBreakdown: Object.entries(expenseByCategory).map(([label, amount]) => ({ label, amount })),
  };

  const pdfStream = await ReactPDF.renderToStream(
    <CashFlowReportPDF data={reportData} />,
  );

  const chunks: Buffer[] = [];
  for await (const chunk of pdfStream) {
    chunks.push(Buffer.from(chunk));
  }
  const pdfBuffer = Buffer.concat(chunks);

  const monthName = MONTHS_FULL[month - 1].toLowerCase();
  const filename = `Laporan_Arus_Kas_${monthName}_${year}.pdf`;

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
