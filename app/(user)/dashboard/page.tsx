import layoutWithAuthUser from "@/components/layouts/auth/layout-with-auth-user";
import DashboardPage from "@/features/users/pages/dashboard-page";

function Page() {
  return <DashboardPage />;
}

export default layoutWithAuthUser(Page);
