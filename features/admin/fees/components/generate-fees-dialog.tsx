"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, FileSpreadsheet, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { generateDuesAction } from "../actions/generate-dues";

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const currentYear = new Date().getFullYear();

export function GenerateFeesDialog() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialMonth = searchParams.get("month")
    ? String(searchParams.get("month"))
    : String(new Date().getMonth() + 1);
  const initialYear = searchParams.get("year")
    ? String(searchParams.get("year"))
    : String(currentYear);

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [selectedYear, setSelectedYear] = useState(initialYear);

  const handleGenerate = async () => {
    setIsSubmitting(true);
    const toastId = toast.loading("Membuat tagihan...");

    const result = await generateDuesAction({
      month: Number(selectedMonth),
      year: Number(selectedYear),
    });

    if (result.success) {
      toast.success(result.message, { id: toastId });
      setOpen(false);
      router.push(
        `/admin/fees?month=${selectedMonth}&year=${selectedYear}`,
      );
    } else {
      toast.error(result.message, { id: toastId });
    }

    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <FileSpreadsheet className="mr-2" />
          Generate Tagihan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Tagihan Iuran Bulanan</DialogTitle>
          <DialogDescription>
            Pilih periode dan konfirmasi pembuatan tagihan untuk seluruh rumah.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Bulan</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((month, i) => (
                    <SelectItem key={i} value={String(i + 1)}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tahun</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[currentYear - 1, currentYear, currentYear + 1].map(
                    (year) => (
                      <SelectItem key={year} value={String(year)}>
                        {year}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/30 p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tarif Iuran</span>
              <span className="font-medium">Rp 25.000 / rumah</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-medium">Catatan</span>
              <span className="text-muted-foreground">
                Rumah dengan tagihan yang sudah ada akan dilewatkan
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <p>
              Generate akan melewati rumah yang sudah memiliki tagihan untuk
              periode{" "}
              <strong>
                {MONTHS[Number(selectedMonth) - 1]} {selectedYear}
              </strong>
              .
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Batal
          </Button>
          <Button onClick={handleGenerate} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            {isSubmitting ? "Memproses..." : "Generate Tagihan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
