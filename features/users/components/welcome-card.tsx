"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  AlertTriangle,
  CalendarClockIcon,
  CheckCircle2,
  ClockAlert,
  Megaphone,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"

interface CurrentMonthDue {
  status: "LUNAS" | "TERTUNDA" | "BELUM_DIBUAT"
  amount: number
  dueDate: string
}

interface OverdueDue {
  id: string
  amount: number
  label: string
}

interface WelcomeCardProps {
  name: string
  currentMonthDue: CurrentMonthDue | null
  overdueDues: OverdueDue[]
  recentAnnouncementCount: number
  totalResidents: number
  currentMonthName: string
}

export default function WelcomeCard({
  name,
  currentMonthDue,
  overdueDues,
  recentAnnouncementCount,
  totalResidents,
  currentMonthName,
}: WelcomeCardProps) {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [paused, setPaused] = useState(false)

  const totalOverdue = overdueDues.reduce((sum, d) => sum + d.amount, 0)
  const isLunas = currentMonthDue?.status === "LUNAS"

  const slides = [
    {
      title: `Halo, ${name}!`,
      description:
        "Pantau iuran, pengumuman, dan jadwal kegiatan RT dengan lebih mudah melalui SiWarga.",
      bgImage: "/images/banner/welcome-banner.png",
      icon: <></>,
    },
    {
      title: currentMonthDue === null ? "Status Iuran" : `Iuran ${currentMonthName}`,
      description:
        currentMonthDue === null
          ? "Kamu belum terdaftar di rumah manapun."
          : `${isLunas ? "Lunas" : currentMonthDue.status === "TERTUNDA" ? "Tertunda" : "Belum Dibuat"} — Rp ${currentMonthDue.amount.toLocaleString("id-ID")} · Jatuh tempo ${currentMonthDue.dueDate}`,
      bgImage: "/images/banner/iuran-banner.png",
      icon: <></>,
    },
    {
      title: overdueDues.length > 0 ? "Tagihan Tertunggak" : "Iuran Lancar",
      description:
        overdueDues.length > 0
          ? `Kamu memiliki ${overdueDues.length} bulan tagihan yang belum dibayar — total ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(totalOverdue)}`
          : "Semua iuran telah dibayar tepat waktu.",
      bgImage: "/images/banner/tunggakan-banner.png",
      icon: <></>,
    },
    {
      title: "Warga Terdaftar",
      description: `Total ${totalResidents} warga terdaftar di lingkungan RT.`,
      bgImage: "/images/banner/warga-banner.png",
      icon: <></>,
    },
    {
      title: "Pengumuman",
      description:
        recentAnnouncementCount > 0
          ? `${recentAnnouncementCount} pengumuman baru dalam 7 hari terakhir.`
          : "Tidak ada pengumuman baru.",
      bgImage: "/images/banner/pengumuman-banner.png",
      icon: <></>,
    },
  ]

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 4000)
  }, [slides.length])

  useEffect(() => {
    if (!paused) startTimer()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [paused, startTimer])

  function goTo(index: number) {
    setCurrent(index)
    startTimer()
  }

  return (
    <section
      className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#E8F5EC] to-[#F5FAF6] shadow-sm"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative overflow-hidden">
        <div
          className="flex items-stretch transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className="relative w-full flex-shrink-0"
            >
              <img
                src={slide.bgImage}
                alt=""
                className="absolute inset-0 size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
              <div className="relative flex items-end justify-between gap-4 p-5 pb-12">
                <div className="min-w-0 flex-1 space-y-2">
                  <h2 className="text-xl font-extrabold leading-tight text-white drop-shadow-sm">
                    {slide.title}
                  </h2>
                  <p className="max-w-64 text-[13px] leading-relaxed text-white/90 drop-shadow-sm">
                    {slide.description}
                  </p>
                </div>
                <div className="mt-2 shrink-0">{slide.icon}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute inset-x-0 bottom-3 mx-auto flex w-fit gap-1.5 rounded-full bg-white/60 px-4 py-2 backdrop-blur-sm">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              className={cn(
                "size-2 rounded-full transition-all duration-300",
                current === i ? "w-5 bg-white" : "bg-white/40",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
