import { NextRequest, NextResponse } from "next/server";
import { getSessionToken } from "@/lib/auth";
import { createCheckout } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionToken(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Sign in to checkout" } },
        { status: 401 }
      );
    }
    if (session.role === "agent") {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Only owners can manage billing" } },
        { status: 403 }
      );
    }
    const body = await request.json().catch(() => ({}));
    const priceId = typeof body?.priceId === "string" ? body.priceId : undefined;
    const url = await createCheckout(priceId, session.userId, session.email);
    return NextResponse.json({ success: true, data: { url } });
  } catch (err) {
    console.error("[stripe/checkout POST]", err);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Checkout failed" } },
      { status: 500 }
    );
  }
}
