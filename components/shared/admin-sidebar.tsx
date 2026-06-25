"use client";

import * as React from "react";
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
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Settings,
  UsersRound,
  Home,
  Megaphone,
  MonitorCog,
  HandCoinsIcon,
  Shield,
} from "lucide-react";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn, getInitialName } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const NAV_SECTIONS = [
  {
    label: "Manajemen",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
      { label: "Warga", icon: UsersRound, href: "/admin/users" },
      { label: "Perumahan", icon: Home, href: "/admin/houses" },
      { label: "Pengumuman", icon: Megaphone, href: "/admin/announcement" },
      { label: "Iuran", icon: HandCoinsIcon, href: "/admin/fees" },
      { label: "Ronda", icon: Shield, href: "/admin/ronda" },
    ],
  },
  {
    label: "Settings",
    items: [{ label: "General", icon: Settings, href: "/admin/settings" }],
  },
];

export default function AdministrationSidebar() {
  const pathname = usePathname();

  const data = authClient.useSession();

  return (
    <Sidebar collapsible="icon">
      {/* Brand header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <MonitorCog className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">SIWARGA</span>
                  <span className="truncate text-xs">Admin Panel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/*<Separator className="group-data-[collapsible=icon]:hidden" />*/}

      {/* Nav sections */}
      <SidebarContent>
        {NAV_SECTIONS.map((section) => {
          return (
            <React.Fragment key={section.label}>
              <SidebarGroup>
                <SidebarGroupLabel>{section.label}</SidebarGroupLabel>

                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item) => {
                      const key = `${section.label}-${item.label}`;
                      const Icon = item.icon;
                      const isActive = pathname === item.href;

                      return (
                        <Link key={key} href={item.href}>
                          <SidebarMenuItem>
                            <SidebarMenuButton
                              isActive={isActive}
                              tooltip={item.label}
                              className={cn(
                                "relative rounded-sm border-r-2 border-transparent transition-colors",
                                "data-[active=true]:bg-primary/10",
                                "data-[active=true]:text-primary",
                                "data-[active=true]:border-primary",
                                "data-[active=true]:font-medium",
                              )}
                            >
                              <Icon />
                              <span>{item.label}</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        </Link>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </React.Fragment>
          );
        })}
      </SidebarContent>

      {/* Footer actions */}
      <SidebarFooter>
        <Separator />
        <NavUser
          user={data.data ? data.data.user : { name: "Pengurus RT", email: "" }}
        />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
  };
}) {
  const { isMobile } = useSidebar();

  const [isSigningOut, setIsSigningOut] = React.useState(false);
  const router = useRouter();

  async function handleSignOut() {
    setIsSigningOut(true);

    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Proses Logout Berhasil", { id: "signout" });
          router.replace("/");
        },
        onRequest: () => {
          toast.loading("Logging out...", { id: "signout" });
        },
        onError: () => {
          toast.error("Proses Logout Gagal", { id: "signout" });
        },
      },
    });

    setIsSigningOut(false);
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {/*<AvatarImage src={user.avatar} alt={user.name} />*/}
                <AvatarFallback className="rounded-lg">
                  {getInitialName(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {/*<AvatarImage src={user.avatar} alt={user.name} />*/}
                  <AvatarFallback className="rounded-lg">
                    {getInitialName(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer"
              onClick={handleSignOut}
              disabled={isSigningOut}
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
