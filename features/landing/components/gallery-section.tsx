"use client";

import React, { useEffect, useRef, useState } from "react";
import { Camera, ChevronLeft, ChevronRight, Eye, ZoomIn, Calendar, Users, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

const carouselSlides = [
  {
    id: 1,
    title: "Kerja Bakti Sosial & Gotong Royong Warga",
    category: "Gotong Royong",
    stats: "120+ Partisipan",
    date: "15 Maret 2024",
    imgUrl: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Musyawarah & Rapat Bulanan Pengurus RT 04",
    category: "Musyawarah Warga",
    stats: "45 Hadirin",
    date: "22 Maret 2024",
    imgUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Pelaksanaan Siskamling Ronda Malam Warga",
    category: "Keamanan Lingkungan",
    stats: "30 Relawan",
    date: "Setiap Malam",
    imgUrl: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Kegiatan Senam Sehat Akhir Pekan",
    category: "Kesehatan Jasmani",
    stats: "75 Peserta",
    date: "Setiap Sabtu",
    imgUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000&auto=format&fit=crop",
  },
];

const gridPhotos = [
  {
    id: 5,
    title: "Perayaan HUT RI Ke-79",
    category: "Sosial Warga",
    stats: "200+ Warga",
    imgUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "Pemeriksaan Balita Posyandu",
    category: "Kesehatan Warga",
    stats: "35 Balita",
    imgUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 7,
    title: "Pemeliharaan Kebun Organik RT",
    category: "Ketahanan Pangan",
    stats: "25 Anggota",
    imgUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 8,
    title: "Buka Bersama & Silaturahmi",
    category: "Keagamaan Warga",
    stats: "150+ Peserta",
    imgUrl: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 9,
    title: "Lomba 17-an: Balap Karung",
    category: "Event Spesial",
    stats: "40 Peserta",
    imgUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 10,
    title: "Pengajian Rutin Mingguan",
    category: "Kegiatan Rohani",
    stats: "60 Jemaah",
    imgUrl: "https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 11,
    title: "Jalan Sehat Bersama",
    category: "Olahraga",
    stats: "100+ Peserta",
    imgUrl: "/images/jalan-sehat.png",
  },
  {
    id: 12,
    title: "Bakti Sosial Sembako",
    category: "Sosial",
    stats: "50 Paket",
    imgUrl: "https://images.unsplash.com/photo-1593113630400-ea4288922497?q=80&w=600&auto=format&fit=crop",
  },
];

export function GallerySection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const { ref, visible } = useReveal();
  const slideCount = carouselSlides.length;

  useEffect(() => {
    if (isHovering) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slideCount);
    }, 5000);
    return () => clearInterval(timer);
  }, [slideCount, isHovering]);

  const handlePrevSlide = () => setActiveSlide((prev) => (prev - 1 + slideCount) % slideCount);
  const handleNextSlide = () => setActiveSlide((prev) => (prev + 1) % slideCount);

  const handlePhotoClick = (photo: any) => {
    setSelectedPhoto(photo);
    toast.info(`Membuka detail "${photo.title}"`);
  };

  return (
    <section id="galeri" className="relative py-8 md:py-12 bg-primary text-white overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6">

        {/* Header */}
        <div className="mb-5 md:mb-10 text-center max-w-4xl mx-auto">
          {/* <Badge className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.5px] bg-white/10 text-white">
            <Camera className="h-3 w-3" />
            Galeri Kegiatan
          </Badge> */}
          <h2
            className="font-fraunces font-semibold leading-[1.1] tracking-tight text-white"
            style={{ fontSize: "clamp(20px, 4.5vw, 42px)", letterSpacing: "-0.5px", marginBottom: "6px" }}
          >
            Dokumentasi <em className="italic text-white/95">Kebersamaan Warga</em>
          </h2>
        </div>

        {/* ── Carousel ── */}
        <div
          className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl mb-8 md:mb-14 bg-gradient-to-br from-gray-900 to-gray-800 group"
          style={{ height: "clamp(220px, 52vw, 520px)" }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Slides */}
          <div className="relative w-full h-full">
            {carouselSlides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${activeSlide === index ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-110"
                  }`}
              >
                <div className="relative w-full h-full overflow-hidden">
                  <img
                    src={slide.imgUrl}
                    alt={slide.title}
                    className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-out ${activeSlide === index ? "scale-110" : "scale-100"
                      }`}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent" />

                {/* Slide Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 md:p-12 text-white z-20">
                  <div className="max-w-2xl">
                    {/* Badges — smaller on mobile */}
                    <div className="flex flex-wrap gap-1.5 mb-2 md:mb-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-[9px] md:text-[10px] font-bold tracking-wider uppercase shadow-lg">
                        {slide.category}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-md px-2.5 py-0.5 text-[9px] md:text-[10px] font-medium">
                        <Calendar className="h-2.5 w-2.5" />
                        {slide.date}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-md px-2.5 py-0.5 text-[9px] md:text-[10px] font-medium">
                        <Users className="h-2.5 w-2.5" />
                        {slide.stats}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-xl md:text-3xl font-fraunces font-bold tracking-tight leading-tight mb-1 md:mb-3">
                      {slide.title}
                    </h3>
                    <p className="hidden sm:block text-xs md:text-base text-white/80 line-clamp-2">
                      Momen kebersamaan yang menunjukkan semangat gotong royong dan kekeluargaan warga RT 04.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Nav Arrows — visible on tap/hover; smaller on mobile */}
          <button
            onClick={handlePrevSlide}
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 h-9 w-9 md:h-12 md:w-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:scale-110"
          >
            <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
          </button>
          <button
            onClick={handleNextSlide}
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 h-9 w-9 md:h-12 md:w-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:scale-110"
          >
            <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
          </button>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 z-20 h-[3px] bg-white/20">
            <div
              className="h-full bg-primary transition-all ease-linear"
              style={{ width: `${((activeSlide + 1) / slideCount) * 100}%`, transitionDuration: "5000ms" }}
            />
          </div>

          {/* Dots — always visible on mobile */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {carouselSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${activeSlide === index ? "w-6 bg-primary" : "w-1.5 bg-white/40 hover:bg-white/60"
                  }`}
              />
            ))}
          </div>
        </div>

        {/* ── Grid Header ── */}
        <div className="flex items-center justify-between mb-4 md:mb-7">
          <div className="flex items-center gap-2.5">
            <div className="h-px w-8 bg-gradient-to-r from-white/0 to-white/60" />
            <h3 className="text-xs font-semibold uppercase tracking-[1px] text-white">
              Galeri Foto Lainnya
            </h3>
            <div className="h-px w-8 bg-gradient-to-l from-white/0 to-white/60" />
          </div>
          <Badge variant="outline" className="text-[10px] font-medium text-white/80 border-white/20">
            {gridPhotos.length} Momen
          </Badge>
        </div>

        {/* ── Photo Grid ── */}
        {/* Mobile: 2-col tight grid | sm: 2-col | lg: 4-col */}
        <div
          ref={ref}
          className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5 transition-all duration-700 ${visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
        >
          {gridPhotos.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => handlePhotoClick(item)}
              className="group relative cursor-pointer overflow-hidden rounded-xl md:rounded-2xl bg-white/5 border border-white/10 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:border-white/20"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Image */}
              <div className="relative overflow-hidden bg-gradient-to-br from-gray-950 to-gray-900"
                style={{ height: "clamp(100px, 28vw, 224px)" }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                {/* Zoom icon on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-20">
                  <div className="p-2 md:p-3 bg-white rounded-full text-primary shadow-lg transition-all duration-300 transform hover:scale-110">
                    <ZoomIn className="h-3.5 w-3.5 md:h-5 md:w-5" />
                  </div>
                </div>

                <img
                  src={item.imgUrl}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />

                {/* Category chip */}
                <span className="absolute top-2 left-2 z-10 rounded-full bg-white/10 backdrop-blur-md px-2 py-0.5 text-[8px] md:text-[10px] font-bold text-white border border-white/20">
                  {item.category}
                </span>

                {/* Stats badge */}
                <span className="absolute bottom-2 left-2 z-10 rounded-full bg-black/50 backdrop-blur-sm px-2 py-0.5 text-[8px] md:text-[10px] font-medium text-white flex items-center gap-0.5">
                  <Users className="h-2 w-2 md:h-2.5 md:w-2.5" />
                  {item.stats}
                </span>
              </div>

              {/* Caption */}
              <div className="px-2.5 py-2 md:px-4 md:py-3 text-center">
                <h4 className="text-[11px] md:text-[13.5px] font-fraunces font-bold text-white group-hover:text-white/80 transition-colors duration-200 truncate">
                  {item.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-lg"
          style={{ animation: "fadeIn 0.3s ease both" }}
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-5xl mx-4"
            style={{ animation: "zoomIn 0.3s ease both" }}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-10 right-0 text-white hover:text-primary transition-colors text-2xl"
            >
              ✕
            </button>
            <img
              src={selectedPhoto.imgUrl}
              alt={selectedPhoto.title}
              className="max-h-[80vh] w-auto rounded-2xl shadow-2xl"
            />
            <div className="mt-3 text-center text-white">
              <h3 className="text-base md:text-xl font-fraunces font-bold">{selectedPhoto.title}</h3>
              <p className="text-xs md:text-sm text-white/80 mt-0.5">{selectedPhoto.category} · {selectedPhoto.stats}</p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes zoomIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </section>
  );
}