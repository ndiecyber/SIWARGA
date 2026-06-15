import layoutWithAuthUser from "@/components/layouts/auth/layout-with-auth-user";
import AnnouncementPage from "@/features/users/pages/announcement-page";

function Page() {
  return <AnnouncementPage />;
}

export default layoutWithAuthUser(Page);
