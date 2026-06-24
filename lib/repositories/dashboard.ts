import prisma from "@/lib/db";
import { getDuesStats } from "./monthly-dues";
import { getTotalCollectedFunds } from "./payments";

export async function aggregateDashboardStats() {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const [totalResidents, totalHouses, occupiedHouses, vacantHouses, totalAnnouncements, totalCollected, duesStats] =
    await Promise.all([
      prisma.user.count(),
      prisma.house.count(),
      prisma.house.count({ where: { status: "OCCUPIED" } }),
      prisma.house.count({ where: { status: "VACANT" } }),
      prisma.announcement.count(),
      getTotalCollectedFunds(),
      getDuesStats(currentMonth, currentYear),
    ]);

  const occupancyPercentage = totalHouses > 0 ? (occupiedHouses / totalHouses) * 100 : 0;
  const duesPaidPercentage = duesStats.total > 0 ? (duesStats.paid / duesStats.total) * 100 : 0;

  return {
    totalResidents,
    totalHouses,
    occupiedHouses,
    vacantHouses,
    totalAnnouncements,
    totalCollectedFunds: totalCollected,
    occupancyPercentage,
    duesStats,
    duesPaidPercentage,
  };
}
