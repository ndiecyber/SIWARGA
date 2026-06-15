"use client";

import { Bell } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function HeaderProfile() {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Selalu tampilkan header saat berada di paling atas
      if (currentScrollY < 10) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      // Scroll ke bawah = sembunyikan
      if (currentScrollY > lastScrollY.current) {
        setIsVisible(false);
      }

      // Scroll ke atas = tampilkan
      if (currentScrollY < lastScrollY.current) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-white px-4 py-4 transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="min-w-0">
        <Image
          src="/logo/logo-versi-1.png"
          alt="logo-mobile"
          width={128}
          height={128}
          priority
        />
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button className="relative grid size-8 place-items-center rounded-full bg-muted text-foreground">
          <Bell size={16} />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-destructive" />
        </button>

        <div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
          BS
        </div>
      </div>
    </header>
  );
}
