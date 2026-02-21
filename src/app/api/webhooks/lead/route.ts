import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { hasAirtable } from "@/lib/config";
import { createLead } from "@/lib/airtable";
import { triggerWebhook } from "@/lib/make";
import { assignRoundRobin } from "@/lib/routing-backend";

const schema = {
  name: (v: unknown) => typeof v === "string" && v.trim().length > 0,
  phone: (v: unknown) => typeof v === "string" && v.trim().length > 0,
  source: (v: unknown) => typeof v === "string",
  brokerageId: (v: unknown) => typeof v === "string" && v.trim().length > 0,
};

/** Public webhook for Make.com (or other) to POST new leads from Zillow/Realtor.com. */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const name = body.name?.trim();
    const phone = body.phone?.trim();
    const source = (body.source ?? "other").toString().trim().toLowerCase();
    const brokerageId = body.brokerageId?.trim();

    if (!schema.name(name) || !schema.phone(phone)) {
      return NextResponse.json(
        { success: false, error: "name and phone are required" },
        { status: 400 }
      );
    }

    if (!hasAirtable) {
      console.warn("[webhooks/lead] Airtable not configured");
      return NextResponse.json({ success: true, data: { created: false } }, { status: 200 });
    }

    const sourceNorm = ["zillow", "realtor", "direct"].includes(source) ? source : "other";
    const lead = await createLead({
      name: name!,
      phone: phone!,
      email: "",
      status: "new",
      source: sourceNorm,
      brokerageId: brokerageId ?? undefined,
    });

    await triggerWebhook({
      type: "new_lead",
      leadId: lead.id,
      name: lead.name,
      phone: lead.phone,
      source: sourceNorm,
      brokerageId: brokerageId ?? lead.brokerageId,
    });

    let assignedAgentId: string | undefined;
    if (lead.brokerageId) {
      try {
        const result = await assignRoundRobin(lead.id, lead.brokerageId);
        if (result.assignedAgentId) {
          assignedAgentId = result.assignedAgentId;
          revalidateTag("leads", "max");
          revalidateTag("agents", "max");
        }
      } catch (e) {
        console.warn("[webhooks/lead] Assignment failed (lead still created):", e);
      }
    }

    return NextResponse.json(
      { success: true, data: { created: true, leadId: lead.id, assignedAgentId } },
      { status: 200 }
    );
  } catch (err) {
    console.error("[webhooks/lead]", err);
    return NextResponse.json(
      { success: false, error: "Failed to create lead" },
      { status: 500 }
    );
  }
}
