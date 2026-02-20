import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createWaitlistEntry } from "@/lib/airtable";

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid JSON body" } },
      { status: 400 }
    );
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.message } },
      { status: 400 }
    );
  }

  const source = `contact | ${parsed.data.message}`;
  try {
    await createWaitlistEntry(parsed.data.email, parsed.data.name, source);
  } catch (e) {
    console.error("[contact] save failed (continuing for UX):", e);
  }
  return NextResponse.json({ success: true });
}
