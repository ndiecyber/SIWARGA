import type { Metadata } from "next";
import layoutWithAuthAdmin from "@/components/layouts/auth/layout-with-auth-admin";
import prisma from "@/lib/db";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Home,
  Megaphone,
  Wallet,
  PlusCircle,
  Calendar,
  ChevronRight,
  Activity,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  Shield,
  Moon,
} from "lucide-react";
import Link from "next/link";
import { connection } from "next/server";

export const metadata: Metadata = {
  title: "Dashboard Admin | SIWARGA",
  description: "Ringkasan panel admin untuk pengurus RT SIWARGA.",
};

const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatDateTime = (date: Date) => {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

async function Page({ user }: { user: { name: string; email?: string } }) {
  await connection();

  // Fetch live stats from DB
  const totalResidents = await prisma.user.count();
  const totalHouses = await prisma.house.count();
  const occupiedHouses = await prisma.house.count({
    where: { status: "OCCUPIED" },
  });
  const vacantHouses = await prisma.house.count({
    where: { status: "VACANT" },
  });
  const totalAnnouncements = await prisma.announcement.count();

  // Fetch dues/payment aggregates
  const totalPaymentsSum = await prisma.payment.aggregate({
    where: { status: "SUCCESS" },
    _sum: { amountPaid: true },
  });
  const totalCollectedFunds = Number(totalPaymentsSum._sum.amountPaid || 0);

  // Fetch current month dues
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  // Expense aggregates
  const expenseThisMonth = await prisma.expense.aggregate({
    where: {
      status: "APPROVED",
      date: {
        gte: new Date(currentYear, currentMonth - 1, 1),
        lt: new Date(currentYear, currentMonth, 1),
      },
    },
    _sum: { amount: true },
  });

  const expenseThisYear = await prisma.expense.aggregate({
    where: {
      status: "APPROVED",
      date: {
        gte: new Date(currentYear, 0, 1),
        lt: new Date(currentYear + 1, 0, 1),
      },
    },
    _sum: { amount: true },
  });

  const totalExpenseThisMonth = Number(expenseThisMonth._sum.amount || 0);
  const totalExpenseThisYear = Number(expenseThisYear._sum.amount || 0);
  const netCashFlow = totalCollectedFunds - totalExpenseThisYear;

  const paidDuesThisMonth = await prisma.monthlyDues.count({
    where: { month: currentMonth, year: currentYear, status: "PAID" },
  });

  const unpaidDuesThisMonth = await prisma.monthlyDues.count({
    where: { month: currentMonth, year: currentYear, status: "UNPAID" },
  });

  // Recent payments
  const recentPayments = await prisma.payment.findMany({
    take: 5,
    orderBy: { paidAt: "desc" },
    include: {
      monthlyDues: {
        include: {
          house: {
            include: {
              owner: true,
            },
          },
        },
      },
    },
  });

  // Recent registered users
  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      residentProfile: {
        include: {
          house: true,
        },
      },
    },
  });

  // Fetch today's ronda schedule
  const dayOfWeekMap = [7, 1, 2, 3, 4, 5, 6];
  const todayDayValue = dayOfWeekMap[new Date().getDay()];
  const todayRonda = await prisma.ronda.findMany({
    where: { dayOfWeek: todayDayValue },
    include: {
      user: {
        select: {
          name: true,
          phoneNumber: true,
        },
      },
    },
  });

  const dayNames = [
    "",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
    "Minggu",
  ];
  const todayDayName = dayNames[todayDayValue];

  // Calculating percentages
  const occupancyPercentage =
    totalHouses > 0 ? (occupiedHouses / totalHouses) * 100 : 0;
  const totalDuesThisMonthCount = paidDuesThisMonth + unpaidDuesThisMonth;
  const duesPaidPercentage =
    totalDuesThisMonthCount > 0
      ? (paidDuesThisMonth / totalDuesThisMonthCount) * 100
      : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner / Header */}
      <div className="flex flex-col gap-4 pb-6 border-b md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-muted-foreground">
            Selamat datang kembali,{" "}
            <span className="font-semibold text-foreground">{user.name}</span>.
            Berikut ringkasan status RT 04 hari ini.
          </p>
        </div>
        <div className="flex items-center self-start gap-2 px-4 py-2 text-xs font-medium border shadow-xs rounded-xl bg-card text-muted-foreground md:self-auto">
          <Calendar className="size-4 text-primary" />
          <span>
            {new Intl.DateTimeFormat("id-ID", { dateStyle: "full" }).format(
              new Date(),
            )}
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Metric 1: Total Warga */}
        <Card size="sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
              Total Warga
            </CardTitle>
            <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
              <Users className="size-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalResidents}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              warga terdaftar di portal
            </p>
          </CardContent>
        </Card>

        {/* Metric 2: Okupansi Rumah */}
        <Card size="sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
              Okupansi Rumah
            </CardTitle>
            <div className="grid size-9 place-items-center rounded-xl bg-amber-500/10 text-amber-500">
              <Home className="size-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {occupiedHouses}{" "}
              <span className="text-sm font-medium text-muted-foreground">
                / {totalHouses}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {occupancyPercentage.toFixed(0)}% rumah terisi
            </p>
          </CardContent>
        </Card>

        {/* Metric 3: Kas Iuran */}
        <Card size="sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
              Kas Masuk (Iuran)
            </CardTitle>
            <div className="grid size-9 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <Wallet className="size-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatRupiah(totalCollectedFunds)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              total pembayaran lunas
            </p>
          </CardContent>
        </Card>

        {/* Metric 4: Pengeluaran */}
        <Card size="sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
              Pengeluaran (Bln Ini)
            </CardTitle>
            <div className="grid size-9 place-items-center rounded-xl bg-red-500/10 text-red-500">
              <ArrowUpDown className="size-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatRupiah(totalExpenseThisMonth)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatRupiah(totalExpenseThisYear)} tahun ini
            </p>
          </CardContent>
        </Card>

        {/* Metric 4: Pengumuman */}
        <Card size="sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
              Pengumuman
            </CardTitle>
            <div className="grid text-blue-500 size-9 place-items-center rounded-xl bg-blue-500/10">
              <Megaphone className="size-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAnnouncements}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              kegiatan & info lingkungan
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Expense Summary Row */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card size="sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Kas Bersih
            </CardTitle>
            <CardDescription className="text-xs">
              Total pemasukan - pengeluaran (tahun ini)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netCashFlow >= 0 ? "text-emerald-600" : "text-red-600"}`}>
              {formatRupiah(Math.abs(netCashFlow))}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {netCashFlow >= 0 ? "Surplus" : "Defisit"}
            </p>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Pengeluaran Tahun Ini
            </CardTitle>
            <CardDescription className="text-xs">
              Total pengeluaran yang sudah disetujui
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatRupiah(totalExpenseThisYear)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts & Quick Actions Row */}
      <div className="grid gap-6 md:grid-cols-12">
        {/* Occupancy Donut Chart Card */}
        <Card className="flex flex-col justify-between md:col-span-4">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Okupansi Perumahan
            </CardTitle>
            <CardDescription className="text-xs">
              Rasio rumah terisi vs kosong
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className="relative flex items-center justify-center">
              <svg className="transform -rotate-90 w-36 h-36">
                <circle
                  cx="72"
                  cy="72"
                  r="55"
                  className="stroke-muted/40"
                  strokeWidth="12"
                  fill="transparent"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="55"
                  className="transition-all duration-500 stroke-amber-500"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 55}
                  strokeDashoffset={
                    2 * Math.PI * 55 * (1 - occupancyPercentage / 100)
                  }
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-2xl font-bold tracking-tight">
                  {occupancyPercentage.toFixed(0)}%
                </span>
                <span className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                  Terisi
                </span>
              </div>
            </div>
            <div className="grid w-full grid-cols-2 gap-4 pt-4 mt-6 text-center border-t">
              <div>
                <span className="block text-xs text-muted-foreground">
                  Terisi
                </span>
                <span className="text-lg font-bold text-foreground">
                  {occupiedHouses} Unit
                </span>
              </div>
              <div>
                <span className="block text-xs text-muted-foreground">
                  Kosong
                </span>
                <span className="text-lg font-bold text-muted-foreground">
                  {vacantHouses} Unit
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dues Realization Progress Card */}
        <Card className="flex flex-col justify-between md:col-span-4">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Realisasi Iuran Bulan Ini
            </CardTitle>
            <CardDescription className="text-xs">
              Pembayaran iuran periode{" "}
              {new Intl.DateTimeFormat("id-ID", {
                month: "long",
                year: "numeric",
              }).format(new Date())}
            </CardDescription>
          </CardHeader>
          <CardContent className="py-2">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-muted-foreground">
                  Tingkat Kelunasan
                </span>
                <span className="font-bold text-emerald-600">
                  {duesPaidPercentage.toFixed(0)}% Lunas
                </span>
              </div>
              <div className="flex w-full h-4 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full transition-all duration-500 bg-emerald-500"
                  style={{ width: `${duesPaidPercentage}%` }}
                />
                <div
                  className="h-full transition-all duration-500 bg-amber-500"
                  style={{ width: `${100 - duesPaidPercentage}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 text-emerald-700">
                  <div className="rounded-full size-2 bg-emerald-500" />
                  <div>
                    <span className="block text-sm font-bold">
                      {paidDuesThisMonth} Rumah
                    </span>
                    <span className="text-[10px] uppercase font-semibold tracking-wider opacity-85">
                      Lunas
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 text-amber-700">
                  <div className="rounded-full size-2 bg-amber-500" />
                  <div>
                    <span className="block text-sm font-bold">
                      {unpaidDuesThisMonth} Rumah
                    </span>
                    <span className="text-[10px] uppercase font-semibold tracking-wider opacity-85">
                      Tertunda
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-2 border-t">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Tarif Iuran:</span>
                  <span>Rp 25.000 / bulan</span>
                </div>
                <div className="flex items-center justify-between mt-1 text-xs font-bold text-foreground">
                  <span>Total Potensi Kas Bulan Ini:</span>
                  <span>{formatRupiah(totalHouses * 25000)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Panel */}
        <Card className="flex flex-col justify-between md:col-span-4">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Aksi Cepat Admin
            </CardTitle>
            <CardDescription className="text-xs">
              Shortcuts menu administrasi RT
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 py-2">
            <Link
              href="/admin/users"
              className="flex items-center justify-between p-3 transition-all border shadow-xs group rounded-xl bg-card hover:bg-muted/50 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="grid transition-transform rounded-lg size-9 place-items-center bg-primary/10 text-primary group-hover:scale-110">
                  <Users className="size-5" />
                </div>
                <div>
                  <span className="block text-sm font-semibold">
                    Kelola Warga
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Daftar & verifikasi warga
                  </span>
                </div>
              </div>
              <ChevronRight className="transition-transform size-4 text-muted-foreground group-hover:translate-x-1" />
            </Link>

            <Link
              href="/admin/announcement"
              className="flex items-center justify-between p-3 transition-all border shadow-xs group rounded-xl bg-card hover:bg-muted/50 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="grid text-blue-500 transition-transform rounded-lg size-9 place-items-center bg-blue-500/10 group-hover:scale-110">
                  <Megaphone className="size-5" />
                </div>
                <div>
                  <span className="block text-sm font-semibold">
                    Buat Pengumuman
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Publikasikan info & agenda RT
                  </span>
                </div>
              </div>
              <ChevronRight className="transition-transform size-4 text-muted-foreground group-hover:translate-x-1" />
            </Link>

            <Link
              href="/admin/houses"
              className="flex items-center justify-between p-3 transition-all border shadow-xs group rounded-xl bg-card hover:bg-muted/50 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="grid transition-transform rounded-lg size-9 place-items-center bg-amber-500/10 text-amber-500 group-hover:scale-110">
                  <Home className="size-5" />
                </div>
                <div>
                  <span className="block text-sm font-semibold">
                    Kelola Perumahan
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Petakan rumah & blok
                  </span>
                </div>
              </div>
              <ChevronRight className="transition-transform size-4 text-muted-foreground group-hover:translate-x-1" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Latest Registered Residents */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">
                Pendaftaran Warga Terbaru
              </CardTitle>
              <CardDescription className="text-xs">
                Warga terdaftar di portal SIWARGA
              </CardDescription>
            </div>
            <Link
              href="/admin/users"
              className="flex items-center text-xs font-semibold text-primary hover:underline"
            >
              Lihat Semua <ArrowUpRight className="size-3.5 ml-0.5" />
            </Link>
          </CardHeader>
          <CardContent className="py-2">
            {recentUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                <Users className="mb-2 size-8 stroke-muted-foreground/50" />
                <span className="text-xs font-medium">
                  Belum ada warga terdaftar
                </span>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentUsers.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid text-sm font-bold rounded-full size-9 place-items-center bg-primary/10 text-primary">
                        {item.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="block text-sm font-semibold">
                          {item.name}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {item.phoneNumber}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      {item.residentProfile?.house ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                          <MapPin className="size-3 text-primary" />
                          {item.residentProfile.house.block}-
                          {item.residentProfile.house.houseNumber}
                        </span>
                      ) : (
                        <span className="text-xs italic text-muted-foreground">
                          Belum menetap
                        </span>
                      )}
                      <span className="block text-[10px] text-muted-foreground mt-0.5">
                        {formatDate(item.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Latest Payments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">
                Aktivitas Pembayaran Terbaru
              </CardTitle>
              <CardDescription className="text-xs">
                Riwayat iuran masuk dari perumahan
              </CardDescription>
            </div>
            <span className="flex items-center text-xs font-semibold text-muted-foreground">
              Real-time
            </span>
          </CardHeader>
          <CardContent className="py-2">
            {recentPayments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                <Clock className="mb-2 size-8 stroke-muted-foreground/50" />
                <span className="text-xs font-medium">
                  Belum ada riwayat pembayaran
                </span>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentPayments.map((p) => {
                  const dues = p.monthlyDues?.[0];
                  const house = dues?.house;
                  const ownerName = house?.owner?.name || "Warga";
                  const houseCode = house
                    ? `${house.block}-${house.houseNumber}`
                    : "-";
                  const statusSuccess = p.status === "SUCCESS";

                  return (
                    <div
                      key={p.id}
                      className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`grid size-9 place-items-center rounded-lg ${statusSuccess ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"}`}
                        >
                          {statusSuccess ? (
                            <CheckCircle2 className="size-5" />
                          ) : (
                            <XCircle className="size-5" />
                          )}
                        </div>
                        <div>
                          <span className="block text-sm font-bold">
                            {formatRupiah(Number(p.amountPaid))}
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            {ownerName} ({houseCode})
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block text-xs font-semibold text-muted-foreground">
                          {p.paymentMethod}
                        </span>
                        <span className="block text-[10px] text-muted-foreground mt-0.5">
                          {formatDateTime(p.paidAt)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Today's Ronda Schedule */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">
                Jadwal Ronda Malam Ini
              </CardTitle>
              <CardDescription className="text-xs">
                Hari {todayDayName}, 22.00 - 04.00 WIB
              </CardDescription>
            </div>
            <Link
              href="/admin/ronda"
              className="flex items-center text-xs font-semibold text-primary hover:underline"
            >
              Kelola <ArrowUpRight className="size-3.5 ml-0.5" />
            </Link>
          </CardHeader>
          <CardContent className="py-2">
            {todayRonda.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground text-center">
                <div className="grid size-12 place-items-center rounded-full bg-muted/40 text-muted-foreground mb-3">
                  <Shield className="size-6 stroke-muted-foreground/60" />
                </div>
                <span className="text-xs font-medium block">
                  Belum ada petugas ronda terjadwal
                </span>
                <span className="text-[10px] text-muted-foreground mt-1">
                  Gunakan tombol generate di halaman kelola
                </span>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {todayRonda.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid text-xs font-bold rounded-full size-8 place-items-center bg-indigo-500/10 text-indigo-600">
                        {item.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="block text-sm font-semibold truncate max-w-[120px]">
                          {item.user.name}
                        </span>
                        <span className="block text-[11px] text-muted-foreground">
                          {item.user.phoneNumber}
                        </span>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-md bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                      <Moon className="size-3" />
                      Petugas
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default layoutWithAuthAdmin(Page);
