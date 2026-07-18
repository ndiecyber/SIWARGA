"use client"

import {
  CalendarDays,
  Home,
  Image,
  Info,
  Megaphone,
  ReceiptText,
  User,
  Wallet,
} from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"
import { PaymentDrawer } from "./payment-drawer"

interface FeatureLink {
  label: string
  href: string
  Icon: ReactNode
}

interface FeaturePayment {
  label: string
  Icon: ReactNode
  isPayment: true
}

type FeatureItem = FeatureLink | FeaturePayment

const features: FeatureItem[] = [
  { label: "Iuran", href: "/iuran", Icon: <ReceiptText size={22} strokeWidth={1.8} /> },
  { label: "Pengumuman", href: "/pengumuman", Icon: <Megaphone size={22} strokeWidth={1.8} /> },
  { label: "Piket", href: "/piket", Icon: <CalendarDays size={22} strokeWidth={1.8} /> },
  { label: "Profil", href: "/profile", Icon: <User size={22} strokeWidth={1.8} /> },
  { label: "Bayar", Icon: <Wallet size={22} strokeWidth={1.8} />, isPayment: true },
  { label: "Info RT", href: "/pengumuman", Icon: <Info size={22} strokeWidth={1.8} /> },
  { label: "Galeri", href: "/", Icon: <Image size={22} strokeWidth={1.8} /> },
  { label: "Pengurus", href: "/", Icon: <Home size={22} strokeWidth={1.8} /> },
]

const iconWrapper = (icon: ReactNode) => (
  <div className="grid size-12 place-items-center rounded-2xl bg-[#E8F5EC] text-[#1B6B3A]">
    {icon}
  </div>
)

export function FeatureGrid() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {features.map((item) => {
        if ("isPayment" in item) {
          return (
            <PaymentDrawer key={item.label}>
              <button
                type="button"
                className="flex cursor-pointer flex-col items-center gap-1.5 border-0 bg-transparent p-0 outline-none"
              >
                {iconWrapper(item.Icon)}
                <span className="text-center text-[11px] font-semibold leading-tight text-[#111827]">
                  {item.label}
                </span>
              </button>
            </PaymentDrawer>
          )
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-col items-center gap-1.5 no-underline"
          >
            {iconWrapper(item.Icon)}
            <span className="text-center text-[11px] font-semibold leading-tight text-[#111827]">
              {item.label}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
