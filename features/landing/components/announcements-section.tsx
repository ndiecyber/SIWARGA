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
      className="relative py-[96px] overflow-hidden bg-white text-foreground"
    >
      {/* Subtle Background Lights */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-35">
        <div
          className="absolute"
          style={{
            top: "10%",
            right: "5%",
            width: "450px",
            height: "450px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, hsl(var(--primary)/.08) 0%, transparent 70%)",
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
            background:
              "radial-gradient(circle, hsl(var(--primary)/.06) 0%, transparent 70%)",
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
            <Megaphone className="h-3.5 w-3.5" />
            Pengumuman RT
          </Badge>
          <h2
            className="font-fraunces font-bold leading-[1.15] mb-6 text-foreground"
            style={{
              fontSize: "clamp(34px, 4.5vw, 50px)",
              letterSpacing: "-1px",
            }}
          >
            Informasi & Agenda
            <br />
            <span className="text-primary">Terkini Lingkungan RT</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[580px] text-[15px] leading-[1.7] text-muted-foreground">
            Ikuti terus perkembangan informasi, jadwal kegiatan warga, dan
            imbauan penting terbaru dari pengurus RT 04 Arjamukti.
          </p>
        </div>

        {/* Announcement Grid */}
        <div
          ref={ref}
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-700 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          {announcements.map((item) => (
            <Card
              key={item.id}
              className="flex flex-col justify-between p-6 border-border bg-card hover:border-primary/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 rounded-2xl text-foreground group"
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

        {/* Info Box */}
        <div className="mt-12 max-w-full mx-auto p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-3 justify-center text-center text-xs text-muted-foreground">
          <Info className="h-4 w-4 text-primary shrink-0" />
          <span>
            Pengurus RT secara berkala menerbitkan lembaran surat edaran resmi
            yang dapat diunduh melalui panel portal warga.
          </span>
        </div>
      </div>
    </section>
  );
}
