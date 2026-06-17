import layoutWithAuthUser from "@/components/layouts/auth/layout-with-auth-user";
import PatrolPage from "@/features/users/pages/announcement-page copy";

function Page() {
  return <PatrolPage />;
}

export default layoutWithAuthUser(Page);
