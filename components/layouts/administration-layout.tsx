import { CSSProperties } from "react";
import AdministrationSidebar from "../shared/admin-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";

function AdministrationLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "14rem",
          "--sidebar-width-mobile": "18rem",
        } as CSSProperties
      }
    >
      <AdministrationSidebar />
      <SidebarInset>
        <header className="w-full flex justify-between border-b border-b-border sticky top-0 z-50 py-2 px-2 bg-background">
          <SidebarTrigger layoutAdministration />
        </header>
        <main className="p-4 bg-muted/24">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default AdministrationLayout;
