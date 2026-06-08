"use client";

import { AppSidebar } from "../shared/app-sidebar";
import Footer from "../shared/footer";
import Navbar from "../shared/navbar";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

function PublicLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <AppSidebar isShow={!isMobile} />
      <SidebarInset>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}

export default PublicLayout;
