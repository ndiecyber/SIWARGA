import AdministrationLayout from "@/components/layouts/administration-layout";
import layoutWithAuthAdmin, {
  LayoutWithAuthAdminProps,
} from "@/components/layouts/auth/layout-with-auth-admin";

function Layout({
  children,
}: LayoutWithAuthAdminProps & { children: React.ReactNode }) {
  return <AdministrationLayout>{children}</AdministrationLayout>;
}

export default layoutWithAuthAdmin(Layout);
