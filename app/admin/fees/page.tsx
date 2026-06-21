import layoutWithAuthAdmin, {
  LayoutWithAuthAdminProps,
} from "@/components/layouts/auth/layout-with-auth-admin";
import FeesPage from "@/features/admin/fees/pages/fees-page";
import prisma from "@/lib/db";
import { connection } from "next/server";
import { Metadata } from "next";
import { HouseStatus } from "@/generated/prisma/enums";

export const metadata: Metadata = {
  title: "Data Iuran",
  description: "Kelola iuran warga dari panel admin SIWARGA.",
};

const DUES_AMOUNT = 25000;

async function Page({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
} & LayoutWithAuthAdminProps) {
  await connection();

  const params = await searchParams;
  const now = new Date();
  const currentMonth = params.month ? Number(params.month) : now.getMonth() + 1;
  const currentYear = params.year ? Number(params.year) : now.getFullYear();

  const houses = await prisma.house.findMany({
    where: {
      status: HouseStatus.OCCUPIED,
    },
    orderBy: [{ block: "asc" }, { houseNumber: "asc" }],
    include: {
      owner: {
        select: { name: true },
      },
      monthlyDues: {
        where: {
          month: currentMonth,
          year: currentYear,
        },
        include: {
          payment: {
            select: {
              amountPaid: true,
              paidAt: true,
              paymentMethod: true,
              status: true,
            },
          },
        },
      },
    },
  });

  const totalHouses = houses.length;

  const { feeRows, paidCount, unpaidCount, notGeneratedCount, paidAmount } =
    houses.reduce(
      (acc, house) => {
        const due = house.monthlyDues[0];
        const isPaid = due?.status === "PAID";
        const payment = due?.payment;

        if (!due) {
          acc.notGeneratedCount++;
        } else if (isPaid) {
          acc.paidCount++;
          acc.paidAmount += Number(payment?.amountPaid ?? 0);
        } else {
          acc.unpaidCount++;
        }

        acc.feeRows.push({
          id: house.id,
          block: house.block,
          houseNumber: house.houseNumber,
          ownerName: house.owner?.name ?? "—",
          status: (!due ? "BELUM_DIBUAT" : isPaid ? "LUNAS" : "TERTUNDA") as
            | "BELUM_DIBUAT"
            | "LUNAS"
            | "TERTUNDA",
          monthlyDueId: due?.id ?? null,
          lastPaymentDate: payment?.paidAt
            ? new Intl.DateTimeFormat("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }).format(payment.paidAt)
            : null,
        });

        return acc;
      },
      {
        feeRows: [] as Array<{
          id: string;
          block: string;
          houseNumber: string;
          ownerName: string;
          status: "BELUM_DIBUAT" | "LUNAS" | "TERTUNDA";
          monthlyDueId: string | null;
          lastPaymentDate: string | null;
        }>,
        paidCount: 0,
        unpaidCount: 0,
        notGeneratedCount: 0,
        paidAmount: 0,
      },
    );

  return (
    <FeesPage
      houses={feeRows}
      stats={{
        totalHouses,
        totalTagihan: totalHouses * DUES_AMOUNT,
        paidCount,
        unpaidCount,
        notGeneratedCount,
        paidAmount,
        totalTarget: (totalHouses - notGeneratedCount) * DUES_AMOUNT,
      }}
      period={{
        month: currentMonth,
        year: currentYear,
      }}
    />
  );
}

export default layoutWithAuthAdmin(Page);
