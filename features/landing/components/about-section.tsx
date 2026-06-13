"use client";

import { useEffect, useRef, useState } from "react";
import { Home, ArrowRight } from "lucide-react";
import Image from "next/image";

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

export function AboutSection() {
  const { ref, visible } = useReveal();

  const handleSmoothScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const stats = [
    {
      value: "4 Orang",
      label: "Pengurus RT",
      link: "pengurus-rt",
    },
    {
      value: "120",
      label: "Unit Rumah",
    },
    {
      value: "456",
      label: "Jiwa Terdaftar",
    },
    {
      value: "92%",
      label: "Tingkat Lunas",
    },
  ];

  return (
    <section
      id="tentang-kami"
      className="relative py-12 overflow-hidden bg-primary text-white"
    >
      {/* Background Subtle Pattern & Lights */}
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
              "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)",
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
              "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
          }}
        />
        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "45px 45px",
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto max-w-275 px-6">
        <div
          ref={ref}
          className={`grid grid-cols-1 items-center gap-16 md:grid-cols-2 transition-all duration-700 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          {/* Left Column: Text Content and Stats */}
          <div className="flex flex-col justify-center">
            {/* Badge */}
            <div className="mb-5 self-start rounded-full border border-white/35 bg-white/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.8px] text-white">
              Tentang Kami
            </div>

            {/* Title */}
            <h2
              className="font-jakarta leading-[1.15] mb-6 text-white"
              style={{
                fontSize: "clamp(34px, 4.5vw, 50px)",
                fontWeight: 700,
                letterSpacing: "-1px",
              }}
            >
              Selamat Datang di
              <br />
              <span className="text-white">RT 04 Arjamukti</span>
            </h2>

            {/* Paragraphs */}
            <div className="space-y-2 text-[14.5px] leading-[1.7] text-white/85">
              <p>
                RT 04 yang berlokasi di Perum Arjamukti Kencana Raya,
                Tasikmalaya, adalah lingkungan hunian yang damai, bersih, dan
                rukun. Kami mengusung nilai kekeluargaan dan gotong royong
                sebagai fondasi utama dalam membangun keharmonisan bertetangga.
              </p>
              <p>
                Dengan berbagai program kerja bakti bulanan, siskamling aktif,
                serta kegiatan sosial kemasyarakatan, kami berupaya menciptakan
                lingkungan tempat tinggal yang aman, nyaman, dan transparan bagi
                seluruh warga.
              </p>
            </div>

            {/* Integrated Stats Row */}
            <div className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((s) =>
                s.link ? (
                  <button
                    key={s.label}
                    onClick={() => handleSmoothScroll(s.link)}
                    className="group flex flex-col items-start rounded-[14px] border border-white/15 bg-white/5 p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-white/40 hover:bg-white/10"
                  >
                    <span className="text-[24px] font-bold leading-none text-white">
                      {s.value}
                    </span>
                    <span className="mt-2 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.5px] text-white/75 group-hover:text-white">
                      {s.label}
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </span>
                  </button>
                ) : (
                  <div
                    key={s.label}
                    className="flex flex-col items-start rounded-[14px] border border-white/15 bg-white/5 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-white/40 hover:bg-white/10"
                  >
                    <span className="text-[24px] font-bold leading-none text-white">
                      {s.value}
                    </span>
                    <span className="mt-2 text-[10px] font-semibold uppercase tracking-[0.5px] text-white/75">
                      {s.label}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Right Column: Visual Image with Floating Card */}
          <div className="relative flex justify-center">
            {/* Outer border decoration */}
            <div className="absolute -inset-2 rounded-[32px] border border-white/10 pointer-events-none" />

            {/* Image Container */}
            <div className="relative h-90 w-full max-w-115 overflow-hidden rounded-[24px] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.22)] md:h-105">
              <Image
                src="/images/arjamukti.png"
                alt="RT 04 Arjamukti Neighborhood"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-w-768px) 100vw, 500px"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
