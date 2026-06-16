"use client";

import { useEffect, useRef, useState } from "react";
import {
  Users,
  FileText,
  Download,
  TrendingUp,
  Info,
  DollarSign,
  Home,
  CheckCircle2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

const totalWarga = 456;
const occupiedRumah = 120;
const totalRumah = 130;
const tingkatLunas = 92;

const transactionHistory = [
  { date: "08 Jun 2025", desc: "Iuran Bulanan Warga (Juni)", type: "income", amount: 3250000, category: "Iuran" },
  { date: "05 Jun 2025", desc: "Pembayaran Insentif Keamanan / Satpam", type: "expense", amount: 1200000, category: "Keamanan" },
  { date: "03 Jun 2025", desc: "Biaya Kebersihan Lingkungan & Sampah", type: "expense", amount: 550000, category: "Kebersihan" },
  { date: "01 Jun 2025", desc: "Sewa Lapangan Badminton RT", type: "income", amount: 250000, category: "Fasilitas" },
];

const documents = [
  { name: "Laporan Keuangan Bulanan - Mei 2025", size: "1.4 MB", type: "PDF", date: "01 Jun 2025" },
  { name: "Laporan Keuangan Bulanan - April 2025", size: "1.2 MB", type: "PDF", date: "01 Mei 2025" },
];

export function DataReportsSection() {
  const [activeTab, setActiveTab] = useState<"warga" | "keuangan">("warga");
  const [downloadingDoc, setDownloadingDoc] = useState<string | null>(null);
  const { ref, visible } = useReveal();

  const handleDownload = (docName: string) => {
    setDownloadingDoc(docName);
    const promise = new Promise((resolve) => setTimeout(resolve, 1500));
    toast.promise(promise, {
      loading: `Menyiapkan unduhan ${docName}...`,
      success: () => { setDownloadingDoc(null); return `${docName} berhasil diunduh!`; },
      error: "Gagal mengunduh file.",
    });
  };

  return (
    <section
      id="data-laporan"
      className="relative py-8 md:py-12 overflow-hidden bg-primary-foreground text-foreground"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-35">
        <div className="absolute" style={{ top: "10%", right: "5%", width: "450px", height: "450px", borderRadius: "50%", background: "radial-gradient(circle, hsl(var(--primary)/.08) 0%, transparent 70%)" }} />
        <div className="absolute" style={{ bottom: "10%", left: "5%", width: "450px", height: "450px", borderRadius: "50%", background: "radial-gradient(circle, hsl(var(--primary)/.06) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)", backgroundSize: "45px 45px" }} />
      </div>

      <div className="container relative z-10 mx-auto max-w-275 px-4 sm:px-6">

        {/* Header — lebih kompak di mobile */}
        <div className="mb-5 md:mb-8 text-center max-w-3xl mx-auto">
          <h2
            className="font-fraunces font-semibold leading-[1.1] tracking-tight text-foreground"
            style={{ fontSize: "clamp(20px, 5vw, 42px)", letterSpacing: "-0.5px", marginBottom: "6px" }}
          >
            Data & <em className="italic text-primary">Laporan</em>
          </h2>
          <p className="text-xs md:text-[16px] leading-[1.5] text-muted-foreground">
            Akses data kependudukan dan realisasi keuangan warga sebagai wujud keterbukaan kepengurusan RT.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-4 md:mb-6">
          <div className="inline-flex rounded-xl bg-muted p-1 border border-border/50 gap-1">
            {[
              { id: "warga", label: "Data Warga", icon: Users },
              { id: "keuangan", label: "Data Keuangan", icon: DollarSign },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as "warga" | "keuangan")}
                  className={[
                    "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5",
                    "text-xs font-semibold transition-all duration-300",
                    activeTab === tab.id
                      ? "bg-card text-foreground shadow-sm border border-border"
                      : "text-muted-foreground hover:text-foreground hover:bg-card/50",
                  ].join(" ")}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div
          ref={ref}
          className={`transition-all duration-700 ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
        >

          {/* ── TAB 1: DATA WARGA ── */}
          {activeTab === "warga" && (
            <div className="grid grid-cols-2 gap-3 md:gap-5 max-w-[820px] mx-auto">

              {/* Total Penduduk */}
              <Card className="p-3.5 sm:p-5 md:p-6 border-border bg-card hover:border-primary/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 flex flex-col text-foreground rounded-2xl">
                {/* Icon + Label — row di semua ukuran */}
                <div className="flex items-center gap-2 mb-3 md:mb-4">
                  <div className="flex h-8 w-8 md:h-10 md:w-10 flex-shrink-0 items-center justify-center rounded-[9px] md:rounded-[11px] bg-primary/10 text-primary">
                    <Users className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                  <h3 className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-[0.7px] leading-tight">
                    Total<br className="sm:hidden" /> Penduduk
                  </h3>
                </div>
                {/* Angka */}
                <div className="flex items-baseline gap-1.5 mb-2 md:mb-3">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-bold font-fraunces text-foreground">
                    {totalWarga}
                  </span>
                  <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">
                    Jiwa
                  </span>
                </div>
                <p className="text-[10px] md:text-xs text-muted-foreground leading-relaxed">
                  Terdaftar dalam <span className="font-semibold text-foreground">114 KK</span> di lingkungan RT 04.
                </p>
              </Card>

              {/* Okupansi Hunian */}
              <Card className="p-3.5 sm:p-5 md:p-6 border-border bg-card hover:border-primary/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 flex flex-col text-foreground rounded-2xl">
                <div className="flex items-center gap-2 mb-3 md:mb-4">
                  <div className="flex h-8 w-8 md:h-10 md:w-10 flex-shrink-0 items-center justify-center rounded-[9px] md:rounded-[11px] bg-primary/10 text-primary">
                    <Home className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                  <h3 className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-[0.7px] leading-tight">
                    Okupansi<br className="sm:hidden" /> Hunian
                  </h3>
                </div>
                {/* Angka */}
                <div className="flex items-baseline gap-1 mb-2 md:mb-3">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-bold font-fraunces text-foreground">
                    {occupiedRumah}
                  </span>
                  <span className="text-base sm:text-xl md:text-2xl font-medium text-muted-foreground/50 font-fraunces">/</span>
                  <span className="text-base sm:text-xl md:text-2xl font-bold text-muted-foreground/75 font-fraunces">
                    {totalRumah}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${(occupiedRumah / totalRumah) * 100}%` }} />
                </div>
                <p className="text-[10px] md:text-xs text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground">92.3%</span> terhuni · 10 unit kosong/renovasi.
                </p>
              </Card>
            </div>
          )}

          {/* ── TAB 2: DATA KEUANGAN ── */}
          {activeTab === "keuangan" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-5 lg:gap-8 items-stretch">

              {/* Metric Cards — horizontal scroll di mobile */}
              <div className="lg:col-span-4">
                {/* Mobile: 3 kolom scroll; tablet+: stack vertikal */}
                <div className="flex gap-2.5 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:gap-4 snap-x snap-mandatory">

                  {/* Kas RT */}
                  <Card className="flex-shrink-0 w-[62vw] xs:w-56 sm:w-64 lg:w-auto snap-start p-3 sm:p-4 md:p-5 border-border bg-card hover:border-primary/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 text-foreground rounded-xl">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0">
                        <h3 className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-[0.7px] mb-1">
                          Kas RT Saat Ini
                        </h3>
                        <div className="text-lg sm:text-xl font-bold font-fraunces text-foreground">
                          Rp 34.250.000
                        </div>
                        <p className="text-[9px] sm:text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-1">
                          <TrendingUp className="h-3 w-3" />
                          +15.5% dari bulan lalu
                        </p>
                      </div>
                      <span className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/10 ml-2 flex-shrink-0">
                        <DollarSign className="h-4 w-4" />
                      </span>
                    </div>
                  </Card>

                  {/* Tingkat Lunas */}
                  <Card className="flex-shrink-0 w-[62vw] xs:w-56 sm:w-64 lg:w-auto snap-start p-3 sm:p-4 md:p-5 border-border bg-card hover:border-primary/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 text-foreground rounded-xl">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-[0.7px] mb-1">
                          Tingkat Lunas Iuran
                        </h3>
                        <div className="text-lg sm:text-xl font-bold font-fraunces text-foreground">
                          {tingkatLunas}%
                        </div>
                        <div className="h-1.5 w-full max-w-[100px] bg-muted rounded-full overflow-hidden mt-1.5">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${tingkatLunas}%` }} />
                        </div>
                        <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-1.5">
                          Pembayaran iuran bulan ini
                        </p>
                      </div>
                      <span className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/10 ml-2 flex-shrink-0">
                        <CheckCircle2 className="h-4 w-4" />
                      </span>
                    </div>
                  </Card>

                  {/* Pemasukan vs Pengeluaran */}
                  <Card className="flex-shrink-0 w-[62vw] xs:w-56 sm:w-64 lg:w-auto snap-start p-3 sm:p-4 md:p-5 border-border bg-card hover:border-primary/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 text-foreground rounded-xl">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-[0.7px] mb-1">
                          Pemasukan vs Pengeluaran
                        </h3>
                        <div className="text-xs font-semibold text-foreground mt-0.5">
                          <span className="text-emerald-600">+Rp 4.500.000</span>{" "}
                          <span className="text-muted-foreground text-[9px] sm:text-[10px] font-normal">Masuk</span>
                        </div>
                        <div className="text-xs font-semibold text-foreground">
                          <span className="text-rose-600">-Rp 1.750.000</span>{" "}
                          <span className="text-muted-foreground text-[9px] sm:text-[10px] font-normal">Keluar</span>
                        </div>
                        <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-1.5">
                          Periode: Juni 2025
                        </p>
                      </div>
                      <span className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/10 ml-2 flex-shrink-0">
                        <TrendingUp className="h-4 w-4" />
                      </span>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Buku Kas */}
              <div className="lg:col-span-8">
                <Card className="h-full p-3.5 sm:p-5 md:p-6 border-border bg-card hover:border-primary/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 flex flex-col text-foreground rounded-2xl">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.8px]">
                      Buku Kas Terbaru
                    </h3>
                    <Badge variant="outline" className="text-[10px] text-muted-foreground bg-muted border-border">
                      Juni 2025
                    </Badge>
                  </div>

                  <div className="overflow-x-auto -mx-1 px-1">
                    <table className="w-full min-w-[380px] text-left border-collapse text-[11px] sm:text-xs">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground font-semibold">
                          <th className="py-2 pr-2 sm:pr-3 whitespace-nowrap">Tanggal</th>
                          <th className="py-2 pr-2 sm:pr-3">Keterangan</th>
                          <th className="py-2 pr-2 sm:pr-3 whitespace-nowrap hidden sm:table-cell">Kategori</th>
                          <th className="py-2 text-right whitespace-nowrap">Jumlah</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {transactionHistory.map((t, idx) => (
                          <tr key={idx} className="hover:bg-muted/40 transition-colors duration-150">
                            <td className="py-2.5 pr-2 sm:pr-3 text-muted-foreground whitespace-nowrap">{t.date}</td>
                            <td className="py-2.5 pr-2 sm:pr-3 font-semibold text-foreground leading-snug">{t.desc}</td>
                            <td className="py-2.5 pr-2 sm:pr-3 hidden sm:table-cell">
                              <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-muted text-muted-foreground border border-border whitespace-nowrap">
                                {t.category}
                              </span>
                            </td>
                            <td className={[
                              "py-2.5 text-right font-bold whitespace-nowrap",
                              t.type === "income" ? "text-emerald-600" : "text-rose-600",
                            ].join(" ")}>
                              {t.type === "income" ? "+" : "-"}Rp {t.amount.toLocaleString("id-ID")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-3 sm:mt-5 pt-3 border-t border-border/60 text-[10px] text-muted-foreground flex items-start gap-1.5">
                    <Info className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                    <span>
                      Laporan keuangan lengkap diperbarui otomatis setiap terjadi transaksi oleh bendahara RT di panel admin.
                    </span>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* ── Download Area ── */}
        <div className="mt-7 md:mt-10 border-t border-border/60 pt-6 md:pt-10">
          <div className="mb-4 md:mb-6">
            <h3 className="font-fraunces font-bold text-lg sm:text-2xl text-foreground mb-1 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary flex-shrink-0" />
              Arsip Dokumen & Unduhan
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-[700px]">
              Laporan keuangan tertulis dapat diunduh dalam format PDF untuk transparansi menyeluruh.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
            {documents.map((doc, idx) => (
              <div
                key={idx}
                className="group flex items-center justify-between gap-3 p-3 sm:p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:bg-muted/30 transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,.02)]"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1 text-foreground">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors duration-300">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[12px] sm:text-[13px] font-bold text-foreground leading-snug group-hover:text-primary transition-colors duration-200 truncate">
                      {doc.name}
                    </h4>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0 text-[10px] text-muted-foreground">
                      <span className="font-bold">{doc.type}</span>
                      <span>·</span>
                      <span>{doc.size}</span>
                      <span>·</span>
                      <span>{doc.date}</span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={downloadingDoc === doc.name}
                  onClick={() => handleDownload(doc.name)}
                  className="rounded-lg h-8 px-3 text-[11px] font-semibold hover:bg-primary hover:text-primary-foreground border-primary/25 text-primary bg-transparent flex items-center gap-1 transition-all duration-300 flex-shrink-0"
                >
                  <Download className={`h-3 w-3 ${downloadingDoc === doc.name ? "animate-bounce" : ""}`} />
                  {downloadingDoc === doc.name ? "Mengunduh..." : "Unduh"}
                </Button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}