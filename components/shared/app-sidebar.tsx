"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { LogIn, LucideLayoutDashboard } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import SignIn from "@/features/auth/pages/sign-in";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const data = {
  navMain: [
    {
      title: "Utama",
      items: [{ title: "Beranda", href: "#home" }],
    },
    {
      title: "Profil RT",
      items: [
        { title: "Tentang Kami", href: "#tentang-kami" },
        { title: "Pengurus RT", href: "#pengurus-rt" },
      ],
    },
    {
      title: "Layanan & Fitur",
      items: [{ title: "Fitur Unggulan", href: "#features" }],
    },
    {
      title: "Informasi & Data",
      items: [
        { title: "Data & Laporan", href: "#data-laporan" },
        { title: "Pengumuman RT", href: "#pengumuman" },
        { title: "Galeri Kegiatan", href: "#galeri" },
      ],
    },
  ],
};

export function AppSidebar({
  isShow,
  ...props
}: { isShow?: boolean } & React.ComponentProps<typeof Sidebar>) {
  const { data: session } = authClient.useSession();
  if (isShow) {
    return;
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="cursor-default">
              <p className="text-sm font-bold text-primary">
                <span className="text-green-400">Si</span>
                <span className="text-indigo-800">WARGA</span>
              </p>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup
            key={group.title}
            className="px-4 py-2 border-b border-border/40 last:border-0"
          >
            <p className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              {group.title}
            </p>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="hover:text-primary transition-colors text-xs font-semibold py-1"
                  >
                    <a href={item.href}>{item.title}</a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
      <Separator />
      <SidebarFooter>
        <div className="grid">
          {session ? (
            <Link
              href={session.user.role === "admin" ? "/admin" : "/dashboard"}
              className="w-full"
            >
              <Button variant="outline" className="w-full">
                <LucideLayoutDashboard />
                Dashboard
              </Button>
            </Link>
          ) : (
            <SignIn>
              <Button>
                <LogIn /> Masuk
              </Button>
            </SignIn>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
