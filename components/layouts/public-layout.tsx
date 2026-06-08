"use client";

import Footer from "../shared/footer";
import Navbar from "../shared/navbar";
import MobileSidebar from "../shared/sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="min-h-screen">
      <MobileSidebar />
      <SidebarInset>
        <Navbar />

        <main>
          <SidebarTrigger className="md:hidden" />
          {children}
        </main>

        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}

export default PublicLayout;
