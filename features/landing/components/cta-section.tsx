"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SignIn from "@/features/auth/pages/sign-in";
import Image from "next/image";

export default function CTASection() {
  return (
    <section className="bg-background relative overflow-visible">
      <div className="container relative mx-auto max-w-275 px-6">

        {/* Green Banner Background Card */}
        <div className="absolute inset-x-6 top-0 bottom-0 bg-primary rounded-t-[32px] z-0 shadow-2xl shadow-emerald-950/20" />

        {/* Subtle decorative elements inside the banner */}
        <div className="pointer-events-none absolute inset-x-6 top-0 bottom-0 overflow-hidden rounded-[32px] z-0 opacity-10">
          <svg className="absolute -left-20 -top-20 h-80 w-80 text-white" fill="currentColor" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
          <svg className="absolute -right-20 -bottom-20 h-80 w-80 text-white" fill="currentColor" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="currentColor" />
          </svg>
        </div>

        {/* Main Content — single row, compact */}
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 px-6 py-10 lg:px-12 lg:py-10 text-center lg:text-left">

          {/* Text + Button */}
          <div className="flex flex-col sm:flex-row items-center lg:items-center gap-4 sm:gap-6 shrink-0 w-full lg:w-auto justify-center lg:justify-start">
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                Bergabung Sekarang!
              </h2>
              <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed max-w-xs mx-auto sm:mx-0">
                Daftar dan nikmati kemudahan mendapatkan informasi dan layanan dari lingkungan Anda.
              </p>
            </div>

            <SignIn>
              <Button className="bg-white hover:bg-emerald-50 text-emerald-800 font-semibold text-sm px-6 py-5 rounded-xl hover:-translate-y-0.5 transition-all duration-300 gap-2 shrink-0 shadow-md">
                Daftar Gratis
                <ArrowRight className="h-4 w-4" />
              </Button>
            </SignIn>
          </div>

          {/* Phone Mockup — hidden on mobile, visible on desktop */}
          <div className="hidden lg:block shrink-0 self-center lg:self-end lg:-mb-10 my-2 lg:my-0">
            <div className="relative w-32 sm:w-40 h-48 sm:h-60">
              <Image
                src="/images/Untitled design (10).png"
                alt="SIWARGA Mobile App Interface"
                fill
                priority
                className="object-contain object-bottom drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)] select-none pointer-events-none transition-transform duration-700 hover:scale-105"
                sizes="400px"
              />
            </div>
          </div>

          {/* QR Code & Store Badges */}
          <div className="flex items-center justify-center gap-3 shrink-0 w-full lg:w-auto">
            <div className="bg-white p-1 rounded-2xl shrink-0 w-16 h-16 relative overflow-hidden shadow-lg border border-white/20">
              <Image
                src="/images/QR-Code.png"
                alt="QR Code"
                fill
                className="object-contain"
                sizes="64px"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <div className="text-white leading-tight">
                <h4 className="font-semibold text-xs">Unduh Aplikasi</h4>
                <p className="text-emerald-200 text-[10px]">Sistem Informasi RT RW</p>
              </div>

              <div className="flex gap-1.5">
                {/* Google Play */}
                <a
                  href="#"
                  className="flex items-center gap-1.5 bg-black hover:bg-neutral-900 border border-neutral-800 px-2 py-1 rounded-lg transition-colors select-none"
                >
                  <svg className="h-3.5 w-3.5 text-white fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M3.609 1.814L13.784 12L3.609 22.186c-.453-.453-.609-1.127-.609-1.814V3.628c0-.687.156-1.361.609-1.814zM15.2 13.414l3.186-3.186L4.829 3.1c-.244-.244-.564-.325-.88-.244l11.251 10.558zm3.985-3.986l1.814 1.037c.722.413.722 1.085 0 1.498l-1.814 1.037-2.613-2.613 2.613-2.559zm-4.401.761l-10.96 11.21c.316.081.636 0 .88-.244l13.266-7.558-3.186-3.408z" />
                  </svg>
                  <div>
                    <div className="text-[6px] uppercase tracking-wide text-neutral-400 leading-none">Get it on</div>
                    <div className="text-[8px] font-semibold text-white mt-0.5 leading-none">Google Play</div>
                  </div>
                </a>

                {/* App Store */}
                <a
                  href="#"
                  className="flex items-center gap-1.5 bg-black hover:bg-neutral-900 border border-neutral-800 px-2 py-1 rounded-lg transition-colors select-none"
                >
                  <svg className="h-3.5 w-3.5 text-white fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.57 2.95-1.39z" />
                  </svg>
                  <div>
                    <div className="text-[6px] uppercase tracking-wide text-neutral-400 leading-none">Download on the</div>
                    <div className="text-[8px] font-semibold text-white mt-0.5 leading-none">App Store</div>
                  </div>
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}