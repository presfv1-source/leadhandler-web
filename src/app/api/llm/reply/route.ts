import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateReplyAndExtract } from "@/lib/llm";
import { env } from "@/lib/env.mjs";

const messageSchema = z.object({
  id: z.string(),
  direction: z.enum(["in", "out"]),
  body: z.string(),
  createdAt: z.string(),
});

const leadSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  email: z.string(),
  status: z.enum(["new", "contacted", "qualified", "appointment", "closed", "lost"]),
  source: z.string(),
});

const postSchema = z.object({
  lead: leadSchema,
  messages: z.array(messageSchema),
});

function checkLlmAuth(request: NextRequest): boolean {
  const key = env.server.LLM_API_KEY;
  if (!key) return true;
  const headerKey = request.headers.get("x-api-key");
  const bearer = request.headers.get("authorization");
  const token = bearer?.startsWith("Bearer ") ? bearer.slice(7) : null;
  return (headerKey !== null && headerKey === key) || (token !== null && token === key);
}

export async function POST(request: NextRequest) {
  if (!checkLlmAuth(request)) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Invalid or missing API key" } },
      { status: 401 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid JSON body" } },
      { status: 400 }
    );
  }

  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.message } },
      { status: 400 }
    );
  }

  try {
    const result = await generateReplyAndExtract({
      lead: parsed.data.lead,
      messages: parsed.data.messages,
    });
    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "LLM request failed";
    const isConfig = message.includes("not set") || message.includes("No LLM API key");
    console.error("[api/llm/reply POST]", err);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: isConfig ? "CONFIG_ERROR" : "SERVER_ERROR",
          message: isConfig ? "LLM not configured" : "Failed to generate reply",
        },
      },
      { status: isConfig ? 503 : 500 }
    );
  }
}
