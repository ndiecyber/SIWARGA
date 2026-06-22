import type { Metadata } from "next";
import layoutWithAuthUser, {
  LayoutWithAuthUserProps,
} from "@/components/layouts/auth/layout-with-auth-user";
import DashboardPage from "@/features/users/pages/dashboard-page";
import prisma from "@/lib/db";

export const metadata: Metadata = {
  title: "Dashboard Warga",
  description:
    "Pantau ringkasan iuran, pengumuman, dan kegiatan warga dari dashboard SIWARGA.",
};

async function Page({ user }: LayoutWithAuthUserProps) {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const monthName = new Intl.DateTimeFormat("id-ID", {
    month: "long",
  }).format(now);

  const resident = await prisma.resident.findFirst({
    where: { userId: user.id },
    include: {
      house: { select: { id: true, block: true, houseNumber: true } },
    },
  });

  const occupiedHouse =
    resident?.house ??
    (await prisma.house.findFirst({
      where: { ownerId: user.id },
      select: { id: true, block: true, houseNumber: true },
    }));

  const currentDue = occupiedHouse
    ? await prisma.monthlyDues.findFirst({
        where: {
          houseId: occupiedHouse.id,
          month: currentMonth,
          year: currentYear,
        },
        include: { payment: { select: { status: true } } },
      })
    : null;

  const yearlyDues = occupiedHouse
    ? await prisma.monthlyDues.findMany({
        where: {
          houseId: occupiedHouse.id,
          year: currentYear,
        },
      })
    : [];

  const paidMonths = yearlyDues.filter((d) => d.status === "PAID").length;

  const SIMULATE_OVERDUE = false; // ← comment this line to disable overdue simulation

  const overdueDues = occupiedHouse
    ? await prisma.monthlyDues.findMany({
        where: {
          houseId: occupiedHouse.id,
          status: "UNPAID",
          OR: [
            { year: { lt: currentYear } },
            { year: currentYear, month: { lt: currentMonth } },
          ],
        },
        select: {
          id: true,
          month: true,
          year: true,
          amount: true,
          dueDate: true,
        },
        orderBy: [{ year: "desc" }, { month: "desc" }],
      })
    : [];

  const simulatedOverdue = SIMULATE_OVERDUE
    ? [
        {
          id: "sim-jan",
          month: 1,
          year: currentYear,
          amount: 25000,
          dueDate: new Date(currentYear, 0, 31, 12),
        },
        {
          id: "sim-feb",
          month: 2,
          year: currentYear,
          amount: 25000,
          dueDate: new Date(currentYear, 1, 28, 12),
        },
        {
          id: "sim-mar",
          month: 3,
          year: currentYear,
          amount: 25000,
          dueDate: new Date(currentYear, 2, 31, 12),
        },
      ]
    : [];

  const allOverdueDues =
    overdueDues.length > 0 ? overdueDues : simulatedOverdue;

  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
    },
  });

  const totalResidents = await prisma.resident.count();

  return (
    <DashboardPage
      userName={user.name}
      currentMonthName={monthName}
      currentMonthDue={
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
      yearlyStats={{
        paidMonths,
        totalMonths: yearlyDues.length,
      }}
      overdueDues={allOverdueDues.map((d) => ({
        id: d.id,
        month: d.month,
        year: d.year,
        amount: Number(d.amount),
        label: new Intl.DateTimeFormat("id-ID", {
          month: "long",
          year: "numeric",
        }).format(new Date(d.year, d.month - 1)),
        dueDate: new Intl.DateTimeFormat("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(d.dueDate),
      }))}
      announcements={announcements.map((a) => ({
        id: a.id,
        title: a.title,
        excerpt: a.description,
        date: new Intl.DateTimeFormat("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(new Date(a.createdAt)),
      }))}
      totalResidents={totalResidents}
      recentAnnouncementCount={
        announcements.filter((a) => {
          const daysDiff = Math.floor(
            (now.getTime() - new Date(a.createdAt).getTime()) /
              (1000 * 60 * 60 * 24),
          );
          return daysDiff <= 7;
        }).length
      }
    />
  );
}

export default layoutWithAuthUser(Page);
