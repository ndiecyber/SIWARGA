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

  const SIMULATE_OVERDUE = false; // ← comment to disable

  // ── Fast-path: pure simulation, no DB queries ───────────────────────
  if (SIMULATE_OVERDUE) {
    const months = [1, 2, 3, 4, 5, 6].filter((m) => m <= currentMonth);
    const paidMap: Record<number, boolean> = { 3: true, 5: true };

    return (
      <DashboardPage
        userName={user.name}
        currentMonthName={monthName}
        currentMonthDue={{
          status: "TERTUNDA",
          amount: 25000,
          dueDate: "30 Juni",
        }}
        yearlyStats={{
          paidMonths: months.filter((m) => paidMap[m]).length,
          totalMonths: months.length,
        }}
        overdueDues={months
          .filter((m) => !paidMap[m] && m < currentMonth)
          .map((m) => ({
            id: `sim-${m}`,
            month: m,
            year: currentYear,
            amount: 25000,
            label: new Intl.DateTimeFormat("id-ID", {
              month: "long",
              year: "numeric",
            }).format(new Date(currentYear, m - 1)),
            dueDate: `${new Date(currentYear, m, 0).getDate()} ${new Intl.DateTimeFormat("id-ID", { month: "long" }).format(new Date(currentYear, m - 1))}`,
          }))}
        announcements={[]}
        totalResidents={0}
        recentAnnouncementCount={0}
      />
    );
  }

  // ── Real data path ─────────────────────────────────────────────────
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

  const overdueDues = yearlyDues.filter(
    (d) =>
      d.status === "UNPAID" &&
      (d.year < currentYear ||
        (d.year === currentYear && d.month < currentMonth)),
  );

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
      overdueDues={overdueDues.map((d) => ({
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
