"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

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

const testimonials = [
  {
    initials: "BS",
    text: '"Sekarang saya tidak perlu bingung apakah sudah bayar iuran. Langsung cek di SIWARGA, semua riwayat ada."',
    name: "Budi Santoso",
    role: "Warga Blok A01",
  },
  {
    initials: "SP",
    text: '"Sebagai ketua RT, administrasi jadi jauh lebih ringan. Laporan keuangan bisa dicetak langsung, warga pun lebih percaya."',
    name: "Bpk. Supriyadi",
    role: "Ketua RT 04",
  },
  {
    initials: "DA",
    text: '"Pengumuman kerja bakti langsung muncul di HP. Tidak ada lagi alasan tidak tahu ada kegiatan RT."',
    name: "Dewi Anggraini",
    role: "Warga Blok A04",
  },
];

const TestimonialSection = () => {
  const { ref, visible } = useReveal();

  return (
    <section className="bg-[#F8FAFC] py-27 overflow-hidden" id="testimonials">
      <div className="px-6 mx-auto max-w-275">
        <div className="space-y-6 text-center">
          <Badge className="inline-flex items-center gap-1.5 rounded-[20px] border px-3.5 text-[12px] font-semibold uppercase tracking-[0.4px] border-[#f0d9a8] bg-[#fdf3e3] text-[#c9973a] py-2">
            <Star /> <span>Kata Warga</span>
          </Badge>
          <h2
            className={cn(
              "text-[clamp(32px,5vw,52px)] font-semibold leading-[1.15] tracking-[-0.5px] text-foreground font-fraunces",
            )}
          >
            Dipercaya warga
            <br />
            <em className="italic text-primary">RT 04 Arjamukti</em>
          </h2>
        </div>

        <div
          ref={ref}
          className="mt-12 grid grid-cols-3 gap-5 max-[640px]:grid-cols-1"
        >
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              style={{ transitionDelay: `${index * 120}ms` }}
              className={`transition-all duration-[750ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
            >
              <CardHeader className="py-0">
                <CardTitle>
                  <div className="text-[14px] tracking-[2px] text-[#c9973a]">
                    ★★★★★
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="italic">{testimonial.text}</CardContent>
              <CardFooter>
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      "flex size-9.5 shrink-0 items-center justify-center rounded-full bg-primary text-[13px] font-bold text-white font-fraunces",
                    )}
                  >
                    {testimonial.initials}
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-[12px] text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
