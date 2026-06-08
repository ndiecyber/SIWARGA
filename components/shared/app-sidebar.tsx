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
      title: "Build Your Application",
      url: "#",
      items: [
        {
          title: "Beranda",
          href: "#",
          // icon: HouseIcon,
        },
        {
          title: "Fitur",
          href: "#features",
          // icon: Sparkles,
        },
        {
          title: "Cara Kerja",
          href: "#how-it-works",
          // icon: Sparkles,
        },
        {
          title: "Modul",
          href: "#modules",
          // icon: LayoutGrid,
        },
        {
          title: "Testimoni",
          href: "#testimonials",
          // icon: LayoutGrid,
        },
        {
          title: "FAQ",
          href: "#faq",
          // icon: CircleQuestionMark,
        },
        {
          title: "Kontak",
          href: "#contact",
          // icon: PhoneIcon,
        },
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
              <p className="text-sm font-medium">Navigasi</p>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild>
                          <a href={item.href}>{item.title}</a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
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
