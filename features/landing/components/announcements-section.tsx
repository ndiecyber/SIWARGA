"use client";

import React, { useEffect, useRef, useState } from "react";
import { Megaphone, Calendar, ChevronRight, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

const announcements = [
  {
    id: 1,
    title: "Kerja Bakti Bulanan & Penyemprotan DBD",
    date: "15 Juni 2025",
    tag: "Kegiatan Warga",
    tagBg: "bg-blue-50 text-blue-700 border-blue-200",
    desc: "Kerja bakti bersama membersihkan saluran air (selokan) dan fogging area perumahan untuk mengantisipasi musim hujan serta mencegah perkembangbiakan jentik nyamuk demam berdarah.",
  },
  {
    id: 2,
    title: "Pembayaran Iuran Bulanan Juni 2025",
    date: "10 Juni 2025",
    tag: "Keuangan",
    tagBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    desc: "Mengingatkan kembali batas akhir pembayaran iuran bulanan kebersihan & keamanan sebesar Rp25.000 jatuh tempo setiap tanggal 10. Pembayaran dapat dilakukan via Bendahara RT.",
  },
  {
    id: 3,
    title: "Sosialisasi Siskamling Ronda Malam Baru",
    date: "05 Juni 2025",
    tag: "Keamanan",
    tagBg: "bg-rose-50 text-rose-700 border-rose-200",
    desc: "Sosialisasi pembagian jadwal siskamling ronda malam baru warga RT 04 guna meningkatkan keamanan lingkungan serta koordinasi tombol darurat (panic button) di pos ronda utama.",
  },
];

export function AnnouncementsSection() {
  const { ref, visible } = useReveal();

  const handleDetailClick = (title: string) => {
    toast.info(
      `Detail pengumuman "${title}" hanya dapat diakses setelah masuk ke sistem portal warga.`,
    );
  };

  return (
    <section
      id="pengumuman"
      className="relative py-8 md:py-12 overflow-hidden bg-white text-foreground"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-35">
        <div
          className="absolute"
          style={{
            top: "10%", right: "5%", width: "450px", height: "450px",
            borderRadius: "50%",
            background: "radial-gradient(circle, hsl(var(--primary)/.08) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: "10%", left: "5%", width: "450px", height: "450px",
            borderRadius: "50%",
            background: "radial-gradient(circle, hsl(var(--primary)/.06) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)",
            backgroundSize: "45px 45px",
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto max-w-[1100px] px-4 sm:px-6">

        {/* Header */}
        <div className="mb-6 md:mb-10 text-center max-w-4xl mx-auto">
          <h2
            className="font-fraunces font-semibold leading-[1.1] tracking-tight text-foreground"
            style={{ fontSize: "clamp(20px, 4.5vw, 42px)", letterSpacing: "-0.5px", marginBottom: "6px" }}
          >
            Pengumuman & Kegiatan <em className="italic text-primary">RT 04</em>
          </h2>
        </div>

        {/* Mobile: vertical list / Desktop: 3-col grid */}
        <div
          ref={ref}
          className={`transition-all duration-700 ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
        >
          {/* ── Desktop grid ── */}
          <div className="hidden md:grid md:grid-cols-3 gap-5">
            {announcements.map((item) => (
              <Card
                key={item.id}
                className="flex flex-col justify-between p-5 md:p-6 border-border bg-card hover:border-primary/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 rounded-2xl text-foreground group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground/85" />
                      {item.date}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${item.tagBg}`}
                    >
                      {item.tag}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-fraunces font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-200 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {item.desc}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDetailClick(item.title)}
                  className="mt-auto self-start rounded-lg h-9 text-xs font-semibold border-primary/20 text-primary bg-transparent hover:bg-primary hover:text-primary-foreground flex items-center gap-1 transition-all duration-300"
                >
                  <span>Baca Selengkapnya</span>
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Card>
            ))}
          </div>

          {/* ── Mobile list ── */}
          <div className="flex flex-col gap-2.5 md:hidden">
            {announcements.map((item) => (
              <button
                key={item.id}
                onClick={() => handleDetailClick(item.title)}
                className="group w-full text-left flex items-start gap-3 p-3.5 rounded-xl border border-border bg-card hover:border-primary/30 active:bg-muted/40 transition-all duration-200"
              >
                {/* Left accent strip */}
                <div className="flex-shrink-0 mt-0.5 flex flex-col items-center gap-1">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Megaphone className="h-4 w-4" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Badge
                      variant="outline"
                      className={`text-[9px] font-bold px-1.5 py-0 rounded border leading-5 ${item.tagBg}`}
                    >
                      {item.tag}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                      <Calendar className="h-3 w-3" />
                      {item.date}
                    </span>
                  </div>

                  <h3 className="text-[13.5px] font-fraunces font-bold text-foreground leading-snug mb-1 group-hover:text-primary transition-colors duration-200">
                    {item.title}
                  </h3>

                  <p className="text-[11.5px] text-muted-foreground leading-relaxed line-clamp-2">
                    {item.desc}
                  </p>
                </div>

                {/* Chevron */}
                <ChevronRight className="h-4 w-4 text-muted-foreground/50 flex-shrink-0 mt-1 group-hover:text-primary transition-colors duration-200" />
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}