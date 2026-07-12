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
import { PaymentDrawer } from "./payment-drawer";

const tabs = [
  { href: "/dashboard", label: "Beranda", Icon: Home, isMain: false },
  { href: "/iuran", label: "Iuran", Icon: Wallet, isMain: false },
  { href: "/bayar", label: "Bayar", Icon: ReceiptText, isMain: true },
  { href: "/pengumuman", label: "Pengumuman", Icon: Megaphone, isMain: false },
  { href: "/piket", label: "Piket", Icon: CalendarDays, isMain: false },
] as const;

interface BottomNavigationProps {
  amount?: number;
}

export default function BottomNavigation({
  amount = 25000,
}: BottomNavigationProps) {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-20 mt-auto overflow-visible border-t border-border bg-background/95 backdrop-blur">
      <ul className="grid grid-cols-5 items-end px-1">
        {tabs.map(({ href, label, Icon, isMain }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);

          const iconWrapperClass = cn(
            "grid place-items-center transition-all duration-200 ease-out",
            isMain
              ? "-mt-5 size-11 rounded-full border-4 border-background bg-primary text-primary-foreground shadow-lg group-hover:-translate-y-0.5 group-hover:scale-105 group-hover:bg-primary/90 group-active:scale-95"
              : "size-6 rounded-lg group-hover:bg-primary/10 group-hover:text-primary group-hover:scale-105",
            !isMain && isActive && "bg-primary/10 text-primary",
            !isMain && !isActive && "text-muted-foreground",
          );

          const labelClass = cn(
            "leading-none transition-colors duration-200 group-hover:text-primary",
            isMain && "mt-0.5 font-semibold text-primary",
          );

          const content = (
            <>
              <span className={iconWrapperClass}>
                <Icon size={isMain ? 20 : 16} strokeWidth={2.2} />
              </span>
              <span className={labelClass}>{label}</span>
            </>
          );

          // dipakai untuk <Link> — style normal
          const linkClass = cn(
            "group relative flex w-full flex-col items-center justify-end gap-0.5 py-1.5 text-[10px] font-medium text-muted-foreground transition-colors duration-200 hover:text-primary active:scale-95",
            isActive && "text-primary",
          );

          // dipakai untuk <button> trigger drawer — reset semua default browser button
          const buttonClass = cn(
            linkClass,
            "pt-0 appearance-none border-0 bg-transparent p-0 m-0 cursor-pointer outline-none focus-visible:ring-0",
          );

          return (
            <li key={href} className="relative flex">
              {isMain ? (
                <PaymentDrawer amount={amount}>
                  <button type="button" className={buttonClass}>
                    {content}
                  </button>
                </PaymentDrawer>
              ) : (
                <Link href={href} className={linkClass}>
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
