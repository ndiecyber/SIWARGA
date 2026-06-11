"use client";

import { useEffect, useRef, useState } from "react";
import {
  Users,
  FileText,
  Download,
  TrendingUp,
  ArrowDownRight,
  ArrowUpRight,
  Info,
  DollarSign,
  PieChart,
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

// Mock Data matching About Section
const totalWarga = 456;
const totalRumah = 120;
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
      success: () => {
        setDownloadingDoc(null);
        return `${docName} berhasil diunduh!`;
      },
      error: "Gagal mengunduh file.",
    });
  };

  return (
    <section id="data-laporan" className="relative py-[96px] overflow-hidden bg-white text-foreground">
      {/* Subtle Background Pattern & Lights */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-35">
        <div
          className="absolute"
          style={{
            top: "10%",
            right: "5%",
            width: "450px",
            height: "450px",
            borderRadius: "50%",
            background: "radial-gradient(circle, hsl(var(--primary)/.08) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: "10%",
            left: "5%",
            width: "450px",
            height: "450px",
            borderRadius: "50%",
            background: "radial-gradient(circle, hsl(var(--primary)/.06) 0%, transparent 70%)",
          }}
        />
        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)",
            backgroundSize: "45px 45px",
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto max-w-[1100px] px-6">
        {/* Header */}
        <div className="mb-14 text-center">
          <Badge className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.8px] text-primary">
            <PieChart className="h-3.5 w-3.5" />
            Data & Laporan
          </Badge>
          <h2
            className="font-serif font-bold leading-[1.15] mb-6 text-foreground"
            style={{
              fontSize: "clamp(34px, 4.5vw, 50px)",
              letterSpacing: "-1px",
            }}
          >
            Transparansi Informasi &
            <br />
            <span className="text-primary">Realisasi Kinerja RT</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[580px] text-[15px] leading-[1.7] text-muted-foreground">
            Akses data kependudukan secara umum serta realisasi keuangan warga sebagai wujud keterbukaan kepengurusan RT.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-xl bg-muted p-1.5 border border-border/50 backdrop-blur-md">
            {[
              { id: "warga", label: "Data Warga", icon: Users },
              { id: "keuangan", label: "Data Keuangan", icon: DollarSign },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-card text-foreground shadow-sm border border-border"
                      : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section Contents */}
        <div
          ref={ref}
          className={`transition-all duration-700 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          {/* TAB 1: DATA WARGA (Simplified 2-card layout) */}
          {activeTab === "warga" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-[840px] mx-auto">
              {/* Total Penduduk Card */}
              <Card className="p-8 border-border bg-card hover:border-primary/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 flex flex-col justify-between text-foreground rounded-2xl">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-[13px] bg-primary/10 text-primary mb-6">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-[0.8px] mb-3">Total Penduduk</h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-5xl font-bold font-serif text-foreground">{totalWarga}</span>
                    <span className="text-sm font-medium text-muted-foreground">Jiwa Terdaftar</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Jumlah penduduk terdata resmi di lingkungan RT 04 yang terbagi dalam 114 Kepala Keluarga (KK).
                  </p>
                </div>
              </Card>

              {/* Hunian Wilayah Card */}
              <Card className="p-8 border-border bg-card hover:border-primary/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 flex flex-col items-center justify-center text-center text-foreground rounded-2xl">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-[0.8px] mb-6 self-start">Okupansi Hunian</h3>
                
                <div className="relative flex items-center justify-center mb-6">
                  <svg className="w-44 h-44 drop-shadow-md rotate-[-90deg]" viewBox="0 0 36 36">
                    {/* Empty Units - Background */}
                    <circle
                      className="text-muted/20"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      fill="none"
                      cx="18"
                      cy="18"
                      r="15.915"
                    />
                    {/* Occupied Units - Foreground (92.3% of 130 total) */}
                    <circle
                      className="text-primary transition-all duration-700 ease-out"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeDasharray="92.3 7.7"
                      strokeDashoffset="0"
                      strokeLinecap="round"
                      fill="none"
                      cx="18"
                      cy="18"
                      r="15.915"
                    />
                  </svg>
                  
                  {/* Inner Label */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-foreground font-serif">{totalRumah}</span>
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-[0.5px]">Unit Rumah</span>
                  </div>
                </div>

                <div className="w-full space-y-2.5 mt-2">
                  <div className="flex items-center justify-between text-xs border-b border-border pb-2">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-primary" />
                      <span className="font-semibold text-foreground/90">Rumah Terisi (Dihuni)</span>
                    </div>
                    <span className="font-bold text-foreground">120 Unit (92.3%)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-muted" />
                      <span className="font-semibold text-muted-foreground">Rumah Kosong / Renovasi</span>
                    </div>
                    <span className="font-bold text-muted-foreground">10 Unit (7.7%)</span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* TAB 2: DATA KEUANGAN */}
          {activeTab === "keuangan" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Financial Metrics Cards */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                <Card className="p-6 border-border bg-card hover:border-primary/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 text-foreground rounded-2xl">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.8px] mb-2">Kas RT Saat Ini</h3>
                      <div className="text-2xl font-bold font-serif text-foreground">Rp 34.250.000</div>
                      <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-2">
                        <TrendingUp className="h-3 w-3" />
                        +15.5% dari bulan lalu
                      </p>
                    </div>
                    <span className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/10 flex items-center justify-center">
                      <DollarSign className="h-5 w-5" />
                    </span>
                  </div>
                </Card>

                {/* Tingkat Lunas 92% - matching About Section */}
                <Card className="p-6 border-border bg-card hover:border-primary/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 text-foreground rounded-2xl">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.8px] mb-2">Tingkat Lunas Iuran</h3>
                      <div className="text-2xl font-bold font-serif text-foreground">{tingkatLunas}%</div>
                      <div className="h-1.5 w-32 bg-muted rounded-full overflow-hidden mt-2">
                        <div className="h-full bg-primary" style={{ width: `${tingkatLunas}%` }} />
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-2">
                        Persentase pembayaran iuran warga bulan ini
                      </p>
                    </div>
                    <span className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/10 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5" />
                    </span>
                  </div>
                </Card>

                <Card className="p-6 border-border bg-card hover:border-primary/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 text-foreground rounded-2xl">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.8px] mb-2">Pemasukan vs Pengeluaran</h3>
                      <div className="text-sm font-semibold text-foreground mt-1">
                        <span className="text-emerald-600">+Rp 4.500.000</span> <span className="text-muted-foreground text-xs font-normal">Pemasukan</span>
                      </div>
                      <div className="text-sm font-semibold text-foreground">
                        <span className="text-rose-600">-Rp 1.750.000</span> <span className="text-muted-foreground text-xs font-normal">Pengeluaran</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-2">
                        Periode berjalan: Juni 2025
                      </p>
                    </div>
                    <span className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/10 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5" />
                    </span>
                  </div>
                </Card>
              </div>

              {/* Transactions Ledger */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                <Card className="flex-1 p-6 border-border bg-card hover:border-primary/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 flex flex-col justify-between text-foreground rounded-2xl">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-[0.8px]">Buku Kas Terbaru</h3>
                      <Badge variant="outline" className="text-[10px] text-muted-foreground bg-muted border-border">Juni 2025</Badge>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-border text-muted-foreground font-semibold">
                            <th className="py-2.5">Tanggal</th>
                            <th className="py-2.5">Keterangan</th>
                            <th className="py-2.5">Kategori</th>
                            <th className="py-2.5 text-right">Jumlah</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {transactionHistory.map((t, idx) => (
                            <tr key={idx} className="hover:bg-muted/40 transition-colors duration-150">
                              <td className="py-3 text-muted-foreground">{t.date}</td>
                              <td className="py-3 font-semibold text-foreground">{t.desc}</td>
                              <td className="py-3">
                                <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold bg-muted text-muted-foreground border border-border`}>
                                  {t.category}
                                </span>
                              </td>
                              <td className={`py-3 text-right font-bold ${
                                t.type === "income" ? "text-emerald-600" : "text-rose-600"
                              }`}>
                                {t.type === "income" ? "+" : "-"}Rp {t.amount.toLocaleString("id-ID")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/60 text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <Info className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    <span>Laporan keuangan lengkap diperbarui otomatis setiap terjadi transaksi oleh bendahara RT di panel admin.</span>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* Download Reports Area */}
        <div className="mt-20 border-t border-border/60 pt-16">
          <div className="max-w-[700px] mb-10">
            <h3 className="font-serif font-bold text-2xl text-foreground mb-2 flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Arsip Dokumen & Unduhan Laporan
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Dokumen administrasi penting dan laporan keuangan tertulis dapat diunduh oleh warga secara bebas dalam format PDF untuk transparansi menyeluruh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {documents.map((doc, idx) => (
              <div
                key={idx}
                className="group flex items-center justify-between p-4.5 rounded-xl border border-border bg-card hover:border-primary/30 hover:bg-muted/30 transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,.02)]"
              >
                <div className="flex items-start gap-3.5 max-w-[75%] text-foreground">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors duration-300">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-[13.5px] font-bold text-foreground leading-snug group-hover:text-primary transition-colors duration-200 truncate">
                      {doc.name}
                    </h4>
                    <div className="mt-1 flex items-center gap-2.5 text-[10px] text-muted-foreground">
                      <span className="font-bold">{doc.type}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                      <span>•</span>
                      <span>Diunggah: {doc.date}</span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={downloadingDoc === doc.name}
                  onClick={() => handleDownload(doc.name)}
                  className="rounded-lg h-9 text-xs font-semibold hover:bg-primary hover:text-primary-foreground border-primary/25 text-primary bg-transparent flex items-center gap-1.5 transition-all duration-300"
                >
                  <Download className={`h-3.5 w-3.5 ${downloadingDoc === doc.name ? "animate-bounce" : ""}`} />
                  <span>{downloadingDoc === doc.name ? "Mengunduh" : "Unduh"}</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
