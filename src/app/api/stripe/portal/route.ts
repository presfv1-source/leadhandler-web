import { NextResponse } from "next/server";
import { createPortal } from "@/lib/stripe";

export async function POST() {
  try {
    const url = await createPortal();
    return NextResponse.json({ success: true, data: { url } });
  } catch (err) {
    console.error("[stripe/portal POST]", err);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Portal failed" } },
      { status: 500 }
    );
  }
}
