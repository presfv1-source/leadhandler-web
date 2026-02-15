import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const payload = Object.fromEntries(formData.entries());
    console.log("[Twilio Webhook]", JSON.stringify(payload, null, 2));
  } catch {
    // ignore
  }
  return NextResponse.json({ received: true }, { status: 200 });
}
