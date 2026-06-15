import layoutWithAuthUser, {
  LayoutWithAuthUserProps,
} from "@/components/layouts/auth/layout-with-auth-user";
import BottomNavigation from "@/features/users/components/bottom-navigation";
import { ReactNode } from "react";

function Layout({
  children,
}: LayoutWithAuthUserProps & { children: ReactNode }) {
  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-2xl flex-col bg-background shadow-[0_0_40px_-10px_oklch(0.4_0.05_270_/_0.08)]">
      <main className="flex-1 pb-2">{children}</main>
      <BottomNavigation />
    </div>
  );
}

export default layoutWithAuthUser(Layout);
