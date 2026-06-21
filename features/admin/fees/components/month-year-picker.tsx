"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

const MONTHS_FULL = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const currentYear = new Date().getFullYear();

interface MonthYearPickerProps {
  month: number;
  year: number;
  onNavigate: (month: number, year: number) => void;
}

export function MonthYearPicker({ month, year, onNavigate }: MonthYearPickerProps) {
  const [open, setOpen] = useState(false);
  const [browseYear, setBrowseYear] = useState(year);

  const goToPeriod = (m: number, y: number) => {
    setOpen(false);
    onNavigate(m, y);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="min-w-[200px] justify-start text-left font-normal"
        >
          <Calendar className="mr-2 size-4" />
          {MONTHS_FULL[month - 1]} {year}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="center">
        {/* ── Year navigation ──────────────────────────────────────── */}
        <div className="mb-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setBrowseYear(browseYear - 1)}
          >
            <ChevronLeft className="size-4" />
          </Button>

          <span className="text-sm font-semibold">{browseYear}</span>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setBrowseYear(browseYear + 1)}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>

        {/* ── Month grid ───────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2">
          {MONTHS_SHORT.map((label, i) => {
            const m = i + 1;
            const isSelected = m === month && browseYear === year;
            const isCurrent =
              m === new Date().getMonth() + 1 &&
              browseYear === currentYear;

            return (
              <Button
                key={i}
                variant={isSelected ? "default" : "ghost"}
                className={`h-9 w-full text-sm font-normal ${
                  !isSelected && isCurrent
                    ? "ring-1 ring-inset ring-primary/30"
                    : ""
                }`}
                onClick={() => goToPeriod(m, browseYear)}
              >
                {label}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
