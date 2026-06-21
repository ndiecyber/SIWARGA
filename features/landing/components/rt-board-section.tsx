"use client";

import { useEffect, useRef, useState } from "react";
import { Mail, Phone, ChevronLeft, ChevronRight, ArrowUpRight, Home } from "lucide-react";
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
  { name: "Bpk. Supriyadi", role: "Ketua RT 04", avatar: "/images/avatars/supriyadi.png", phone: "6281234567890", email: "supriyadi@siwarga.id", houseNumber: "A13" },
  { name: "Ibu Retno Lestari", role: "Sekretaris RT 04", avatar: "/images/avatars/retno.png", phone: "6281234567891", email: "retno@siwarga.id", houseNumber: "B14" },
  { name: "Bpk. Budi Santoso", role: "Bendahara RT 04", avatar: "/images/avatars/budi.png", phone: "6281234567892", email: "budi@siwarga.id", houseNumber: "C12" },
  { name: "Bpk. Joko Susilo", role: "Seksi Keamanan & Ketertiban", avatar: "/images/avatars/joko.png", phone: "6281234567893", email: "joko@siwarga.id", houseNumber: "D05" },
  { name: "Bpk. Ahmad Dahlan", role: "Seksi Humas & Informasi", avatar: "/images/avatars/supriyadi.png", phone: "6281234567894", email: "ahmad@siwarga.id", houseNumber: "E10" },
  { name: "Ibu Siti Aminah", role: "Seksi Sosial & Kesejahteraan", avatar: "/images/avatars/retno.png", phone: "6281234567895", email: "siti@siwarga.id", houseNumber: "F08" },
  { name: "Bpk. Heru Prasetyo", role: "Seksi Pembangunan & Sarana", avatar: "/images/avatars/budi.png", phone: "6281234567896", email: "heru@siwarga.id", houseNumber: "G15" },
  { name: "Bpk. Agus Wijaya", role: "Seksi Kepemudaan & Olahraga", avatar: "/images/avatars/joko.png", phone: "6281234567897", email: "agus@siwarga.id", houseNumber: "H03" },
  { name: "Bpk. Slamet Riyadi", role: "Seksi Kebersihan & Lingkungan", avatar: "/images/avatars/supriyadi.png", phone: "6281234567898", email: "slamet@siwarga.id", houseNumber: "I21" },
  { name: "Ibu Sri Wahyuni", role: "Seksi Pemberdayaan Perempuan", avatar: "/images/avatars/retno.png", phone: "6281234567899", email: "sri@siwarga.id", houseNumber: "J07" },
  { name: "Bpk. Bambang Utomo", role: "Seksi Kerohanian & Keagamaan", avatar: "/images/avatars/budi.png", phone: "6281234567900", email: "bambang@siwarga.id", houseNumber: "K11" },
  { name: "Bpk. Dwi Cahyono", role: "Humas Wilayah I", avatar: "/images/avatars/joko.png", phone: "6281234567901", email: "dwi@siwarga.id", houseNumber: "L04" },
  { name: "Bpk. Eko Prasetyo", role: "Humas Wilayah II", avatar: "/images/avatars/supriyadi.png", phone: "6281234567902", email: "eko@siwarga.id", houseNumber: "M18" },
  { name: "Ibu Kartika Sari", role: "Seksi Pendidikan & Budaya", avatar: "/images/avatars/retno.png", phone: "6281234567903", email: "kartika@siwarga.id", houseNumber: "N09" },
  { name: "Bpk. Tri Wibowo", role: "Seksi Keamanan & Ketertiban", avatar: "/images/avatars/budi.png", phone: "6281234567904", email: "tri@siwarga.id", houseNumber: "O14" },
  { name: "Bpk. Roni Setiawan", role: "Seksi Sarana & Prasarana", avatar: "/images/avatars/joko.png", phone: "6281234567905", email: "roni@siwarga.id", houseNumber: "P02" },
  { name: "Bpk. Hendra Wijaya", role: "Seksi Kebersihan & Lingkungan", avatar: "/images/avatars/supriyadi.png", phone: "6281234567906", email: "hendra@siwarga.id", houseNumber: "Q16" },
  { name: "Ibu Indah Permatasari", role: "Seksi Kesejahteraan Sosial", avatar: "/images/avatars/retno.png", phone: "6281234567907", email: "indah@siwarga.id", houseNumber: "R06" },
  { name: "Bpk. Yusuf Ginanjar", role: "Seksi Keagamaan", avatar: "/images/avatars/budi.png", phone: "6281234567908", email: "yusuf@siwarga.id", houseNumber: "S12" },
  { name: "Bpk. Aris Munandar", role: "Seksi Kepemudaan", avatar: "/images/avatars/joko.png", phone: "6281234567909", email: "aris@siwarga.id", houseNumber: "T05" },
];

