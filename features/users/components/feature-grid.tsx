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
import { cn } from "@/lib/utils"

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

interface FeatureGridProps {
  selected: string
  onSelect: (label: string) => void
}

export function FeatureGrid({ selected, onSelect }: FeatureGridProps) {
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
              onClick={() => onSelect(label)}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-lg p-2 transition-colors hover:bg-muted",
                selected === label && "bg-muted"
              )}
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
