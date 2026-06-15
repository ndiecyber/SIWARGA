"use client";

import {
  CalendarDays,
  Home,
  Megaphone,
  ReceiptText,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/dashboard", label: "Beranda", Icon: Home, isMain: false },
  { href: "/iuran", label: "Iuran", Icon: Wallet, isMain: false },
  { href: "/bayar", label: "Bayar", Icon: ReceiptText, isMain: true },
  { href: "/pengumuman", label: "Pengumuman", Icon: Megaphone, isMain: false },
  { href: "/piket", label: "Piket", Icon: CalendarDays, isMain: false },
] as const;

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-20 mt-auto overflow-visible border-t border-border bg-background/95 backdrop-blur">
      <ul className="grid grid-cols-5 items-end px-1">
        {tabs.map(({ href, label, Icon, isMain }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <li key={href} className="relative">
              <Link
                href={href}
                className={cn(
                  "group relative flex flex-col items-center justify-end gap-0.5 py-1.5 text-[10px] font-medium text-muted-foreground transition-colors duration-200 hover:text-primary active:scale-95",
                  isMain && "pt-0",
                  isActive && "text-primary",
                )}
              >
                <span
                  className={cn(
                    "grid place-items-center transition-all duration-200 ease-out",
                    isMain
                      ? "-mt-5 size-11 rounded-full border-4 border-background bg-primary text-primary-foreground shadow-lg group-hover:-translate-y-0.5 group-hover:scale-105 group-hover:bg-primary/90 group-active:scale-95"
                      : "size-6 rounded-lg group-hover:bg-primary/10 group-hover:text-primary group-hover:scale-105",
                    !isMain && isActive && "bg-primary/10 text-primary",
                    !isMain && !isActive && "text-muted-foreground",
                  )}
                >
                  <Icon size={isMain ? 20 : 16} strokeWidth={2.2} />
                </span>

                <span
                  className={cn(
                    "leading-none transition-colors duration-200 group-hover:text-primary",
                    isMain && "mt-0.5 font-semibold text-primary",
                  )}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
