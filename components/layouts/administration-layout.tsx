import {
  Banknote,
  BookMarked,
  LayoutDashboard,
  LucideIcon,
  Megaphone,
  PersonStanding,
  ScrollText,
  User2,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "../ui/sidebar";
import Link from "next/link";

type SidebarData = {
  title: string;
  href: string;
  icon?: LucideIcon;
  items: SidebarData[];
};

const sidebarData: SidebarData[] = [
  {
    title: "",
    href: "/",
    icon: undefined,
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
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
        title: "User",
        href: "/users",
        icon: User2,
        items: [],
      },
      {
        title: "Data Warga",
        href: "/warga",
        icon: Users,
        items: [],
      },
      {
        title: "Data Iuran",
        href: "/iuran",
        icon: Banknote,
        items: [],
      },
      {
        title: "Pengumuman",
        href: "/pengumuman",
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
        href: "/keuangan",
        icon: ScrollText,
        items: [],
      },
      {
        title: "Laporan",
        href: "/laporan",
        icon: BookMarked,
        items: [],
      },
    ],
  },
];

function RenderSidebarItem({ item }: { item: SidebarData }) {
  const Icon = item.icon;

  if (item.items.length === 0) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
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
      <SidebarGroupLabel className="text-primary-foreground/70">
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

function AdministrationLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar className="text-primary-foreground/85">
        <SidebarHeader className="bg-primary">Header</SidebarHeader>
        <SidebarContent className="bg-primary">
          <SidebarMenu>
            {sidebarData.map((item) => (
              <RenderSidebarItem key={item.title} item={item} />
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="bg-primary">Footer</SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <main>
          <SidebarTrigger />
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default AdministrationLayout;
