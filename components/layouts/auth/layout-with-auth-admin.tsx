import { auth } from "@/lib/auth";
import { User } from "better-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type LayoutWithAuthAdminProps = {
  user: User;
};

export default function layoutWithAuthAdmin<P extends LayoutWithAuthAdminProps>(
  WrappedComponent: React.ComponentType<P>,
) {
  return async function WithAuthAdmin(
    props: Omit<P, keyof LayoutWithAuthAdminProps>,
  ) {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      redirect("/");
    }

    if (session.user.role !== "admin") {
      redirect("/dashboard");
    }

    return <WrappedComponent {...(props as P)} user={session.user} />;
  };
}
