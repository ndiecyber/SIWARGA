"use client";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const navItems = [
  {
    title: "Beranda",
    href: "#home",
  },
  {
    title: "Fitur",
    href: "#features",
  },
  {
    title: "Cara Kerja",
    href: "#how-it-works",
  },
  {
    title: "Modul",
    href: "#modules",
  },
  {
    title: "Testimoni",
    href: "#testimonials",
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
            <ul className="flex items-center gap-4">
              {navItems.map((item) => (
                <li key={item.title}>
                  <Button variant="ghost" asChild>
                    <Link
                      href={item.href}
                      onClick={(event) => handleSmoothScroll(event, item.href)}
                    >
                      {item.title}
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-x-2">
            <Button asChild>
              <Link href="/login">
                <LogIn />
                Masuk
              </Link>
            </Button>
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
