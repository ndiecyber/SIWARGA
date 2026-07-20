"use client";

import * as React from "react";

import { toast } from "sonner";
import { ChevronsUpDown, LogOut } from "lucide-react";
import {
  HandCoinsIcon,
  HomeIcon,
  LayoutDashboardIcon,
  MegaphoneIcon,
  MonitorCogIcon,
  SettingsIcon,
  ShieldIcon,
  UsersRoundIcon,
} from "lucide-react";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { cn, getInitialName } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

import { Separator } from "../ui/separator";

const NAV_SECTIONS = [
  {
    label: "Manajemen",
    items: [
      { label: "Dashboard", icon: LayoutDashboardIcon, href: "/admin" },
      { label: "Warga", icon: UsersRoundIcon, href: "/admin/users" },
      { label: "Perumahan", icon: HomeIcon, href: "/admin/houses" },
      { label: "Pengumuman", icon: MegaphoneIcon, href: "/admin/announcement" },
      { label: "Iuran", icon: HandCoinsIcon, href: "/admin/fees" },
      { label: "Ronda", icon: ShieldIcon, href: "/admin/ronda" },
    ],
  },
  {
    label: "Settings",
    items: [{ label: "General", icon: SettingsIcon, href: "/admin/settings" }],
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
                <div className="flex items-center justify-center rounded-lg aspect-square size-8 bg-sidebar-primary text-sidebar-primary-foreground">
                  <MonitorCogIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-sm leading-tight text-left">
                  <span className="font-medium truncate">SIWARGA</span>
                  <span className="text-xs truncate">Admin Panel</span>
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
              <Avatar className="w-8 h-8 rounded-lg">
                {/*<AvatarImage src={user.avatar} alt={user.name} />*/}
                <AvatarFallback className="rounded-lg">
                  {getInitialName(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-sm leading-tight text-left">
                <span className="font-medium truncate">{user.name}</span>
                <span className="text-xs truncate">{user.email}</span>
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
                <Avatar className="w-8 h-8 rounded-lg">
                  {/*<AvatarImage src={user.avatar} alt={user.name} />*/}
                  <AvatarFallback className="rounded-lg">
                    {getInitialName(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-sm leading-tight text-left">
                  <span className="font-medium truncate">{user.name}</span>
                  <span className="text-xs truncate">{user.email}</span>
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
