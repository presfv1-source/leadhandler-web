import { NextRequest, NextResponse } from "next/server";
import { triggerWebhook } from "@/lib/make";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const result = await triggerWebhook(body);
    return NextResponse.json({
      success: result.success,
      data: { success: result.success, provider: result.success ? "make" : "stub" },
    });
  } catch (err) {
    console.error("[make/trigger POST]", err);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Trigger failed" } },
      { status: 500 }
    );
  }
}
