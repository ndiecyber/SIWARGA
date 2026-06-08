import AdministrationSidebar from "../shared/admin-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";

function AdministrationLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdministrationSidebar />
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
