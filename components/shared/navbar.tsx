"use client";

import { useEffect, useRef, useState } from "react";

import {
  ChevronDown,
  LogIn,
  LogOut,
  LucideLayoutDashboard,
} from "lucide-react";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import SignIn from "@/features/auth/pages/sign-in";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "Beranda",
    href: "#home",
  },
  {
    title: "Layanan",
    href: "#layanan",
  },
  {
    title: "Informasi",
    href: "#features",
  },
  {
    title: "Pengumuman",
    href: "#pengumuman",
  },
  {
    title: "Agenda",
    href: "#agenda",
  },
  {
    title: "Tentang",
    href: "#tentang-kami",
  },
];

function Navbar() {
  const { data: session, error } = authClient.useSession();

  function isSignedIn() {
    return !!session;
  }

  function handleSignOut() {
    authClient.signOut();
  }

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
    ? "bg-background/90 backdrop-blur-md shadow-sm border-b-border"
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
        <div className="flex items-center justify-between w-full px-6 py-3.5 mx-auto max-w-275">
          <Link href="/" className="flex items-center gap-2 pl-2">
            <Image
              src="/logo/logo-versi-1.png"
              alt="Logo"
              width={140}
              height={38}
              priority
              className="h-auto w-36 object-contain"
            />
          </Link>

          <nav>
            <ul className="flex items-center gap-1 lg:gap-2">
              {navItems.map((item) => (
                <li key={item.title}>
                  <Button
                    variant="ghost"
                    asChild
                    className="font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 px-3 py-2 rounded-lg text-sm transition-all"
                  >
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
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            {session ? (
              <Link
                href={session.user.role === "admin" ? "/admin" : "/dashboard"}
              >
                <Button variant="outline" className="gap-2">
                  <LucideLayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <SignIn>
                  <Button
                    variant="outline"
                    className="border border-input hover:bg-muted font-medium text-sm px-4 py-2 rounded-lg"
                  >
                    Masuk
                  </Button>
                </SignIn>
                <SignIn>
                  <Button
                    className="bg-primary hover:bg-primary/90 text-white font-medium text-sm px-4 py-2 rounded-lg"
                  >
                    Daftar
                  </Button>
                </SignIn>
              </div>
            )}
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
              height={28}
              priority
              className="h-auto w-28 object-contain"
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