const CARD_HEIGHT_MOBILE = 260;
const CARD_HEIGHT_DESKTOP = 320;

export function RTBoardSection() {
  const { ref: revealRef, visible } = useReveal();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const cardHeight = isMobile ? CARD_HEIGHT_MOBILE : CARD_HEIGHT_DESKTOP;

  const getSpacerWidth = () => {
    const container = scrollContainerRef.current;
    if (!container) return 0;
    const spacer = container.firstElementChild as HTMLElement | null;
    return spacer ? spacer.getBoundingClientRect().width + (isMobile ? 12 : 24) : 0;
  };

  const getStep = () => {
    const container = scrollContainerRef.current;
    if (!container) return 0;
    const card = container.children[1] as HTMLElement | null;
    return card ? card.getBoundingClientRect().width + (isMobile ? 12 : 24) : 0;
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const step = getStep();
    const spacer = getSpacerWidth();
    if (!step) return;
    const newIndex = Math.round(Math.max(0, container.scrollLeft - spacer) / step);
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
        setCurrentIndex(0);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const totalGroups = Math.ceil(boardMembers.length / 5);
  const activeGroup = Math.min(Math.floor(currentIndex / 5), totalGroups - 1);
  const arrowTopStyle = { top: `${cardHeight / 2}px`, transform: "translateY(-50%)" };

  return (
    <section id="pengurus-rt" className="py-8 md:py-10 bg-[#F8FAFC] overflow-hidden w-full relative">
      {/* Header */}
      <div className="container mx-auto max-w-275 px-4 sm:px-6 mb-8 md:mb-12">
        <div className="text-center max-w-3xl mx-auto">
          <h2
            className="font-fraunces font-semibold leading-[1.1] tracking-tight text-foreground"
            style={{ fontSize: "clamp(22px, 5vw, 42px)", letterSpacing: "-0.5px", marginBottom: "8px" }}
          >
            Struktur <em className="italic text-primary">Pengurus RT 04</em>
          </h2>
          <p className="text-sm md:text-[16px] leading-[1.6] text-muted-foreground">
            Dedikasi para pengurus untuk mewujudkan lingkungan yang rukun, bersih, aman, dan transparan.
          </p>
        </div>
      </div>

      {/* Carousel */}
      <div ref={revealRef} className="relative w-full group/carousel">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 md:w-32 bg-gradient-to-r from-[#F8FAFC] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 md:w-32 bg-gradient-to-l from-[#F8FAFC] to-transparent z-10 pointer-events-none" />

        {/* Arrow kiri */}
        <button
          onClick={scrollLeft}
          style={arrowTopStyle}
          className="absolute left-1 sm:left-4 lg:left-8 z-20 flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-border bg-white/90 shadow-md text-foreground hover:bg-white hover:text-primary hover:border-primary active:scale-95 transition-all opacity-100 sm:opacity-0 sm:group-hover/carousel:opacity-100 focus:opacity-100 cursor-pointer"
          aria-label="Previous board member"
        >
          <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
        </button>

        {/* Arrow kanan */}
        <button
          onClick={scrollRight}
          style={arrowTopStyle}
          className="absolute right-1 sm:right-4 lg:right-8 z-20 flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-border bg-white/90 shadow-md text-foreground hover:bg-white hover:text-primary hover:border-primary active:scale-95 transition-all opacity-100 sm:opacity-0 sm:group-hover/carousel:opacity-100 focus:opacity-100 cursor-pointer"
          aria-label="Next board member"
        >
          <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
        </button>

        {/* Scroll container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto gap-3 sm:gap-6 scroll-smooth snap-x snap-mandatory no-scrollbar pb-6 sm:pb-8"
          style={{ scrollPaddingLeft: "clamp(16px, 4vw, 80px)" }}
        >
          <div className="shrink-0 w-[clamp(16px,4vw,80px)]" aria-hidden="true" />

          {boardMembers.map((m, i) => (
            <div
              key={i}
              className={[
                "group/card relative flex flex-col justify-end overflow-hidden",
                "rounded-[18px] sm:rounded-[24px] border border-border bg-card",
                "transition-all duration-500 hover:-translate-y-1.5",
                "hover:shadow-[0_16px_36px_rgba(0,0,0,0.12)]",
                "h-[260px] sm:h-[320px]",
                "w-[155px] sm:w-[210px] md:w-[250px]",
                "shrink-0 snap-start",
                visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
              ].join(" ")}
              style={{ transitionDelay: `${(i % 6) * 80}ms` }}
            >
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={m.avatar}
                  alt={m.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover/card:scale-105"
                  sizes="(max-width: 640px) 155px, (max-width: 768px) 210px, 250px"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-85 transition-opacity duration-300 group-hover/card:opacity-95" />

              <div className="absolute top-3 right-3 z-10 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/10 border border-white/20 text-white backdrop-blur-md transition-all duration-300 group-hover/card:bg-white group-hover/card:text-primary group-hover/card:border-white">
                <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>

              <div className="relative p-3.5 sm:p-5 text-white z-10">
                <p
                  className="text-[9px] sm:text-[11px] font-semibold tracking-wider text-primary-foreground/90 uppercase mb-0.5 truncate"
                  title={m.role}
                >
                  {m.role}
                </p>
                <h3
                  className="font-fraunces text-[15px] sm:text-[18px] font-bold leading-tight mb-2.5 sm:mb-3 truncate"
                  title={m.name}
                >
                  {m.name}
                </h3>
                <div className="flex items-center gap-2 w-full">
                  <a
                    href={`https://wa.me/${m.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/25 border border-white/10 text-white backdrop-blur-xs transition-all hover:scale-105 active:scale-95"
                    title="Hubungi via WhatsApp"
                  >
                    <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </a>

                  <a
                    href={`mailto:${m.email}`}
                    className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/25 border border-white/10 text-white backdrop-blur-xs transition-all hover:scale-105 active:scale-95"
                    title="Hubungi via Email"
                  >
                    <Mail className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </a>

                  <span
                    className="ml-auto flex items-center gap-1 text-[9px] sm:text-[11px] font-semibold px-2 py-1 rounded bg-white/15 border border-white/10 text-white backdrop-blur-xs"
                    title={`Nomor Rumah: ${m.houseNumber}`}
                  >
                    <Home className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white/90" />
                    <span>No. {m.houseNumber}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}

          <div className="shrink-0 w-[clamp(16px,4vw,80px)]" aria-hidden="true" />
        </div>

        {/* Dot pagination */}
        <div className="flex justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-8 flex-wrap px-6 max-w-4xl mx-auto">
          {Array.from({ length: totalGroups }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToMember(index * 5)}
              className={[
                "h-2 sm:h-2.5 rounded-full transition-all duration-300 cursor-pointer",
                activeGroup === index
                  ? "w-6 sm:w-8 bg-primary"
                  : "w-2 sm:w-2.5 bg-slate-300 hover:bg-slate-400",
              ].join(" ")}
              aria-label={`Go to group ${index + 1}`}
            />
          ))}
        </div>
      </div >
    </section >
  );
}