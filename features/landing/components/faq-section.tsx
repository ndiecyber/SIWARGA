"use client";

import { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CircleQuestionMark } from "lucide-react";
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

const FAQItems = [
  {
    question: "Siapa saja yang bisa menggunakan SIWARGA?",
    answer:
      "SIWARGA dapat digunakan oleh seluruh warga terdaftar RT 04. Terdapat dua jenis akun: akun warga (memantau informasi pribadi) dan akun admin (pengurus RT mengelola data).",
  },
  {
    question: "Bagaimana cara mendaftar sebagai warga baru?",
    answer:
      "Warga baru mendaftar melalui halaman Daftar Warga dengan mengisi NIK, nomor rumah, dan data diri. Pengurus RT akan memverifikasi dan mengaktifkan akun dalam 1×24 jam.",
  },
  {
    question: "Apakah data pribadi saya aman?",
    answer:
      "Ya. Data warga dikelola secara lokal oleh pengurus RT dan hanya dapat diakses oleh admin terverifikasi. Warga hanya dapat melihat data miliknya sendiri.",
  },
  {
    question: "Apakah SIWARGA bisa diakses dari HP?",
    answer:
      "SIWARGA dirancang responsif dan dapat diakses nyaman melalui browser HP (Chrome, Safari, dll.) tanpa perlu mengunduh aplikasi. Tampilan warga dioptimalkan untuk layar mobile.",
  },
  {
    question: "Kapan iuran bulanan jatuh tempo?",
    answer:
      "Iuran bulanan sebesar Rp 25.000 jatuh tempo setiap tanggal 10. Pembayaran dapat dilakukan ke bendahara RT atau transfer ke rekening BRI RT 04 a.n. RT 04 Arjamukti.",
  },
];

const FAQSection = () => {
  const { ref, visible } = useReveal();

  return (
    <section className="py-24 bg-white text-foreground relative overflow-hidden" id="faq">
      {/* Decorative Lights */}
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
      </div>

      <div className="mx-auto max-w-275 px-6 relative z-10">
        <div className="text-center space-y-6">
          <Badge className="inline-flex items-center gap-1.5 rounded-[20px] border px-3.5 py-1.25 text-[12px] font-semibold uppercase tracking-[0.8px] border-primary/30 bg-primary/10 text-primary">
            <CircleQuestionMark className="h-3.5 w-3.5 text-primary" /> <span className="text-primary">FAQ</span>
          </Badge>
          <h2
            className={cn(
              "text-[clamp(32px,5vw,52px)] font-semibold leading-[1.15] tracking-[-0.5px] text-foreground",
            )}
          >
            Pertanyaan yang
            <br />
            <em className="italic text-primary font-fraunces">
              sering ditanyakan
            </em>
          </h2>
        </div>

        <div ref={ref} className="mx-auto mt-12 max-w-175">
          <Accordion type="single" collapsible className="space-y-3">
            {FAQItems.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index + 1}`}
                style={{ transitionDelay: `${index * 120}ms` }}
                className={`border border-border bg-card px-5 rounded-xl transition-all hover:bg-muted/40 duration-[750ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                }`}
              >
                <AccordionTrigger className="text-[16px] text-foreground font-serif py-4 hover:no-underline hover:text-primary [&_[data-slot=accordion-trigger-icon]]:text-primary transition-colors duration-200">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-[14px] text-muted-foreground pb-4 leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
