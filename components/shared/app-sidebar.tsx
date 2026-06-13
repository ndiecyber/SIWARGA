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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { LogIn } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

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
      items: [
        { title: "Fitur Unggulan", href: "#features" },
        { title: "Cara Kerja", href: "#how-it-works" },
        { title: "Modul Aplikasi", href: "#modules" },
      ],
    },
    {
      title: "Informasi & Data",
      items: [
        { title: "Data & Laporan", href: "#data-laporan" },
        { title: "Pengumuman RT", href: "#pengumuman" },
        { title: "Galeri Kegiatan", href: "#galeri" },
        // { title: "Testimoni Warga", href: "#testimonials" },
      ],
    },
    {
      title: "Lainnya",
      items: [
        // { title: "FAQ", href: "#faq" },
        { title: "Kontak", href: "#contact" },
      ],
    },
  ],
};

export function AppSidebar({
  isShow,
  ...props
}: { isShow?: boolean } & React.ComponentProps<typeof Sidebar>) {
  if (isShow) {
    return;
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="cursor-default">
              <p className="text-sm font-bold text-primary">SIWARGA</p>
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
        <Button>
          <LogIn /> Masuk
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
