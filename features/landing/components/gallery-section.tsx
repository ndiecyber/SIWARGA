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

// Carousel Items (Featured Activities) - Enhanced
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

// Additional Gallery Grid Items - Enhanced
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

  // Auto scroll carousel slides
  useEffect(() => {
    if (isHovering) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slideCount);
    }, 5000);
    return () => clearInterval(timer);
  }, [slideCount, isHovering]);

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slideCount) % slideCount);
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slideCount);
  };

  const handlePhotoClick = (photo: any) => {
    setSelectedPhoto(photo);
    toast.info(`Membuka detail "${photo.title}"`);
  };

  const closeModal = () => {
    setSelectedPhoto(null);
  };

  return (
    <section id="galeri" className="relative py-12 bg-primary text-white overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative z-10 mx-auto max-w-[1200px] px-6">
        {/* Header - Enhanced with original font styles */}
        <div className="mb-12 text-center max-w-4xl mx-auto">
          <Badge className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-1.5 text-[13px] font-semibold uppercase tracking-[0.5px] bg-white/10 text-white shadow-sm">
            <Camera className="h-3.5 w-3.5" />
            Galeri Kegiatan
          </Badge>
          <h2
            className="font-fraunces font-semibold leading-[1.1] tracking-tight text-white md:whitespace-nowrap"
            style={{ fontSize: "clamp(32px, 4.5vw, 50px)", letterSpacing: "-1px", marginBottom: "8px" }}
          >
            Dokumentasi <em className="italic text-white/95">Kebersamaan Warga</em>
          </h2>
        </div>

        {/* 1. Featured Carousel Slider - Enhanced Design */}
        <div
          className="relative w-full h-[420px] md:h-[520px] rounded-3xl overflow-hidden shadow-2xl mb-16 bg-gradient-to-br from-gray-900 to-gray-800 group"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Slides Track with Ken Burns Effect */}
          <div className="relative w-full h-full">
            {carouselSlides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${activeSlide === index ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-110"
                  }`}
              >
                {/* Background Image with Parallax */}
                <div className="relative w-full h-full overflow-hidden">
                  <img
                    src={slide.imgUrl}
                    alt={slide.title}
                    className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-out ${activeSlide === index ? "scale-110" : "scale-100"
                      }`}
                  />
                </div>

                {/* Multi-layer Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent" />

                {/* Text Content with original font styles */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white z-20 transform transition-transform duration-700">
                  <div className="max-w-2xl">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[11px] font-bold tracking-wider uppercase shadow-lg">
                        {slide.category}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[11px] font-medium">
                        <Calendar className="h-3 w-3" />
                        {slide.date}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[11px] font-medium">
                        <Users className="h-3 w-3" />
                        {slide.stats}
                      </span>
                    </div>
                    <h3 className="text-xl md:text-3xl font-fraunces font-bold tracking-tight leading-tight mb-3">
                      {slide.title}
                    </h3>
                    <p className="text-sm md:text-base text-white/80 line-clamp-2">
                      Momen kebersamaan yang menunjukkan semangat gotong royong dan kekeluargaan warga RT 04.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Elegant Navigation Arrows */}
          <button
            onClick={handlePrevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 h-12 w-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:scale-110 hover:border-primary"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={handleNextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 h-12 w-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:scale-110 hover:border-primary"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Progress Bar Indicator */}
          <div className="absolute bottom-0 left-0 right-0 z-20 h-1 bg-white/20">
            <div
              className="h-full bg-primary transition-all duration-5000 ease-linear"
              style={{ width: `${((activeSlide + 1) / slideCount) * 100}%` }}
            />
          </div>

          {/* Slide Indicator Dots - Modern */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {carouselSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${activeSlide === index
                    ? "w-8 bg-primary"
                    : "w-2 bg-white/40 hover:bg-white/60"
                  }`}
              />
            ))}
          </div>
        </div>

        {/* 2. Masonry Style Gallery Grid */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="h-px w-12 bg-gradient-to-r from-white/0 to-white/60"></div>
              <h3 className="text-sm font-semibold uppercase tracking-[1px] text-white">
                Galeri Foto Lainnya
              </h3>
              <div className="h-px w-12 bg-gradient-to-l from-white/0 to-white/60"></div>
            </div>
            <Badge variant="outline" className="text-xs font-medium text-white/80 border-white/20">
              {gridPhotos.length} Momen Spesial
            </Badge>
          </div>

          <div
            ref={ref}
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-700 ${visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
          >
            {gridPhotos.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => handlePhotoClick(item)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white/5 border border-white/10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-white/20 hover:bg-white/10"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Image Container with Overlay */}
                <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-gray-950 to-gray-900">
                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                  {/* Action Buttons */}
                  <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 z-20 transform scale-95 group-hover:scale-100">
                    <div className="p-3 bg-white rounded-full text-primary shadow-lg hover:bg-primary hover:text-white-foreground hover:border hover:border-white/20 transition-all duration-300 transform hover:scale-110">
                      <ZoomIn className="h-5 w-5" />
                    </div>
                  </div>

                  <img
                    src={item.imgUrl}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Category Chip */}
                  <span className="absolute top-3 left-3 z-10 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-white border border-white/20 shadow-md">
                    {item.category}
                  </span>

                  {/* Stats Badge */}
                  <span className="absolute bottom-3 left-3 z-10 rounded-full bg-black/50 backdrop-blur-sm px-2.5 py-1 text-[10px] font-medium text-white flex items-center gap-1">
                    <Users className="h-2.5 w-2.5" />
                    {item.stats}
                  </span>
                </div>

                {/* Caption with original font styles */}
                <div className="p-4.5 text-center">
                  <h4 className="text-[13.5px] font-fraunces font-bold text-white group-hover:text-white/80 transition-colors duration-200 truncate">
                    {item.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-lg animate-in fade-in duration-300"
          onClick={closeModal}
        >
          <div className="relative max-w-5xl mx-4 animate-in zoom-in-95 duration-300">
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white hover:text-primary transition-colors text-2xl"
            >
              ✕
            </button>
            <img
              src={selectedPhoto.imgUrl}
              alt={selectedPhoto.title}
              className="max-h-[80vh] w-auto rounded-2xl shadow-2xl"
            />
            <div className="mt-4 text-center text-white">
              <h3 className="text-xl font-fraunces font-bold">{selectedPhoto.title}</h3>
              <p className="text-sm text-white/80 mt-1">{selectedPhoto.category} • {selectedPhoto.stats}</p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoom-in-95 {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-in {
          animation-duration: 0.3s;
          animation-fill-mode: both;
        }
        .fade-in { animation-name: fade-in; }
        .zoom-in-95 { animation-name: zoom-in-95; }
        .duration-5000 { transition-duration: 5000ms; }
      `}</style>
    </section>
  );
}