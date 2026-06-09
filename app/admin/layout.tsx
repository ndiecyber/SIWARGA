import AdministrationLayout from "@/components/layouts/administration-layout";

function Layout({ children }: { children: React.ReactNode }) {
  return <AdministrationLayout>{children}</AdministrationLayout>;
}

export default Layout;
