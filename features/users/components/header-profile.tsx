"use client";

import { getInitialName } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type HeaderProfileProps = {
  name: string;
};

export default function HeaderProfile(props: HeaderProfileProps) {
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

        <ProfileDropdown name={props.name} />
      </div>
    </header>
  );
}

type ProfileDropdownProps = {
  name?: string | null;
};

function ProfileDropdown({ name }: ProfileDropdownProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);

    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.replace("/");
        },
      },
    });

    setIsSigningOut(false);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full p-0"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {getInitialName(name)}
          </span>
          <span className="sr-only">Buka menu profil</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{name ?? "Warga"}</span>
            <span className="text-xs font-normal text-muted-foreground">
              Akun warga
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleSignOut}
          disabled={isSigningOut}
          variant="destructive"
          className="cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isSigningOut ? "Keluar..." : "Keluar"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
