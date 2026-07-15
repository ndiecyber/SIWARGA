"use client";

import { useEffect, useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import Image from "next/image";

export function AboutSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const checklists = [
    "Akses informasi penting dengan cepat",
    "Urus surat tidak perlu datang ke kantor",
    "Pantau kegiatan dan agenda lingkungan",
    "Transparansi keuangan RT RW",
    "Partisipasi aktif untuk lingkungan yang lebih baik",
  ];

  return (
    <section
      id="tentang-kami"
      className="relative overflow-hidden bg-background py-16 md:py-24 border-t border-border/40"
    >
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.2]">
        <div className="absolute top-1/2 right-10 h-[350px] w-[350px] rounded-full bg-emerald-100/40 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto max-w-275 px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">

          {/* LEFT SIDE: Text Content */}
          <div className="flex flex-col items-start lg:col-span-6 space-y-6 order-2 lg:order-1">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/60 border border-emerald-200/50 px-4 py-1.5 text-emerald-800 font-semibold text-xs uppercase tracking-wider">
              Untuk Warga, Oleh Warga
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight text-foreground tracking-tight max-w-xl">
              Bersama Membangun Lingkungan yang Lebih Baik
            </h2>

            {/* Paragraph */}
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-lg">
              Sistem Informasi RT RW hadir untuk memperkuat komunikasi, transparansi, dan kebersamaan di lingkungan Anda.
            </p>

            {/* Checklist */}
            <ul className="space-y-3.5 pt-2">
              {checklists.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm sm:text-base font-medium text-foreground/80">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-primary mt-0.5">
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            {/* Button */}
            <div className="pt-4">
              <button
                onClick={() => {
                  const el = document.getElementById("layanan");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center justify-center bg-primary hover:bg-primary/95 text-white font-medium text-base px-6 py-3 rounded-xl shadow-md hover:-translate-y-0.5 transition-all duration-300 gap-2"
              >
                Pelajari Lebih Lanjut
                <ArrowRight className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>

          {/* RIGHT SIDE: Vector Illustration */}
          <div className="relative flex justify-center lg:col-span-6 w-full order-1 lg:order-2">
            <div className="relative w-full max-w-[480px] h-[260px] sm:h-[320px] md:h-[380px] lg:h-[480px]">
              <Image
                src="/images/Ilustrasi.png"
                alt="Warga Berkolaborasi Membangun Lingkungan"
                fill
                priority
                className="object-contain hover:scale-[1.01] transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 500px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}