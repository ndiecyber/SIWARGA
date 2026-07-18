"use client"

import {
  Banknote,
  CalendarDays,
  ClipboardList,
  FilePenLine,
  FileText,
  Megaphone,
  MoreHorizontal,
  Users,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FeatureItem {
  label: string
  Icon: LucideIcon
}

const features: FeatureItem[] = [
  { label: "Iuran Warga", Icon: FilePenLine },
  { label: "Pengumuman", Icon: Megaphone },
  { label: "Surat Menyurat", Icon: FileText },
  { label: "Layanan Warga", Icon: Users },
  { label: "Kegiatan", Icon: CalendarDays },
  { label: "Keuangan", Icon: Banknote },
  { label: "Agenda", Icon: ClipboardList },
  { label: "Lainnya", Icon: MoreHorizontal },
]

export function FeatureGrid() {
  return (
    <Card className="shadow-md">
      <CardHeader className="border-b">
        <CardTitle>Fitur Utama</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4">
          {features.map(({ label, Icon }) => (
            <button
              key={label}
              type="button"
              className="flex flex-col items-center gap-1.5 rounded-lg p-2 transition-colors hover:bg-muted"
            >
              <div className="flex size-12 items-center justify-center rounded-full bg-green-50 text-green-600">
                <Icon size={24} />
              </div>
              <span className="text-xs text-gray-900">{label}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
