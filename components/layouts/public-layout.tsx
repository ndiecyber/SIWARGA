"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AppSidebar } from "../shared/app-sidebar";
import Footer from "../shared/footer";
import Navbar from "../shared/navbar";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

function PublicLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [fadeAway, setFadeAway] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      setFadeAway(true);
      setTimeout(() => {
        setLoading(false);
        document.body.style.overflow = "";
      }, 600);
    }, 2400); // durasi tampil sebelum fade out

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      {loading && (
        <div
          className={`fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-b from-background to-slate-50 dark:to-card transition-opacity duration-600 ease-out ${
            fadeAway ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          {/* Grid lines background (Slowly Panning, extremely soft gray) */}
          <div
            className="absolute inset-0 opacity-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(128,128,128,0.035) 1px, transparent 1px),
                linear-gradient(90deg, rgba(128,128,128,0.035) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
              animation: "fadeIn 1.2s ease 0.3s both, gridPan 20s linear infinite",
            }}
          />

          {/* Corner brackets (Slide-in animations, refined visibility) */}
          {[
            { cls: "top-6 left-6 border-t border-l", anim: "bracketTL" },
            { cls: "top-6 right-6 border-t border-r", anim: "bracketTR" },
            { cls: "bottom-6 left-6 border-b border-l", anim: "bracketBL" },
            { cls: "bottom-6 right-6 border-b border-r", anim: "bracketBR" },
          ].map(({ cls, anim }, i) => (
            <div
              key={i}
              className={`absolute w-8 h-8 border-border/60 dark:border-white/20 ${cls}`}
              style={{
                animation: `${anim} 0.8s cubic-bezier(0.16, 1, 0.3, 1) both`,
                animationDelay: `${0.2 + i * 0.1}s`,
              }}
            />
          ))}

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Eyebrow */}
            <p
              className="text-[10px] tracking-[0.2em] uppercase text-foreground/75 dark:text-white/60 font-medium mb-5"
              style={{
                fontFamily: "var(--font-outfit)",
                animation: "eyebrowReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both",
              }}
            >
              Sistem Informasi Warga
            </p>

            {/* Logo image with clip reveal & dark mode filter */}
            <div
              className="overflow-hidden mb-1"
              style={{ animation: "fadeIn 0.9s ease 0.9s both" }}
            >
              <Image
                src="/logo/logo-versi-1.png"
                alt="Logo SIWARGA"
                width={240}
                height={65}
                priority
                className="h-auto w-[240px] object-contain dark:brightness-0 dark:invert"
                style={{
                  animation: "logoReveal 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.9s both",
                }}
              />
            </div>

            {/* Divider */}
            <div
              className="flex items-center gap-3 my-4"
              style={{ animation: "fadeIn 0.6s ease 1.4s both" }}
            >
              <div className="w-12 h-px bg-border/60 dark:bg-white/20" />
              <div className="w-1 h-1 rounded-full bg-border dark:bg-white/40" />
              <div className="w-12 h-px bg-border/60 dark:bg-white/20" />
            </div>

            {/* Tagline */}
            <p
              className="text-[11px] tracking-[0.1em] uppercase text-foreground/75 dark:text-white/60 font-normal"
              style={{
                fontFamily: "var(--font-outfit)",
                fontWeight: 200,
                animation: "taglineReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.6s both",
              }}
            >
              Pelayanan · Komunitas · Transparansi
            </p>
          </div>

          {/* Bottom bar */}
          <div
            className="absolute bottom-7 left-0 right-0 flex justify-between items-center px-8"
            style={{ animation: "riseIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.8s both" }}
          >
            <span className="text-[9px] tracking-[0.2em] uppercase text-foreground/45 dark:text-white/30 font-medium">
              Memuat sistem
            </span>
            <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
            <span className="text-[9px] tracking-[0.2em] uppercase text-foreground/45 dark:text-white/30 font-medium">
              v1.0.0
            </span>
          </div>
        </div>
      )}

      <SidebarProvider>
        <AppSidebar isShow={!isMobile} />
        <SidebarInset>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}

export default PublicLayout;