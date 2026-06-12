"use client";

import { useEffect, useRef, useState } from "react";
import { Users, Mail, Phone } from "lucide-react";
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
    desc: "Memimpin koordinasi antar-warga, mewakili RT dalam hubungan eksternal, dan mengawasi jalannya seluruh kegiatan lingkungan.",
    avatar: "/images/avatars/supriyadi.png",
    phone: "6281234567890",
    email: "supriyadi@siwarga.id",
  },
  {
    name: "Ibu Retno Lestari",
    role: "Sekretaris RT 04",
    desc: "Mengelola administrasi surat-menyurat, pencatatan kependudukan, dokumentasi rapat warga, dan pelaporan berkala.",
    avatar: "/images/avatars/retno.png",
    phone: "6281234567891",
    email: "retno@siwarga.id",
  },
  {
    name: "Bpk. Budi Santoso",
    role: "Bendahara RT 04",
    desc: "Mengelola keuangan RT secara transparan, mencatat iuran warga, dan menyusun laporan pemasukan/pengeluaran bulanan.",
    avatar: "/images/avatars/budi.png",
    phone: "6281234567892",
    email: "budi@siwarga.id",
  },
  {
    name: "Bpk. Joko Susilo",
    role: "Seksi Keamanan & Ketertiban",
    desc: "Mengoordinasikan jadwal siskamling, berkolaborasi dengan petugas keamanan warga, dan menjaga ketertiban lingkungan.",
    avatar: "/images/avatars/joko.png",
    phone: "6281234567893",
    email: "joko@siwarga.id",
  },
];

export function RTBoardSection() {
  const { ref, visible } = useReveal();

  return (
    <section id="pengurus-rt" className="py-[88px] bg-[#F8FAFC]">
      <div className="container mx-auto max-w-[1100px] px-6">
        <div className="mb-14 text-center">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[.4px] text-primary">
            <Users className="h-3.5 w-3.5" />
            Pengurus RT 04
          </div>
          <h2
            className="font-fraunces font-semibold leading-[1.1] tracking-tight text-foreground"
            style={{
              fontSize: "clamp(38px, 5.5vw, 62px)",
              letterSpacing: "-1px",
              marginBottom: "20px",
            }}
          >
            Struktur
            <br />
            <em className="italic text-primary">Pengurus RT 04</em>
          </h2>
          <p className="mx-auto mt-4 max-w-[540px] text-[17px] leading-[1.7] text-muted-foreground">
            Dedikasi para pengurus untuk mewujudkan lingkungan yang rukun, bersih, aman, dan transparan.
          </p>
        </div>

        <div
          ref={ref}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {boardMembers.map((m, i) => (
            <div
              key={m.name}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.05)] ${
                visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div>
                {/* Profile Picture */}
                <div className="relative mx-auto mb-5 h-[190px] w-full overflow-hidden rounded-xl bg-muted">
                  <Image
                    src={m.avatar}
                    alt={m.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-w-768px) 100vw, 250px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>

                {/* Role Badge */}
                <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary mb-2">
                  {m.role}
                </span>

                {/* Name */}
                <h3 className="mb-2 font-fraunces text-[18px] font-bold text-foreground">
                  {m.name}
                </h3>

                {/* Description */}
                <p className="text-[13px] leading-[1.65] text-muted-foreground">
                  {m.desc}
                </p>
              </div>

              {/* Contact Icons */}
              <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <a
                  href={`https://wa.me/${m.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-all hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                  title="Hubungi via WhatsApp"
                >
                  <Phone className="h-4 w-4" />
                </a>
                <a
                  href={`mailto:${m.email}`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-all hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                  title="Hubungi via Email"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
