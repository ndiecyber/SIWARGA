"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  Plus,
  Trash2,
  RefreshCw,
  Sparkles,
  Users,
  CalendarDays,
  Phone,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import AddRondaDialog from "../components/add-ronda-dialog";
import {
  generateRondaSchedule,
  addRondaEntry,
  removeRondaEntry,
} from "@/app/admin/ronda/actions";

interface User {
  id: string;
  name: string;
  phoneNumber: string;
}

interface RondaScheduleEntry {
  id: string;
  dayOfWeek: number;
  userId: string;
  user: User;
}

interface RondaPageProps {
  initialSchedule: RondaScheduleEntry[];
  eligibleUsers: User[];
}

const DAYS_OF_WEEK = [
  { value: 1, name: "Senin" },
  { value: 2, name: "Selasa" },
  { value: 3, name: "Rabu" },
  { value: 4, name: "Kamis" },
  { value: 5, name: "Jumat" },
  { value: 6, name: "Sabtu" },
  { value: 7, name: "Minggu" },
];

export default function RondaPage({
  initialSchedule,
  eligibleUsers,
}: RondaPageProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Dialogue state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<{ value: number; name: string } | null>(null);

  // Group schedules by day of week
  const groupedSchedule = DAYS_OF_WEEK.reduce((acc, day) => {
    acc[day.value] = initialSchedule.filter((item) => item.dayOfWeek === day.value);
    return acc;
  }, {} as Record<number, RondaScheduleEntry[]>);

  // Total unique residents scheduled
  const scheduledUserIds = new Set(initialSchedule.map((s) => s.userId));
  const scheduledCount = scheduledUserIds.size;
  const totalWargaCount = eligibleUsers.length;

  const handleGenerate = () => {
    if (confirm("Apakah Anda yakin ingin men-generate ulang jadwal ronda secara otomatis? Jadwal saat ini akan dihapus.")) {
      startTransition(async () => {
        const res = await generateRondaSchedule();
        if (res.success) {
          toast.success(res.message);
          router.refresh();
        } else {
          toast.error(res.message);
        }
      });
    }
  };

  const handleRemove = (id: string, name: string) => {
    if (confirm(`Hapus ${name} dari jadwal ronda hari ini?`)) {
      startTransition(async () => {
        const res = await removeRondaEntry(id);
        if (res.success) {
          toast.success(res.message);
          router.refresh();
        } else {
          toast.error(res.message);
        }
      });
    }
  };

  const handleTriggerAdd = (dayValue: number, dayName: string) => {
    setSelectedDay({ value: dayValue, name: dayName });
    setDialogOpen(true);
  };

  const handleAdd = async (userId: string) => {
    if (!selectedDay) return;
    return await addRondaEntry(selectedDay.value, userId);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 pb-6 border-b md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Jadwal Ronda</h1>
          <p className="text-sm text-muted-foreground">
            Kelola pembagian regu ronda malam RT 04 secara mingguan.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleGenerate}
            disabled={isPending || totalWargaCount === 0}
            variant="default"
            className="shadow-xs bg-primary hover:bg-primary/90 text-primary-foreground font-medium animate-pulse-slow"
          >
            {isPending ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4 text-emerald-200" />
            )}
            Generate Jadwal Otomatis
          </Button>
        </div>
      </div>

      {/* Info Stats Bar */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <Card size="sm" className="bg-card">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Warga Terjadwal
              </p>
              <h3 className="text-xl font-bold">
                {scheduledCount} <span className="text-sm font-normal text-muted-foreground">/ {totalWargaCount} Warga</span>
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card size="sm" className="bg-card">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600">
              <CalendarDays className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Siklus Jadwal
              </p>
              <h3 className="text-xl font-bold text-amber-600">7 Hari Mingguan</h3>
            </div>
          </CardContent>
        </Card>

        <Card size="sm" className="bg-card">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Moon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Waktu Pelaksanaan
              </p>
              <h3 className="text-xl font-bold text-primary">22.00 - 04.00 WIB</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Grid */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {DAYS_OF_WEEK.map((day) => {
          const members = groupedSchedule[day.value] || [];

          return (
            <Card key={day.value} className="flex flex-col h-full bg-card hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="text-base font-bold">{day.name}</CardTitle>
                  <CardDescription className="text-xs">
                    Petugas Ronda Malam
                  </CardDescription>
                </div>
                <Badge variant={members.length > 0 ? "secondary" : "destructive"} className="text-xs font-semibold">
                  {members.length} Orang
                </Badge>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between gap-4">
                {/* Citizens List */}
                <div className="space-y-2">
                  {members.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-xl border-muted/50 text-muted-foreground">
                      <Shield className="h-6 w-6 stroke-muted-foreground/45 mb-1.5" />
                      <span className="text-xs italic">Belum ada petugas</span>
                    </div>
                  ) : (
                    <div className="divide-y divide-border border rounded-xl overflow-hidden bg-muted/20">
                      {members.map((member) => (
                        <div
                          key={member.id}
                          className="group flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                              {member.user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="overflow-hidden">
                              <span className="block text-xs font-bold truncate text-foreground">
                                {member.user.name}
                              </span>
                              <span className="flex items-center text-[10px] text-muted-foreground">
                                <Phone className="h-2.5 w-2.5 mr-0.5" />
                                {member.user.phoneNumber}
                              </span>
                            </div>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleRemove(member.id, member.user.name)}
                            disabled={isPending}
                            className="opacity-0 group-hover:opacity-100 focus:opacity-100 hover:text-destructive hover:bg-destructive/10 text-muted-foreground h-7 w-7 rounded-lg transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add Button at Bottom of Card */}
                <Button
                  onClick={() => handleTriggerAdd(day.value, day.name)}
                  variant="outline"
                  size="sm"
                  className="w-full mt-2 font-medium"
                >
                  <Plus className="mr-1.5 h-4 w-4" />
                  Tambah Petugas
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add dialog */}
      {selectedDay && (
        <AddRondaDialog
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          eligibleUsers={eligibleUsers}
          dayName={selectedDay.name}
          onAdd={handleAdd}
        />
      )}
    </div>
  );
}
