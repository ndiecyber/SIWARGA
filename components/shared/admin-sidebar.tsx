"use client";

import { toast } from "sonner";
import {
  Banknote,
  BookMarked,
  Home,
  LayoutDashboard,
  LogOut,
  LucideIcon,
  Megaphone,
  ScrollText,
  User2,
  Users,
} from "lucide-react";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
      // {
      //   title: "Data Iuran",
      //   href: "/admin/iuran",
      //   icon: Banknote,
      //   items: [],
      // },
      {
        title: "Houses",
        href: "/admin/houses",
        icon: Home,
        items: [],
      },
      {
        title: "Pengumuman",
        href: "/admin/announcement",
        icon: Megaphone,
        items: [],
      },
    ],
  },
  // {
  //   title: "Keuangan",
  //   href: "",
  //   icon: undefined,
  //   items: [
  //     {
  //       title: "Keuangan",
  //       href: "/admin/keuangan",
  //       icon: ScrollText,
  //       items: [],
  //     },
  //     {
  //       title: "Laporan",
  //       href: "/admin/laporan",
  //       icon: BookMarked,
  //       items: [],
  //     },
  //   ],
  // },
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
  const router = useRouter();
  const { isPending } = authClient.useSession();

  function handleSignOut() {
    authClient.signOut();
    router.push("/");

    toast.success("Logout berhasil");
  }

  return (
    <Sidebar>
      <SidebarHeader className="bg-primary py-2">
        <div className="flex items-center justify-center bg-muted rounded-md border border-white">
          <Image
            src="/logo/logo-versi-1.png"
            alt="Logo SIWARGA"
            width={172}
            height={172}
          />
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-primary">
        <SidebarMenu>
          {sidebarData.map((item) => (
            <RenderSidebarItem key={item.title} item={item} />
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="bg-primary border-t border-t-border/25 pt-8">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="bg-transparent text-primary-foreground"
              disabled={isPending}
            >
              <LogOut className="mr-2" /> Logout
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to sign out?
              </AlertDialogTitle>
              <AlertDialogDescription>
                You will be signed out from this device.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={handleSignOut}>
                Sign out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default AdministrationSidebar;
