import { NextResponse } from "next/server";
import { createCheckout } from "@/lib/stripe";

export async function POST() {
  try {
    const url = await createCheckout();
    return NextResponse.json({ success: true, data: { url } });
  } catch (err) {
    console.error("[stripe/checkout POST]", err);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Checkout failed" } },
      { status: 500 }
    );
  }
}
