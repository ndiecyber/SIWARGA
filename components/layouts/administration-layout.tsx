import AdministrationSidebar from "../shared/admin-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";

function AdministrationLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdministrationSidebar />
      <SidebarInset>
        <header className="w-full flex justify-between border-b border-b-border sticky top-0 z-50 py-4 px-2">
          <SidebarTrigger />
        </header>
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default AdministrationLayout;
