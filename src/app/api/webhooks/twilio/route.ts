import { NextRequest, NextResponse } from "next/server";
import { hasAirtable, hasMake, hasLlm } from "@/lib/config";
import { getLeadByPhone, createMessage, updateLead } from "@/lib/airtable";
import { triggerWebhook } from "@/lib/make";
import { handleInboundLeadSms } from "@/lib/qualification";

/** TwiML: empty response so we do not send a duplicate SMS. */
const TWIML_EMPTY = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><Response></Response>";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const from = (formData.get("From") ?? "").toString().trim();
    const to = (formData.get("To") ?? "").toString().trim();
    const body = (formData.get("Body") ?? "").toString().trim();
    const messageSid = (formData.get("MessageSid") ?? "").toString().trim();

    if (!from || !body) {
      console.warn("[Twilio Webhook] Missing From or Body");
      return new NextResponse(TWIML_EMPTY, {
        status: 200,
        headers: { "Content-Type": "text/xml; charset=utf-8" },
      });
    }

    if (!hasAirtable) {
      console.warn("[Twilio Webhook] Airtable not configured; skipping persist");
      return new NextResponse(TWIML_EMPTY, {
        status: 200,
        headers: { "Content-Type": "text/xml; charset=utf-8" },
      });
    }

    if (hasLlm) {
      await handleInboundLeadSms({ from, to, body, twilioMessageSid: messageSid });
      return new NextResponse(TWIML_EMPTY, {
        status: 200,
        headers: { "Content-Type": "text/xml; charset=utf-8" },
      });
    }

    const lead = await getLeadByPhone(from);
    if (!lead) {
      console.warn("[Twilio Webhook] No lead found for phone:", from.slice(-4));
      return new NextResponse(TWIML_EMPTY, {
        status: 200,
        headers: { "Content-Type": "text/xml; charset=utf-8" },
      });
    }

    const now = new Date().toISOString();
    await createMessage({
      leadId: lead.id,
      body,
      direction: "in",
      senderType: "lead",
      twilioMessageSid: messageSid || undefined,
    });
    await updateLead(lead.id, { lastMessageAt: now });

    if (lead.status === "new" && hasMake) {
      await triggerWebhook({
        type: "sms_received",
        leadId: lead.id,
        phone: from,
        body,
        brokerageId: lead.brokerageId,
      });
    }

    return new NextResponse(TWIML_EMPTY, {
      status: 200,
      headers: { "Content-Type": "text/xml; charset=utf-8" },
    });
  } catch (err) {
    console.error("[Twilio Webhook]", err);
    return new NextResponse(TWIML_EMPTY, {
      status: 200,
      headers: { "Content-Type": "text/xml; charset=utf-8" },
    });
  }
}
