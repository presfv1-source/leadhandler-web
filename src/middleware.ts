import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "lh_session";
const DASHBOARD_PATH = "/app/dashboard";
const LOGIN_PATH = "/login";

function getSessionSecret(): string {
  return (
    process.env.AUTH_SECRET?.trim() ||
    process.env.NEXTAUTH_SECRET?.trim() ||
    process.env.SESSION_SECRET?.trim() ||
    ""
  );
}

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const secret = getSessionSecret();
  let validSession = false;

  if (sessionCookie && secret.length >= 16) {
    try {
      const key = new TextEncoder().encode(secret);
      await jwtVerify(sessionCookie, key);
      validSession = true;
    } catch {
      validSession = false;
    }
  }

  const pathname = request.nextUrl.pathname;
  const isApp = pathname.startsWith("/app");
  const isLogin = pathname === LOGIN_PATH;

  if (isApp && !validSession) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (isLogin && validSession) {
    const url = request.nextUrl.clone();
    url.pathname = request.nextUrl.searchParams.get("callbackUrl")?.trim() || DASHBOARD_PATH;
    url.searchParams.delete("callbackUrl");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/login"],
};
