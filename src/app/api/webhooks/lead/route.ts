import { NextRequest, NextResponse } from "next/server";
import { hasAirtable } from "@/lib/config";
import { createLead } from "@/lib/airtable";
import { triggerWebhook } from "@/lib/make";

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

    return NextResponse.json({ success: true, data: { created: true, leadId: lead.id } }, { status: 200 });
  } catch (err) {
    console.error("[webhooks/lead]", err);
    return NextResponse.json(
      { success: false, error: "Failed to create lead" },
      { status: 500 }
    );
  }
}
