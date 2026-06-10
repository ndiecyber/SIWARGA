"use client";

import {
  Banknote,
  BookMarked,
  LayoutDashboard,
  LogOut,
  LucideIcon,
  Megaphone,
  ScrollText,
  User2,
  Users,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "../ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "../ui/sidebar";
import { cn } from "@/lib/utils";

type SidebarData = {
  title: string;
  href: string;
  icon?: LucideIcon;
  items: SidebarData[];
};

const sidebarData: SidebarData[] = [
  {
    title: "",
    href: "",
    icon: undefined,
    items: [
      {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
        items: [],
      },
    ],
  },
  {
    title: "Manajemen",
    href: "",
    icon: undefined,
    items: [
      {
        title: "Data Warga",
        href: "/admin/users",
        icon: User2,
        items: [],
      },
      {
        title: "Data Iuran",
        href: "/admin/iuran",
        icon: Banknote,
        items: [],
      },
      {
        title: "Pengumuman",
        href: "/admin/announcment",
        icon: Megaphone,
        items: [],
      },
    ],
  },
  {
    title: "Keuangan",
    href: "",
    icon: undefined,
    items: [
      {
        title: "Keuangan",
        href: "/admin/keuangan",
        icon: ScrollText,
        items: [],
      },
      {
        title: "Laporan",
        href: "/admin/laporan",
        icon: BookMarked,
        items: [],
      },
    ],
  },
];

function RenderSidebarItem({ item }: { item: SidebarData }) {
  const pathName = usePathname();
  const Icon = item.icon;

  const isActive = item.href
    ? pathName === item.href
    : item.items.some((child) => pathName.startsWith(child.href));

  if (item.items.length === 0) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={isActive}
          className={cn(
            "transition-all ease-in-out text-primary-foreground/70",
            isActive ? "" : "hover:bg-white/10 hover:text-primary-foreground",
          )}
        >
          <Link href={item.href}>
            {Icon && <Icon className="size-4" />}
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-primary-foreground/60">
        {Icon && <Icon className="size-4 mr-2" />}
        {item.title}
      </SidebarGroupLabel>

      <SidebarGroupContent>
        <SidebarMenu>
          {item.items.map((child) => (
            <RenderSidebarItem
              key={`${item.title}-${child.title}`}
              item={child}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function AdministrationSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="bg-primary border-b border-b-border/25 py-8">
        Header
      </SidebarHeader>
      <SidebarContent className="bg-primary">
        <SidebarMenu>
          {sidebarData.map((item) => (
            <RenderSidebarItem key={item.title} item={item} />
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="bg-primary border-t border-t-border/25 pt-8">
        <Button
          variant="outline"
          className="bg-transparent text-primary-foreground"
        >
          <LogOut className="mr-2" /> Logout
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default AdministrationSidebar;
