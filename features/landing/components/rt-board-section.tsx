"use client";

import { useEffect, useRef, useState } from "react";
import { Mail, Phone, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
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

const boardMembers = [
  {
    name: "Bpk. Supriyadi",
    role: "Ketua RT 04",
    avatar: "/images/avatars/supriyadi.png",
    phone: "6281234567890",
    email: "supriyadi@siwarga.id",
  },
  {
    name: "Ibu Retno Lestari",
    role: "Sekretaris RT 04",
    avatar: "/images/avatars/retno.png",
    phone: "6281234567891",
    email: "retno@siwarga.id",
  },
  {
    name: "Bpk. Budi Santoso",
    role: "Bendahara RT 04",
    avatar: "/images/avatars/budi.png",
    phone: "6281234567892",
    email: "budi@siwarga.id",
  },
  {
    name: "Bpk. Joko Susilo",
    role: "Seksi Keamanan & Ketertiban",
    avatar: "/images/avatars/joko.png",
    phone: "6281234567893",
    email: "joko@siwarga.id",
  },
  {
    name: "Bpk. Ahmad Dahlan",
    role: "Seksi Humas & Informasi",
    avatar: "/images/avatars/supriyadi.png",
    phone: "6281234567894",
    email: "ahmad@siwarga.id",
  },
  {
    name: "Ibu Siti Aminah",
    role: "Seksi Sosial & Kesejahteraan",
    avatar: "/images/avatars/retno.png",
    phone: "6281234567895",
    email: "siti@siwarga.id",
  },
  {
    name: "Bpk. Heru Prasetyo",
    role: "Seksi Pembangunan & Sarana",
    avatar: "/images/avatars/budi.png",
    phone: "6281234567896",
    email: "heru@siwarga.id",
  },
  {
    name: "Bpk. Agus Wijaya",
    role: "Seksi Kepemudaan & Olahraga",
    avatar: "/images/avatars/joko.png",
    phone: "6281234567897",
    email: "agus@siwarga.id",
  },
  {
    name: "Bpk. Slamet Riyadi",
    role: "Seksi Kebersihan & Lingkungan",
    avatar: "/images/avatars/supriyadi.png",
    phone: "6281234567898",
    email: "slamet@siwarga.id",
  },
  {
    name: "Ibu Sri Wahyuni",
    role: "Seksi Pemberdayaan Perempuan",
    avatar: "/images/avatars/retno.png",
    phone: "6281234567899",
    email: "sri@siwarga.id",
  },
  {
    name: "Bpk. Bambang Utomo",
    role: "Seksi Kerohanian & Keagamaan",
    avatar: "/images/avatars/budi.png",
    phone: "6281234567900",
    email: "bambang@siwarga.id",
  },
  {
    name: "Bpk. Dwi Cahyono",
    role: "Humas Wilayah I",
    avatar: "/images/avatars/joko.png",
    phone: "6281234567901",
    email: "dwi@siwarga.id",
  },
  {
    name: "Bpk. Eko Prasetyo",
    role: "Humas Wilayah II",
    avatar: "/images/avatars/supriyadi.png",
    phone: "6281234567902",
    email: "eko@siwarga.id",
  },
  {
    name: "Ibu Kartika Sari",
    role: "Seksi Pendidikan & Budaya",
    avatar: "/images/avatars/retno.png",
    phone: "6281234567903",
    email: "kartika@siwarga.id",
  },
  {
    name: "Bpk. Tri Wibowo",
    role: "Seksi Keamanan & Ketertiban",
    avatar: "/images/avatars/budi.png",
    phone: "6281234567904",
    email: "tri@siwarga.id",
  },
  {
    name: "Bpk. Roni Setiawan",
    role: "Seksi Sarana & Prasarana",
    avatar: "/images/avatars/joko.png",
    phone: "6281234567905",
    email: "roni@siwarga.id",
  },
  {
    name: "Bpk. Hendra Wijaya",
    role: "Seksi Kebersihan & Lingkungan",
    avatar: "/images/avatars/supriyadi.png",
    phone: "6281234567906",
    email: "hendra@siwarga.id",
  },
  {
    name: "Ibu Indah Permatasari",
    role: "Seksi Kesejahteraan Sosial",
    avatar: "/images/avatars/retno.png",
    phone: "6281234567907",
    email: "indah@siwarga.id",
  },
  {
    name: "Bpk. Yusuf Ginanjar",
    role: "Seksi Keagamaan",
    avatar: "/images/avatars/budi.png",
    phone: "6281234567908",
    email: "yusuf@siwarga.id",
  },
  {
    name: "Bpk. Aris Munandar",
    role: "Seksi Kepemudaan",
    avatar: "/images/avatars/joko.png",
    phone: "6281234567909",
    email: "aris@siwarga.id",
  },
];

const CARD_HEIGHT = 320;

export function RTBoardSection() {
  const { ref: revealRef, visible } = useReveal();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const currentIndexRef = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const getSpacerWidth = () => {
    const container = scrollContainerRef.current;
    if (!container) return 0;
    const spacer = container.firstElementChild as HTMLElement | null;
    if (!spacer) return 0;
    return spacer.getBoundingClientRect().width + 24;
  };

  const getStep = () => {
    const container = scrollContainerRef.current;
    if (!container) return 0;
    const card = container.children[1] as HTMLElement | null;
    if (!card) return 0;
    return card.getBoundingClientRect().width + 24;
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const step = getStep();
    const spacer = getSpacerWidth();
    if (!step) return;
    const newIndex = Math.round(Math.max(0, container.scrollLeft - spacer) / step);
    currentIndexRef.current = newIndex;
    setCurrentIndex(newIndex);
  };

  const scrollLeft = () => {
    const step = getStep();
    if (step) scrollContainerRef.current?.scrollBy({ left: -step, behavior: "smooth" });
  };

  const scrollRight = () => {
    const step = getStep();
    if (step) scrollContainerRef.current?.scrollBy({ left: step, behavior: "smooth" });
  };

  const scrollToMember = (idx: number) => {
    const step = getStep();
    const spacer = getSpacerWidth();
    if (step)
      scrollContainerRef.current?.scrollTo({ left: spacer + idx * step, behavior: "smooth" });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = 0;
        currentIndexRef.current = 0;
        setCurrentIndex(0);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const totalGroups = Math.ceil(boardMembers.length / 5);
  const activeGroup = Math.min(Math.floor(currentIndex / 5), totalGroups - 1);

  const arrowTopStyle = { top: `${CARD_HEIGHT / 2}px`, transform: "translateY(-50%)" };

  return (
    <section id="pengurus-rt" className="py-10 bg-[#F8FAFC] overflow-hidden w-full relative">
      <div className="container mx-auto max-w-275 px-6 mb-12">
        <div className="text-center max-w-3xl mx-auto">
          <h2
            className="font-fraunces font-semibold leading-[1.1] tracking-tight text-foreground"
            style={{ fontSize: "clamp(32px, 4.5vw, 50px)", letterSpacing: "-1px", marginBottom: "8px" }}
          >
            Struktur <em className="italic text-primary">Pengurus RT 04</em>
          </h2>
          <p
            className="text-[16px] leading-[1.6] text-muted-foreground truncate"
            title="Dedikasi para pengurus untuk mewujudkan lingkungan yang rukun, bersih, aman, dan transparan."
          >
            Dedikasi para pengurus untuk mewujudkan lingkungan yang rukun, bersih, aman, dan transparan.
          </p>
        </div>
      </div>

      <div ref={revealRef} className="relative w-full group/carousel">
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#F8FAFC] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#F8FAFC] to-transparent z-10 pointer-events-none" />

        <button
          onClick={scrollLeft}
          style={arrowTopStyle}
          className="absolute left-4 lg:left-8 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-white/90 shadow-md text-foreground hover:bg-white hover:text-primary hover:border-primary active:scale-95 transition-all opacity-0 group-hover/carousel:opacity-100 focus:opacity-100 cursor-pointer"
          aria-label="Previous board member"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={scrollRight}
          style={arrowTopStyle}
          className="absolute right-4 lg:right-8 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-white/90 shadow-md text-foreground hover:bg-white hover:text-primary hover:border-primary active:scale-95 transition-all opacity-0 group-hover/carousel:opacity-100 focus:opacity-100 cursor-pointer"
          aria-label="Next board member"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto gap-6 scroll-smooth snap-x snap-mandatory no-scrollbar pb-8"
          style={{ scrollPaddingLeft: "clamp(24px, 5vw, 80px)" }}
        >
          <div className="shrink-0 w-[clamp(24px,5vw,80px)]" aria-hidden="true" />

          {boardMembers.map((m, i) => (
            <div
              key={i}
              className={`group/card relative flex flex-col justify-end overflow-hidden rounded-[24px] border border-border bg-card transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_16px_36px_rgba(0,0,0,0.12)] h-[320px] w-[190px] xs:w-[210px] sm:w-[230px] md:w-[250px] shrink-0 snap-start ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
              style={{ transitionDelay: `${(i % 6) * 80}ms` }}
            >
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={m.avatar}
                  alt={m.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover/card:scale-105"
                  sizes="(max-width: 768px) 100vw, 250px"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-85 transition-opacity duration-300 group-hover/card:opacity-95" />

              <div className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 border border-white/20 text-white backdrop-blur-md transition-all duration-300 group-hover/card:bg-white group-hover/card:text-primary group-hover/card:border-white">
                <ArrowUpRight className="h-4.5 w-4.5" />
              </div>

              <div className="relative p-5 text-white z-10">
                <p
                  className="text-[11px] font-semibold tracking-wider text-primary-foreground/90 uppercase mb-0.5 text-ellipsis overflow-hidden whitespace-nowrap"
                  title={m.role}
                >
                  {m.role}
                </p>
                <h3
                  className="font-fraunces text-[18px] font-bold leading-tight mb-3 text-ellipsis overflow-hidden whitespace-nowrap"
                  title={m.name}
                >
                  {m.name}
                </h3>
                <div className="flex items-center gap-2.5">
                  <a
                    href={`https://wa.me/${m.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/25 border border-white/10 text-white backdrop-blur-xs transition-all hover:scale-105 active:scale-95"
                    title="Hubungi via WhatsApp"
                  >
                    <Phone className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={`mailto:${m.email}`}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/25 border border-white/10 text-white backdrop-blur-xs transition-all hover:scale-105 active:scale-95"
                    title="Hubungi via Email"
                  >
                    <Mail className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}

          <div className="shrink-0 w-[clamp(24px,5vw,80px)]" aria-hidden="true" />
        </div>

        <div className="flex justify-center gap-2 mt-8 flex-wrap px-6 max-w-4xl mx-auto">
          {Array.from({ length: totalGroups }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToMember(index * 5)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${activeGroup === index ? "w-8 bg-primary" : "w-2.5 bg-slate-300 hover:bg-slate-400"
                }`}
              aria-label={`Go to group ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}