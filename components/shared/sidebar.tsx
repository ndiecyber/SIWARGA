import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarRail,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  HouseIcon,
  LucideIcon,
  PhoneIcon,
  CircleQuestionMark,
  Star,
  LayoutGrid,
  ListOrdered,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { fraunces } from "@/lib/fonts";
import { Button } from "../ui/button";

interface NavbarProps {
  title: string;
  href: string;
  icon: LucideIcon;
}

const navbarItems: NavbarProps[] = [
  {
    title: "Beranda",
    href: "/",
    icon: HouseIcon,
  },
  {
    title: "Fitur",
    href: "/features",
    icon: Sparkles,
  },
  {
    title: "Modul",
    href: "/about",
    icon: LayoutGrid,
  },
  {
    title: "FAQ",
    href: "/contact",
    icon: CircleQuestionMark,
  },
  {
    title: "Kontak",
    href: "/about",
    icon: PhoneIcon,
  },
];

function MobileSidebar({
  className,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      side="left"
      collapsible="offcanvas"
      className={cn("md:hidden h-svh max-h-svh", className)}
      {...props}
    >
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2 pl-2 pr-4">
          <div className="p-2 rounded-md bg-primary text-primary-foreground">
            <HouseIcon size={24} />
          </div>
          <div className="flex flex-col items-start gap-1">
            <h1 className={cn(fraunces.className, "text-xl font-bold")}>
              Logo
            </h1>
            <span className="text-xs font-semibold text-muted-foreground">
              RT 04 RW 02
            </span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-1 overflow-y-auto">
        <SidebarGroup>
          <SidebarMenu>
            {navbarItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton>
                  <item.icon className="w-4 h-4 mr-2" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <span></span>
        <div role="group" className="space-y-2">
          <Button variant="default" className="w-full">
            Masuk
          </Button>
          <Button variant="secondary" className="w-full">
            Registrasi
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default MobileSidebar;
