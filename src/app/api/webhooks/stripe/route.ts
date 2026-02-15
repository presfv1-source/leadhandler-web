import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    console.log("[Stripe Webhook] payload length:", body?.length ?? 0);
  } catch {
    // ignore
  }
  return NextResponse.json({ received: true }, { status: 200 });
}
