import { NextRequest, NextResponse } from "next/server";
import { hasAirtable } from "@/lib/config";
import { getDemoMessages } from "@/lib/demo/data";
import { getDemoEnabled } from "@/app/api/auth/session/route";

export async function GET(request: NextRequest) {
  try {
    const demo = await getDemoEnabled(request);
    if (!hasAirtable || demo) {
      const { searchParams } = new URL(request.url);
      const leadId = searchParams.get("leadId") ?? undefined;
      const messages = getDemoMessages(leadId);
      return NextResponse.json({ success: true, data: messages });
    }
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get("leadId") ?? undefined;
    const messages = await import("@/lib/airtable").then((m) => m.getMessages(leadId));
    return NextResponse.json({ success: true, data: messages });
  } catch (err) {
    console.error("[airtable/messages GET]", err);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to fetch messages" } },
      { status: 500 }
    );
  }
}
