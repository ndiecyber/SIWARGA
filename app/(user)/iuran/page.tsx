import type { Metadata } from "next";
import layoutWithAuthUser, {
  LayoutWithAuthUserProps,
} from "@/components/layouts/auth/layout-with-auth-user";
import DuesPage from "@/features/users/pages/dues-page";
import prisma from "@/lib/db";

export const metadata: Metadata = {
  title: "Iuran Warga",
  description:
    "Pantau status pembayaran dan riwayat iuran warga melalui portal SIWARGA.",
};

async function Page({ user }: LayoutWithAuthUserProps) {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const SIMULATE_OVERDUE = true; // ← comment to disable

  // ── Fast-path: pure simulation, no DB queries ───────────────────────
  if (SIMULATE_OVERDUE) {
    const months = [1, 2, 3, 4, 5, 6].filter((m) => m <= currentMonth);
    const paidMap: Record<number, boolean> = { 4: true, 6: true };

    return (
      <DuesPage
        userName={user.name}
        stats={{
          totalAmount: months.length * 25000,
          paidCount: months.filter((m) => paidMap[m]).length,
          unpaidCount: months.filter((m) => !paidMap[m]).length,
          totalTagihan: months.length,
        }}
        currentDue={{
          status: months.includes(currentMonth) && paidMap[currentMonth] ? "LUNAS" : "TERTUNDA",
          amount: 25000,
          dueDate: `${new Date(currentYear, currentMonth, 0).getDate()} ${new Intl.DateTimeFormat("id-ID", { month: "long" }).format(now)}`,
        }}
        currentMonthName={new Intl.DateTimeFormat("id-ID", {
          month: "long",
        }).format(now)}
        dues={months.map((m) => ({
          id: `sim-${m}`,
          month: m,
          year: currentYear,
          amount: 25000,
          dueDate: `${new Date(currentYear, m, 0).getDate()} ${new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(new Date(currentYear, m - 1))}`,
          status: (paidMap[m] ? "PAID" : "UNPAID") as "PAID" | "UNPAID",
          payment: paidMap[m]
            ? {
                amountPaid: 25000,
                paidAt: `15 ${new Intl.DateTimeFormat("id-ID", { month: "short", year: "numeric" }).format(new Date(currentYear, m - 1))}`,
                paymentMethod: "QRIS",
                status: "SUCCESS" as "SUCCESS" | "FAILED",
              }
            : null,
          isOverdue: !paidMap[m] && m < currentMonth,
        }))}
      />
    );
  }

  // ── Real data path ─────────────────────────────────────────────────
  const resident = await prisma.resident.findFirst({
    where: { userId: user.id },
    include: {
      house: { select: { id: true } },
    },
  });

  const occupiedHouse =
    resident?.house ??
    (await prisma.house.findFirst({
      where: { ownerId: user.id },
      select: { id: true },
    }));

  const monthlyDues = occupiedHouse
    ? await prisma.monthlyDues.findMany({
        where: { houseId: occupiedHouse.id },
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
        orderBy: [{ year: "desc" }, { month: "desc" }],
      })
    : [];

  const currentDue = monthlyDues.find(
    (d) => d.month === currentMonth && d.year === currentYear,
  );

  const paidCount = monthlyDues.filter((d) => d.status === "PAID").length;
  const unpaidCount = monthlyDues.filter((d) => d.status === "UNPAID").length;
  const totalAmount = monthlyDues.reduce((sum, d) => sum + Number(d.amount), 0);

  return (
    <DuesPage
      userName={user.name}
      stats={{
        totalAmount,
        paidCount,
        unpaidCount,
        totalTagihan: monthlyDues.length,
      }}
      currentDue={
        currentDue
          ? {
              status: currentDue.status === "PAID" ? "LUNAS" : "TERTUNDA",
              amount: Number(currentDue.amount),
              dueDate: new Intl.DateTimeFormat("id-ID", {
                day: "numeric",
                month: "long",
              }).format(currentDue.dueDate),
            }
          : null
      }
      currentMonthName={new Intl.DateTimeFormat("id-ID", {
        month: "long",
      }).format(now)}
      dues={monthlyDues.map((d) => ({
        id: d.id,
        month: d.month,
        year: d.year,
        amount: Number(d.amount),
        dueDate: new Intl.DateTimeFormat("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(d.dueDate),
        status: d.status as "PAID" | "UNPAID",
        payment: d.payment
          ? {
              amountPaid: Number(d.payment.amountPaid),
              paidAt: new Intl.DateTimeFormat("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }).format(d.payment.paidAt),
              paymentMethod: d.payment.paymentMethod,
              status: d.payment.status as "SUCCESS" | "FAILED",
            }
          : null,
        isOverdue:
          d.status === "UNPAID" &&
          (d.year < currentYear ||
            (d.year === currentYear && d.month < currentMonth)),
      }))}
    />
  );
}

export default layoutWithAuthUser(Page);
