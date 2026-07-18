import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

type WelcomeCardProps = {
  name: string
}

export default function WelcomeCard(props: WelcomeCardProps) {
  return (
    <section className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#E8F5EC] to-[#F5FAF6] p-5 shadow-sm">
      <div className="absolute -right-8 -top-8 size-32 rounded-full bg-white/40" />
      <div className="absolute -bottom-12 -right-4 size-40 rounded-full bg-white/25" />
      <div className="absolute -left-4 top-12 size-20 rounded-full bg-white/20" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-xs font-semibold tracking-wide text-[#1B6B3A]/80">
            Selamat Datang
          </p>

          <h2 className="text-xl font-extrabold leading-tight text-[#1B6B3A]">
            Halo, {props.name}!
          </h2>

          <p className="max-w-64 text-[13px] leading-relaxed text-[#6B7280]">
            Pantau iuran, pengumuman, dan jadwal kegiatan RT dengan lebih mudah
            melalui SiWarga.
          </p>
        </div>

        <div className="mt-2 shrink-0">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <rect x="10" y="30" width="60" height="45" rx="6" fill="#2E8B4F" opacity="0.15" />
            <rect x="16" y="36" width="48" height="33" rx="4" fill="#2E8B4F" opacity="0.25" />
            <path d="M40 12L12 36h8v33h16V52h8v17h16V36h8L40 12z" fill="#1B6B3A" opacity="0.35" />
            <rect x="28" y="44" width="24" height="16" rx="3" fill="#1B6B3A" opacity="0.2" />
          </svg>
        </div>
      </div>
    </section>
  )
}
