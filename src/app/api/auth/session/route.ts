import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession, getDemoEnabled as getDemoEnabledFromSession } from "@/lib/auth";
import type { Role } from "@/lib/types";

const OVERRIDE_COOKIE = "lh_session_override";
const DEMO_COOKIE_NAME = "lh_demo";

/** For API routes: get session (same as getSession() from lib/auth; kept for compatibility). */
export async function getSessionToken(
  _request?: NextRequest
): Promise<{ userId: string; role: Role; name?: string; isDemo: boolean; agentId?: string } | null> {
  return getSession();
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "No session" } },
      { status: 401 }
    );
  }
  const demoEnabled = await getDemoEnabledFromSession(session);
  return NextResponse.json({
    success: true,
    data: {
      name: session.name,
      role: session.role,
      effectiveRole: session.effectiveRole,
      userId: session.userId,
      demoEnabled,
      ...(session.agentId != null && { agentId: session.agentId }),
    },
  });
}

/** Demo is only for owners. Used by API routes that read from request. */
export async function getDemoEnabled(_request: NextRequest): Promise<boolean> {
  const session = await getSession();
  return getDemoEnabledFromSession(session);
}

const updateSessionSchema = z.object({
  name: z.string().min(0).max(200).optional(),
});

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 7,
  path: "/",
};

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Update session (name only) when already logged in — stored in override cookie. View-as role uses lh_view_as cookie set by client.
  if (body.email == null && body.password == null && body.name != null) {
    const parsed = updateSessionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.message } },
        { status: 400 }
      );
    }
    const existing = await getSession();
    if (!existing) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Not logged in" } },
        { status: 401 }
      );
    }
    const name = parsed.data.name !== undefined ? parsed.data.name.trim() : existing.name;
    const res = NextResponse.json({ success: true });
    res.cookies.set(OVERRIDE_COOKIE, JSON.stringify({ name }), cookieOptions);
    return res;
  }

  // Email/password login is handled by NextAuth Credentials — use signIn("credentials", ...) on the client
  return NextResponse.json(
    { success: false, error: { code: "BAD_REQUEST", message: "Use sign-in with NextAuth" } },
    { status: 400 }
  );
}

const VIEW_AS_COOKIE = "lh_view_as";

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(OVERRIDE_COOKIE, "", { maxAge: 0, path: "/" });
  res.cookies.set(DEMO_COOKIE_NAME, "", { maxAge: 0, path: "/" });
  res.cookies.set(VIEW_AS_COOKIE, "", { maxAge: 0, path: "/" });
  return res;
}
