import layoutWithAuthAdmin, {
  LayoutWithAuthAdminProps,
} from "@/components/layouts/auth/layout-with-auth-admin";

function Page({ user }: LayoutWithAuthAdminProps) {
  return (
    <>
      <h1>Admin Page</h1>
    </>
  );
}

export default layoutWithAuthAdmin(Page);
