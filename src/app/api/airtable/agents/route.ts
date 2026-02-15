import { NextRequest, NextResponse } from "next/server";
import { hasAirtable } from "@/lib/config";
import { getDemoAgents } from "@/lib/demo/data";
import { getDemoEnabled } from "@/app/api/auth/session/route";

export async function GET(request: NextRequest) {
  try {
    const demo = await getDemoEnabled(request);
    if (!hasAirtable || demo) {
      const agents = getDemoAgents();
      return NextResponse.json({ success: true, data: agents });
    }
    const agents = await import("@/lib/airtable").then((m) => m.getAgents());
    return NextResponse.json({ success: true, data: agents });
  } catch (err) {
    console.error("[airtable/agents GET]", err);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to fetch agents" } },
      { status: 500 }
    );
  }
}
