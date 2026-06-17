"use client";

import { useState, useEffect } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import SignIn from "@/features/auth/pages/sign-in";

const avatarInitials = ["BS", "SR", "AF", "DA"];

export function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes float1 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(5px); }
        }
        .animate-float1 { animation: float1 3s ease-in-out infinite; }
        .animate-float2 { animation: float2 3.5s ease-in-out infinite; }
        .animate-blink  { animation: blink 1.8s infinite; }

        /* ── MOBILE (≤ 860px) ── */
        /* Mobile: visual tetap di bawah, tapi lebih compact & rapi */
        @media (max-width: 860px) {
          #hero {
            padding: 80px 0 48px !important;
          }
          .hero-inner {
            grid-template-columns: 1fr !important;
            text-align: center;
            gap: 24px !important;
          }
          /* Tidak perlu order — biarkan urutan asli (teks dulu, visual bawah) */

          .hero-desc   { margin-left: auto !important; margin-right: auto !important; }
          .hero-actions { justify-content: center !important; }
          .hero-trust  { justify-content: center !important; }

          /* Float cards masuk ke dalam boundary visual agar tidak terpotong */
          .hero-float-1 {
            top: -10px !important;
            right: 8px !important;   /* dari -20px → dalam layar */
          }
          .hero-float-2 {
            bottom: 16px !important;
            left: 8px !important;    /* dari -30px → dalam layar */
          }

          /* Ukuran float card lebih kecil */
          .hero-float-1,
          .hero-float-2 {
            padding: 8px 12px !important;
            border-radius: 12px !important;
          }
          .hero-float-1 .float-val { font-size: 14px !important; }
          .hero-float-1 .float-lbl { font-size: 9px  !important; }
          .hero-float-2 .float-val { font-size: 12px !important; }
          .hero-float-2 .float-lbl { font-size: 9px  !important; }

          /* Phone mockup lebih kecil agar muat */
          .hero-phone-wrap {
            max-width: 220px !important;
          }
        }
      `}</style>

      <section
        id="hero"
        className="relative overflow-hidden"
        style={{ padding: "130px 0 80px" }}
      >
        {/* ── background decoration ── */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div
            className="absolute"
            style={{
              top: "-120px",
              right: "-80px",
              width: "500px",
              height: "500px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, hsl(var(--primary)/.08) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute"
            style={{
              bottom: "-60px",
              left: "-100px",
              width: "400px",
              height: "400px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(201,151,58,.06) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(hsl(var(--primary)/.04) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)/.04) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
              maskImage:
                "radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 100%)",
            }}
          />
        </div>

        <div className="container relative z-10 mx-auto max-w-275 px-6">
          <div
            className="hero-inner"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "60px",
              alignItems: "center",
            }}
          >
            {/* ── TEXT SIDE ── */}
            <div
              className={`hero-text transition-all duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
                <span className="animate-blink h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="text-xs font-semibold text-primary">
                  Sistem Informasi Warga RT 04 RW 07 Perumahan Arjamukti
                </span>
              </div>

              <h1
                className="font-fraunces font-bold leading-[1.1] tracking-tight text-foreground"
                style={{
                  fontSize: "clamp(24px, 5vw, 46px)",
                  letterSpacing: "-1px",
                  marginBottom: "16px",
                }}
              >
                Satu Platform untuk
                <br />
                <em className="italic text-primary">Warga & Pengurus RT</em>
              </h1>

              <p
                className="hero-desc text-[14px] md:text-[17px] leading-[1.7] text-muted-foreground"
                style={{ marginBottom: "28px", maxWidth: "480px" }}
              >
                Platform digital terpadu untuk administrasi RT — iuran, data
                warga, pengumuman, dan laporan keuangan dalam satu genggaman.
              </p>

              <div
                className="hero-actions flex flex-wrap"
                style={{ gap: "12px" }}
              >
                <SignIn>
                  <Button size="lg">
                    <ArrowRight className="h-4 w-4" />
                    Masuk sebagai Warga
                  </Button>
                </SignIn>
              </div>

              <div
                className="hero-trust flex items-center"
                style={{ marginTop: "20px", gap: "10px" }}
              >
                <div className="flex">
                  {avatarInitials.map((init, i) => (
                    <span
                      key={i}
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-primary text-[11px] font-bold text-primary-foreground"
                      style={{ marginLeft: i === 0 ? 0 : -8 }}
                    >
                      {init}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong className="font-semibold text-foreground">
                    120+ warga
                  </strong>{" "}
                  telah bergabung
                </p>
              </div>
            </div>

            {/* ── VISUAL SIDE ── */}
            <div
              className={`hero-visual relative transition-all duration-700 delay-200 ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
            >
              {/* Float top-right */}
              <div
                className="hero-float-1 animate-float1 absolute z-[3] rounded-2xl border border-border bg-card px-4 py-2.5 shadow-[0_8px_24px_rgba(0,0,0,.08)]"
                style={{ top: "-20px", right: "-20px" }}
              >
                <div
                  className="float-val text-xl font-bold text-foreground"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  Rp2,75 jt
                </div>
                <div className="float-lbl text-[10px] text-muted-foreground">
                  Iuran terkumpul
                </div>
              </div>

              {/* Phone mockup */}
              <div className="hero-phone-wrap relative z-[2] mx-auto max-w-[280px] overflow-hidden rounded-[28px] border border-border bg-card shadow-[0_24px_60px_hsl(var(--primary)/.12),0_4px_12px_rgba(0,0,0,.06)]">
                <div className="flex h-7 items-center justify-center bg-foreground">
                  <div
                    className="h-3.5 w-20 rounded-full"
                    style={{ background: "#1a2a28" }}
                  />
                </div>

                <div className="p-3.5" style={{ background: "#f0f7f6" }}>
                  {/* Header card */}
                  <div className="mb-3 rounded-2xl bg-primary p-3.5 text-primary-foreground">
                    <div className="mb-0.5 text-[10px] opacity-70">
                      Selamat datang,
                    </div>
                    <div
                      className="text-[15px] font-bold"
                      style={{ fontFamily: "var(--font-fraunces)" }}
                    >
                      Randi Rizal
                    </div>
                    <div className="mt-2.5 flex items-center justify-between rounded-[9px] bg-primary-foreground/15 px-2.5 py-2">
                      <div>
                        <div className="text-[9px] opacity-70">
                          Iuran Juni 2025
                        </div>
                        <div className="text-[13px] font-bold">Rp 25.000</div>
                      </div>
                      <span className="rounded-[10px] bg-green-100 px-2 py-0.5 text-[9px] font-bold text-green-700">
                        ✓ Lunas
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="mb-2.5 grid grid-cols-3 gap-1.5">
                    {[
                      { val: "15", lbl: "Rumah", cls: "text-foreground" },
                      { val: "12", lbl: "Lunas", cls: "text-green-600" },
                      { val: "2", lbl: "Nunggak", cls: "text-red-600" },
                    ].map(({ val, lbl, cls }) => (
                      <div
                        key={lbl}
                        className="rounded-[9px] bg-card px-1.5 py-2 text-center"
                      >
                        <div className={`text-[15px] font-bold ${cls}`}>
                          {val}
                        </div>
                        <div className="mt-0.5 text-[8px] text-muted-foreground">
                          {lbl}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Announcements */}
                  <div className="flex flex-col gap-1.5">
                    {[
                      {
                        dot: "bg-green-600",
                        text: "Kerja Bakti 15 Jun",
                        tagClass: "bg-green-100 text-green-700",
                        tag: "Kegiatan",
                      },
                      {
                        dot: "bg-red-600",
                        text: "Tagihan Iuran Juni",
                        tagClass: "bg-red-100 text-red-700",
                        tag: "Penting",
                      },
                      {
                        dot: "bg-primary",
                        text: "Rapat RT 20 Jun",
                        tagClass: "bg-primary/10 text-primary",
                        tag: "Info",
                      },
                    ].map((item) => (
                      <div
                        key={item.text}
                        className="flex items-center gap-2 rounded-[9px] bg-card px-2.5 py-2"
                      >
                        <div
                          className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${item.dot}`}
                        />
                        <span className="flex-1 text-[10px] font-medium text-foreground">
                          {item.text}
                        </span>
                        <span
                          className={`rounded-[6px] px-1.5 py-0.5 text-[8px] font-bold ${item.tagClass}`}
                        >
                          {item.tag}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Float bottom-left */}
              <div
                className="hero-float-2 animate-float2 absolute z-[3] rounded-2xl bg-primary px-3.5 py-2.5 text-primary-foreground shadow-[0_8px_24px_hsl(var(--primary)/.25)]"
                style={{ bottom: "30px", left: "-30px" }}
              >
                <div className="float-val flex items-center gap-1.5 text-base font-bold">
                  <CheckCircle className="h-4 w-4" strokeWidth={2.5} />
                  87% Lunas
                </div>
                <div className="float-lbl mt-0.5 text-[10px] opacity-75">
                  Iuran bulan ini
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
