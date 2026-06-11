"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  LayoutGrid,
  ListOrdered,
  LogIn,
  UserPlus,
} from "lucide-react";
import React from "react";

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

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Daftar Akun",
    subtitle: "Registrasi",
    description:
      "Warga mendaftar dengan NIK dan nomor rumah. Admin verifikasi dan aktifkan akun.",
  },
  {
    number: "02",
    icon: LogIn,
    title: "Masuk ke Sistem",
    subtitle: "Login akun",
    description:
      "Login dengan username dan password. Warga dan admin memiliki tampilan berbeda.",
  },
  {
    number: "03",
    icon: LayoutGrid,
    title: "Akses Dashboard",
    subtitle: "Pantau informasi",
    description:
      "Lihat status iuran, pengumuman terbaru, dan informasi RT kapanpun dibutuhkan.",
  },
  {
    number: "04",
    icon: BarChart3,
    title: "Pantau & Kelola",
    subtitle: "Kelola data",
    description:
      "Admin mengelola data dan keuangan. Warga memantau status dan riwayat iuran.",
  },
];

const HowItWorksSection = () => {
  const { ref, visible } = useReveal();

  return (
    <section
      id="how-it-works"
      className="overflow-hidden bg-primary py-18 text-white"
    >
      <div className="mx-auto max-w-275 px-6 space-y-6">
        <div className="text-center">
          <Badge className="inline-flex items-center gap-1.5 rounded-[20px] border border-primary/20 bg-secondary px-3.5 py-1.25 text-[12px] font-semibold uppercase tracking-[0.4px] text-primary">
            <ListOrdered className="size-3.5" />
            <span>Cara Penggunaan</span>
          </Badge>

          <h2
            className={cn(
              "text-[clamp(32px,5vw,52px)] font-semibold leading-[1.15] tracking-[-0.5px] font-fraunces mt-4",
            )}
          >
            Mulai dalam
            <br />
            <em className="italic opacity-85">4 langkah mudah</em>
          </h2>
        </div>

        {/* Desktop view */}
        <div ref={ref} className="relative mt-17 hidden md:block">
          <div className="absolute left-[12.5%] right-[12.5%] top-16.75 h-2 rounded-full bg-white/15">
            <div
              className={`h-full bg-secondary rounded-full transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                visible ? "w-full" : "w-0"
              }`}
            />
          </div>

          <div className="grid gap-9 md:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  style={{ transitionDelay: `${index * 150}ms` }}
                  className={`relative flex flex-col items-center text-center transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                  }`}
                >
                  <div className="mb-4 text-[14px] font-semibold text-secondary">
                    {step.number}
                  </div>

                  <div className="relative z-10 flex size-16 items-center justify-center rounded-full border-[7px] border-primary bg-secondary shadow-[0_0_0_8px_rgba(255,255,255,0.12)]">
                    <Icon aria-hidden className="size-6 text-primary animate-pulse" />
                  </div>

                  <div className="mt-5 h-8 w-px bg-white/20" />

                  <div className="mt-3 max-w-55">
                    <h3
                      className={cn(
                        "text-[15px] font-semibold leading-snug font-fraunces",
                      )}
                    >
                      {step.title}
                    </h3>

                    <div className="mt-1 text-[12px] font-semibold text-secondary/90">
                      {step.subtitle}
                    </div>

                    <p className="mt-3 text-[13px] leading-[1.6] text-white/65">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile view */}
        <div className="relative mt-12 md:hidden">
          <div className="absolute bottom-8 left-4.25 top-2 w-px bg-white/20" />

          <div className="space-y-9">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  style={{ transitionDelay: `${index * 120}ms` }}
                  className={`relative grid grid-cols-[36px_1fr] gap-4 transition-all duration-[750ms] ${
                    visible ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                  }`}
                >
                  <div className="relative z-10 flex justify-center">
                    <div className="flex size-9 items-center justify-center rounded-full border border-white/20 bg-white text-[12px] font-semibold text-primary shadow-sm">
                      {Number(step.number)}
                    </div>
                  </div>

                  <div className="pt-0.5">
                    <Badge className="mb-3 inline-flex justify-center items-center gap-1.5 rounded-full border-0 bg-secondary px-3 py-1 text-[11px] font-semibold text-primary">
                      <Icon className="size-3.5 animate-pulse" />
                      {step.title}
                    </Badge>

                    <p className="text-sm leading-[1.7] text-white/70">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
