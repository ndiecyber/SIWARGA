"use client";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AuthDialog } from "@/features/landing/components/auth-dialog";
import { LogIn, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const navItems = [
  {
    title: "Beranda",
    href: "#home",
  },
  {
    title: "Profil",
    items: [
      { title: "Tentang Kami", href: "#tentang-kami" },
      { title: "Pengurus RT", href: "#pengurus-rt" },
    ],
  },
  {
    title: "Layanan",
    items: [
      { title: "Fitur Unggulan", href: "#features" },
      { title: "Cara Kerja", href: "#how-it-works" },
      { title: "Modul Aplikasi", href: "#modules" },
    ],
  },
  {
    title: "Informasi",
    items: [
      { title: "Data & Laporan", href: "#data-laporan" },
      { title: "Pengumuman RT", href: "#pengumuman" },
      { title: "Galeri Kegiatan", href: "#galeri" },
      { title: "Testimoni", href: "#testimonials" },
    ],
  },
  {
    title: "FAQ",
    href: "#faq",
  },
  {
    title: "Kontak",
    href: "#contact",
  },
];

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);

  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 10);

      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSmoothScroll = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    event.preventDefault();

    const targetId = href.replace("#", "");
    const targetElement = document.getElementById(targetId);

    if (!targetElement) return;

    targetElement.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const navbarVisibilityClass = showNavbar
    ? "translate-y-0"
    : "-translate-y-full";

  const navbarBackgroundClass = isScrolled
    ? "bg-background/80 backdrop-blur-md shadow-sm border-b-border"
    : "bg-transparent border-transparent";

  return (
    <>
      {/* Desktop Navbar */}
      <header
        className={`hidden md:block fixed top-0 left-0 right-0 z-50 w-full border-b transition-all duration-300 ease-in-out
          ${navbarVisibilityClass}
          ${navbarBackgroundClass}
        `}
      >
        <div className="flex items-center justify-between w-full px-4 py-2 mx-auto max-w-275">
          <Link href="/" className="flex items-center gap-2 pl-2 pr-4">
            <Image
              src="/logo/logo-versi-1.png"
              alt="Logo"
              width={128}
              height={128}
              priority
            />
          </Link>

          <nav>
            <ul className="flex items-center gap-2 lg:gap-3">
              {navItems.map((item) => {
                if ("items" in item) {
                  return (
                    <li key={item.title} className="group relative py-2">
                      <Button
                        variant="ghost"
                        className="flex items-center gap-1 cursor-pointer select-none"
                      >
                        <span>{item.title}</span>
                        <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180 text-muted-foreground" />
                      </Button>

                      {/* Dropdown Card */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                        <div className="bg-background/95 backdrop-blur-md border border-border shadow-xl rounded-2xl p-2 min-w-[200px] flex flex-col gap-0.5">
                          {item.items?.map((subItem) => (
                            <Link
                              key={subItem.title}
                              href={subItem.href}
                              onClick={(event) =>
                                handleSmoothScroll(event, subItem.href)
                              }
                              className="w-full text-left px-3.5 py-2 text-[13px] font-medium rounded-xl transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-muted"
                            >
                              {subItem.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </li>
                  );
                }

                return (
                  <li key={item.title}>
                    <Button variant="ghost" asChild>
                      <Link
                        href={item.href}
                        onClick={(event) =>
                          handleSmoothScroll(event, item.href)
                        }
                      >
                        {item.title}
                      </Link>
                    </Button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="space-x-2">
            <AuthDialog />
          </div>
        </div>
      </header>

      {/* Mobile Navbar */}
      <header
        className={`flex md:hidden fixed top-0 left-0 right-0 z-50 h-16 shrink-0 items-center justify-between gap-2 border-b transition-all duration-300 ease-in-out
          ${navbarVisibilityClass}
          ${navbarBackgroundClass}
        `}
      >
        <div className="flex items-center gap-2 px-3">
          <Link
            href="#home"
            onClick={(event) => handleSmoothScroll(event, "#home")}
          >
            <Image
              src="/logo/logo-versi-1.png"
              alt="Logo"
              width={102}
              height={102}
              priority
            />
          </Link>
        </div>

        <div className="flex items-center gap-2 px-3">
          <SidebarTrigger />
        </div>
      </header>
    </>
  );
}

export default Navbar;
