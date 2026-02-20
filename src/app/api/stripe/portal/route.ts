import { NextResponse } from "next/server";
import { getSessionToken } from "@/lib/auth";
import { createPortal } from "@/lib/stripe";

export async function POST() {
  try {
    const session = await getSessionToken();
    if (!session) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Sign in to manage billing" } },
        { status: 401 }
      );
    }
    if (session.role === "agent") {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Only owners can manage billing" } },
        { status: 403 }
      );
    }
    const url = await createPortal(session.userId, session.email);
    return NextResponse.json({ success: true, data: { url } });
  } catch (err) {
    console.error("[stripe/portal POST]", err);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Portal failed" } },
      { status: 500 }
    );
  }
}
