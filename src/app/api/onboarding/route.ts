import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionToken } from "@/lib/auth";
import { clerkClient } from "@clerk/nextjs/server";

const ONBOARDING_COOKIE = "lh_onboarding_done";

export async function GET() {
  const session = await getSessionToken();
  if (!session) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Sign in required" } },
      { status: 401 }
    );
  }
  const cookieStore = await cookies();
  const done = cookieStore.get(ONBOARDING_COOKIE)?.value === "true";
  return NextResponse.json({ success: true, data: { done } });
}

export async function POST(request: NextRequest) {
  const session = await getSessionToken(request);
  if (!session) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Sign in required" } },
      { status: 401 }
    );
  }
  if (session.role === "agent") {
    return NextResponse.json(
      { success: false, error: { code: "FORBIDDEN", message: "Agents do not complete onboarding" } },
      { status: 403 }
    );
  }
  const body = await request.json().catch(() => ({}));
  const step = body.step as number | undefined;
  const brokerage = body.brokerage as { name?: string; phone?: string; timezone?: string } | undefined;

  if (step === 1 && brokerage?.name) {
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(session.userId);
      const existing = (user.publicMetadata ?? {}) as Record<string, unknown>;
      await client.users.updateUser(session.userId, {
        publicMetadata: {
          ...existing,
          brokerageName: brokerage.name.trim(),
          brokeragePhone: (brokerage.phone ?? "").trim(),
          timezone: (brokerage.timezone ?? "America/Chicago").trim(),
        },
      });
    } catch (e) {
      console.error("[onboarding] Clerk update:", e);
    }
  }

  if (step === 4 || body.complete) {
    const res = NextResponse.json({ success: true, data: { done: true } });
    res.cookies.set(ONBOARDING_COOKIE, "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
    return res;
  }

  return NextResponse.json({ success: true, data: { step } });
}
