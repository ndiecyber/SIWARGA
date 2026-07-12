import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";
import { headers } from "next/headers";

export async function proxy(request: NextRequest) {
  const start = Date.now()
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    console.log(JSON.stringify({
      level: 'warn', time: new Date().toISOString(),
      msg: 'Akses admin ditolak — redirect ke login',
      module: 'auth', path: request.nextUrl.pathname,
      method: request.method, duration: Date.now() - start,
    }))
    return NextResponse.redirect(new URL("/", request.url));
  }

  console.log(JSON.stringify({
    level: 'info', time: new Date().toISOString(),
    msg: 'Akses admin diizinkan',
    module: 'auth', path: request.nextUrl.pathname,
    method: request.method, userId: session.user.id,
    duration: Date.now() - start,
  }))
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
