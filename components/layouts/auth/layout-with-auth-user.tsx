import { auth } from "@/lib/auth";
import { User } from "better-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type LayoutWithAuthUserProps = {
  user: User;
};

export default function layoutWithAuthUser<P extends LayoutWithAuthUserProps>(
  WrappedComponent: React.ComponentType<P>,
) {
  return async function WithAuthUser(
    props: Omit<P, keyof LayoutWithAuthUserProps>,
  ) {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      redirect("/");
    }

    if (session.user.role !== "user") {
      redirect("/admin");
    }

    return <WrappedComponent {...(props as P)} user={session.user} />;
  };
}
