"use client";

import { useRef, useEffect, useState } from "react";
import {
  User,
  ShieldCheck,
  CheckCircle2,
  ListTodo,
  FileText,
  CreditCard,
  Bell,
  Sparkles,
} from "lucide-react";

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

export function TwoViews() {
  const { ref, visible } = useReveal();

  return (
    <section id="modules" className="py-12 bg-background">
      <div className="container mx-auto max-w-275 px-6">
        {/* Header */}
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[.4px] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Fitur Portal
          </div>
          <h2
            className="font-fraunces font-semibold leading-[1.1] tracking-tight text-foreground"
            style={{ fontSize: "clamp(32px, 4.5vw, 50px)", letterSpacing: "-1px", marginBottom: "8px" }}
          >
            Dua Tampilan, <em className="italic text-primary">Satu Sistem Terpadu</em>
          </h2>
          <p
            className="text-[16px] leading-[1.6] text-muted-foreground truncate"
            title="SIWARGA memisahkan hak akses halaman untuk memudahkan pengurus dalam mengelola administrasi dan warga dalam memantau informasi."
          >
            SIWARGA memisahkan hak akses halaman untuk memudahkan pengurus dalam mengelola administrasi dan warga dalam memantau informasi.
          </p>
        </div>

        {/* Symmetrical Two Column Grid */}
        <div
          ref={ref}
          className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch transition-all duration-700 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          {/* Card 1: Panel Admin */}
          <div className="flex flex-col justify-between p-8 rounded-2xl border border-border bg-card shadow-[0_4px_12px_rgba(0,0,0,.02)] hover:border-primary/30 transition-all duration-300">
            <div>
              {/* Header Badge */}
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-serif text-lg font-bold text-foreground leading-tight">
                    Panel Admin (Pengurus RT)
                  </h3>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.5px]">
                    Hak Akses Pengurus
                  </span>
                </div>
              </div>

              {/* Minimal Mockup Stats */}
              <div className="p-4 rounded-xl bg-muted/50 border border-border/60 mb-6 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">
                    Total Warga Terdata
                  </span>
                  <span className="font-bold text-foreground">
                    456 Jiwa (114 KK)
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Okupansi Rumah</span>
                  <span className="font-bold text-foreground">
                    120 Unit Rumah
                  </span>
                </div>
                <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "92%" }} />
                </div>
              </div>

              {/* Bullet Features */}
              <ul className="space-y-3.5">
                {[
                  {
                    icon: ListTodo,
                    label: "Manajemen Data Kependudukan & KK secara rapi",
                  },
                  {
                    icon: FileText,
                    label: "Pencatatan kas masuk & pengeluaran iuran bulanan",
                  },
                  {
                    icon: Bell,
                    label:
                      "Penerbitan surat edaran & pengumuman digital ke warga",
                  },
                ].map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <item.icon className="h-4.5 w-4.5 text-primary mt-0.5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Card 2: Portal Warga */}
          <div className="flex flex-col justify-between p-8 rounded-2xl border border-border bg-card shadow-[0_4px_12px_rgba(0,0,0,.02)] hover:border-primary/30 transition-all duration-300">
            <div>
              {/* Header Badge */}
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <User className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-serif text-lg font-bold text-foreground leading-tight">
                    Portal Warga (Mandiri)
                  </h3>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.5px]">
                    Hak Akses Penduduk
                  </span>
                </div>
              </div>

              {/* Minimal Mockup Status */}
              <div className="p-4 rounded-xl bg-muted/50 border border-border/60 mb-6 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">
                    Tagihan Juni 2025
                  </span>
                  <div className="text-base font-bold text-foreground mt-0.5">
                    Rp 25.000
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 text-green-700 border border-green-150 px-3 py-1 text-xs font-bold">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Lunas
                </span>
              </div>

              {/* Bullet Features */}
              <ul className="space-y-3.5">
                {[
                  {
                    icon: CreditCard,
                    label: "Cek tagihan & riwayat iuran secara berkala",
                  },
                  {
                    icon: Bell,
                    label: "Membaca pengumuman penting & surat edaran RT",
                  },
                  {
                    icon: FileText,
                    label: "Mengirim aduan / aspirasi langsung ke pengurus",
                  },
                ].map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <item.icon className="h-4.5 w-4.5 text-indigo-600 mt-0.5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default TwoViews;
