import { NextRequest, NextResponse } from "next/server";
import ReactPDF from "@react-pdf/renderer";
import prisma from "@/lib/db";
import {
  MonthlyDuesStatus,
  PaymentStatus,
  HouseStatus,
} from "@/generated/prisma/enums";
import {
  MonthlyReportPDF,
} from "@/features/admin/fees/components/monthly-report-pdf";

import type {
  PaymentRow,
  ArrearsRow,
  ReportData,
} from "@/features/admin/fees/components/monthly-report-pdf";

const MONTHS_FULL = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const DUES_AMOUNT = 25000;

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

function formatPaymentMethod(method: string): string {
  const map: Record<string, string> = {
    TUNAI: "Tunai (Cash)",
    TRANSFER_BANK: "BANK (Transfer)",
    QRIS: "QRIS",
    E_WALLET: "E-Wallet",
  };
  return map[method] ?? method;
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

  const houses = await prisma.house.findMany({
    where: { status: HouseStatus.OCCUPIED },
    include: {
      monthlyDues: {
        where: { month, year },
        include: { payment: true },
      },
    },
    orderBy: [{ block: "asc" }, { houseNumber: "asc" }],
  });

  const payments: PaymentRow[] = [];
  let totalRealisasi = 0;

  for (const house of houses) {
    for (const due of house.monthlyDues) {
      if (
        due.status === MonthlyDuesStatus.PAID &&
        due.payment &&
        due.payment.status === PaymentStatus.SUCCESS
      ) {
        payments.push({
          date: formatDate(due.payment.paidAt),
          houseLabel: `Blok ${house.block} / No. ${house.houseNumber}`,
          method: formatPaymentMethod(due.payment.paymentMethod),
          amount: Number(due.payment.amountPaid),
        });
        totalRealisasi += Number(due.payment.amountPaid);
      }
    }
  }

  const arrears: ArrearsRow[] = [];
  let totalTunggakan = 0;
  let counter = 0;

  for (const house of houses) {
    const unpaidDue = house.monthlyDues.find(
      (d) => d.status === MonthlyDuesStatus.UNPAID,
    );
    if (unpaidDue) {
      counter++;
      arrears.push({
        number: counter,
        houseLabel: `Blok ${house.block} / No. ${house.houseNumber}`,
        amount: Number(unpaidDue.amount),
      });
      totalTunggakan += Number(unpaidDue.amount);
    }
  }

  const totalTarget = houses.length * DUES_AMOUNT;

  const reportData: ReportData = {
    periodLabel: `${MONTHS_FULL[month - 1]} ${year}`,
    printDate: formatDate(new Date()),
    totalTarget,
    totalRealisasi,
    totalTunggakan,
    payments,
    arrears,
  };

  const pdfStream = await ReactPDF.renderToStream(
    <MonthlyReportPDF data={reportData} />,
  );

  const chunks: Buffer[] = [];
  for await (const chunk of pdfStream) {
    chunks.push(Buffer.from(chunk));
  }
  const pdfBuffer = Buffer.concat(chunks);

  const monthName = MONTHS_FULL[month - 1].toLowerCase();
  const filename = `Laporan_Bulanan_Keuangan_RT_${monthName}_${year}.pdf`;

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
