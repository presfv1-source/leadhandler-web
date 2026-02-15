import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { env } from "@/lib/env.mjs";

const COOKIE_NAME = "lh_session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/app")) {
    return NextResponse.next();
  }
  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  if (!cookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }
  try {
    await jwtVerify(cookie, new TextEncoder().encode(env.server.SESSION_SECRET));
    return NextResponse.next();
  } catch {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/app/:path*"],
};
