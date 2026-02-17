import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getSession } from "@/lib/auth";
import { updateAgentRoundRobinWeight } from "@/lib/airtable";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || (session.role !== "owner" && session.role !== "broker")) {
    return NextResponse.json(
      { success: false, error: { code: "FORBIDDEN", message: "Only owner or broker can update routing" } },
      { status: 403 }
    );
  }

  let body: { weights?: Record<string, number> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "BAD_REQUEST", message: "Invalid JSON" } },
      { status: 400 }
    );
  }

  const weights = body.weights;
  if (!weights || typeof weights !== "object") {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: "weights required" } },
      { status: 400 }
    );
  }

  try {
    for (const [agentId, w] of Object.entries(weights)) {
      const n = Number(w);
      if (Number.isNaN(n) || n < 1 || n > 10) continue;
      await updateAgentRoundRobinWeight(agentId, n);
    }
    revalidateTag("agents", "max");
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[routing POST]", err);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to save routing" } },
      { status: 500 }
    );
  }
}
