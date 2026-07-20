"use client";

import { useEffect, useState } from "react";
import { Play, ClipboardList, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import SignIn from "@/features/auth/pages/sign-in";
import Image from "next/image";

export function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-radial from-emerald-50/40 via-background to-background pt-24 pb-24 md:pt-28 md:pb-36 border-b border-border/40"
    >
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Background photo */}
        <Image
          src="/images/hero-bg.png"
          alt="Hero Background"
          fill
          priority
          className="object-cover opacity-65 object-right md:object-center"
        />
        {/* Readability gradient overlays */}
        <div className="absolute inset-y-0 left-0 w-full lg:w-[65%] bg-gradient-to-r from-background via-background/90 to-transparent z-10" />
        <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-background to-transparent z-10" />

        {/* Soft grid background */}
        <div
          className="absolute inset-0 opacity-[0.025] z-10"
          style={{
            backgroundImage: `
              linear-gradient(var(--primary) 1.5px, transparent 1.5px),
              linear-gradient(90deg, var(--primary) 1.5px, transparent 1.5px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
        {/* Colorful blobs */}
        <div className="absolute -top-40 right-0 h-[400px] w-[400px] rounded-full bg-emerald-100/10 blur-3xl z-10" />
      </div>

      <div className="container relative z-20 mx-auto max-w-275 px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* LEFT SIDE: Content */}
          <div className="flex flex-col items-start lg:col-span-6 space-y-6 order-2 lg:order-1">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/60 border border-emerald-200/50 px-4 py-1.5 text-emerald-800 font-semibold text-xs transition-all duration-300">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              SISTEM INFORMASI RT RW
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-bold leading-[1.1] tracking-tight text-foreground">
              <span className="block whitespace-nowrap">Informasi Lengkap,</span>
              <span className="block whitespace-nowrap">Layanan Mudah,</span>
              <span className="block whitespace-nowrap text-primary bg-primary bg-clip-text text-transparent">Warga Nyaman.</span>
            </h1>

            {/* Sub-headline / Paragraph */}
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed max-w-lg">
              Sistem informasi terpadu yang memudahkan warga mengakses informasi,
              layanan, and kegiatan di lingkungan RT RW secara cepat dan transparan.
            </p>

            {/* Buttons Row */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <SignIn>
                <Button className="bg-primary hover:bg-primary/95 text-white font-medium text-base px-6 py-6 rounded-xl shadow-lg shadow-emerald-700/10 hover:shadow-emerald-700/20 hover:-translate-y-0.5 transition-all duration-300 gap-2 shrink-0">
                  <ClipboardList className="h-5 w-5" />
                  Daftar Sekarang
                </Button>
              </SignIn>

              <Button
                variant="outline"
                className="bg-card border-border hover:bg-muted/80 text-foreground font-medium text-base px-6 py-6 rounded-xl hover:-translate-y-0.5 transition-all duration-300 gap-2 shrink-0"
                onClick={() => {
                  const el = document.getElementById("layanan");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary">
                  <Play className="h-3 w-3 fill-primary ml-0.5" />
                </span>
                Lihat Video
              </Button>
            </div>

            {/* Bottom Badges */}
            <div className="flex flex-wrap lg:flex-nowrap items-center gap-x-4 lg:gap-x-6 gap-y-3 pt-4 border-t border-border/60 w-full">
              {[
                "Mudah Digunakan",
                "Aman & Terpercaya",
                "Informasi Terupdate",
              ].map((text) => (
                <div key={text} className="flex items-center gap-2 text-sm text-foreground/80 font-medium whitespace-nowrap">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-primary">
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </span>
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE: Device Mockup */}
          <div className="relative flex justify-center lg:col-span-6 w-full mt-6 lg:mt-0 lg:-mr-20 xl:-mr-32 z-20 order-1 lg:order-2">
            <div className="relative w-[100%] lg:w-[120%] h-[320px] sm:h-[450px] md:h-[540px] lg:h-[580px] xl:h-[660px] select-none pointer-events-none transform lg:scale-110 origin-left">
              <Image
                src="/images/Mockup.png"
                alt="SIWARGA Desktop and Mobile Dashboard Mockup"
                fill
                priority
                className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.12)] hover:scale-[1.02] transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 1000px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
