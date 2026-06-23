import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
  "/admin",
  "/dashboard",
  "/iuran",
  "/pengumuman",
  "/piket",
];

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  if (isProtected && !sessionCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|manifest|robots|sitemap).*)",
  ],
};
