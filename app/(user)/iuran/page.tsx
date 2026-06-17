import layoutWithAuthUser from "@/components/layouts/auth/layout-with-auth-user";
import DuesPage from "@/features/users/pages/dues-page";

function Iuran() {
  return <DuesPage />;
}

export default layoutWithAuthUser(Iuran);
