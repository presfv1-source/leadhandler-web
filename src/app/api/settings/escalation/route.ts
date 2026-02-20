import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";
import { getSession } from "@/lib/auth";

type ClerkMetadata = {
  role?: string;
  agentId?: string;
  brokerageName?: string;
  brokeragePhone?: string;
  timezone?: string;
  escalationTarget?: string;
  escalationMinutes?: number;
};

export async function GET() {
  const session = await getSession();
  if (!session || (session.role !== "owner" && session.role !== "broker")) {
    return NextResponse.json(
      { success: false, error: { code: "FORBIDDEN", message: "Only owner or broker can view escalation settings" } },
      { status: 403 }
    );
  }

  const user = await currentUser();
  if (!user?.id) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Sign in required" } },
      { status: 401 }
    );
  }

  const meta = (user.publicMetadata ?? {}) as ClerkMetadata;
  return NextResponse.json({
    success: true,
    data: {
      escalationTarget: typeof meta.escalationTarget === "string" ? meta.escalationTarget : "",
      escalationMinutes:
        typeof meta.escalationMinutes === "number" && meta.escalationMinutes >= 5
          ? meta.escalationMinutes
          : 30,
    },
  });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || (session.role !== "owner" && session.role !== "broker")) {
    return NextResponse.json(
      { success: false, error: { code: "FORBIDDEN", message: "Only owner or broker can update escalation settings" } },
      { status: 403 }
    );
  }

  const user = await currentUser();
  if (!user?.id) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Sign in required" } },
      { status: 401 }
    );
  }

  let body: { escalationTarget?: string; escalationMinutes?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "BAD_REQUEST", message: "Invalid JSON" } },
      { status: 400 }
    );
  }

  const escalationTarget =
    typeof body.escalationTarget === "string" ? body.escalationTarget.trim() : "";
  const rawMinutes = body.escalationMinutes;
  const escalationMinutes =
    typeof rawMinutes === "number" && !Number.isNaN(rawMinutes) && rawMinutes >= 5
      ? Math.min(1440, Math.round(rawMinutes))
      : 30;

  const existing = (user.publicMetadata ?? {}) as ClerkMetadata;
  try {
    const clerk = await clerkClient();
    await clerk.users.updateUser(user.id, {
      publicMetadata: {
        ...existing,
        escalationTarget: escalationTarget || undefined,
        escalationMinutes,
      },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[escalation POST]", err);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to save escalation settings" } },
      { status: 500 }
    );
  }
}
