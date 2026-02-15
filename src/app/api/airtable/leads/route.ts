import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { hasAirtable } from "@/lib/config";
import { getDemoLeads, addLead } from "@/lib/demo/data";
import { getDemoEnabled } from "@/app/api/auth/session/route";

const postSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  source: z.string().optional(),
  assignedTo: z.string().optional(),
  status: z.enum(["new", "contacted", "qualified", "appointment", "closed", "lost"]).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const demo = await getDemoEnabled(request);
    if (!hasAirtable || demo) {
      const leads = getDemoLeads();
      return NextResponse.json({ success: true, data: leads });
    }
    const leads = await import("@/lib/airtable").then((m) => m.getLeads());
    return NextResponse.json({ success: true, data: leads });
  } catch (err) {
    console.error("[airtable/leads GET]", err);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to fetch leads" } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const parsed = postSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.message } },
      { status: 400 }
    );
  }
  try {
    const demo = await getDemoEnabled(request);
    const body = parsed.data;
    const leadData = {
      name: body.name,
      email: body.email || "",
      phone: body.phone || "",
      source: body.source || "website",
      status: (body.status ?? "new") as
        | "new"
        | "contacted"
        | "qualified"
        | "appointment"
        | "closed"
        | "lost",
      assignedTo: body.assignedTo,
    };
    if (demo) {
      const lead = addLead(leadData);
      return NextResponse.json({ success: true, data: { created: true, lead } });
    }
    const lead = await import("@/lib/airtable").then((m) => m.createLead(leadData));
    return NextResponse.json({ success: true, data: { created: true, lead } });
  } catch (err) {
    console.error("[airtable/leads POST]", err);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to create lead" } },
      { status: 500 }
    );
  }
}
