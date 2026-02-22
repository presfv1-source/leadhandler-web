import { NextRequest, NextResponse } from "next/server";
import { hasAirtable, hasMake, hasLlm } from "@/lib/config";
import { getLeadByPhone, createMessage, updateLead } from "@/lib/airtable";
import { messageExistsBySid } from "@/lib/airtable-ext";
import { triggerWebhook } from "@/lib/make";
import { handleInboundLeadSms } from "@/lib/qualification";
import { sendMessage } from "@/lib/twilio";

/** TwiML: empty response so we do not send a duplicate SMS. */
const TWIML_EMPTY = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><Response></Response>";

const OPT_OUT_KEYWORDS = ["stop", "stopall", "unsubscribe", "cancel", "end", "quit"];

function isOptOut(body: string): boolean {
  const normalized = body.trim().toLowerCase();
  return OPT_OUT_KEYWORDS.some((k) => normalized === k || normalized.startsWith(k + " "));
}

function twimlResponse() {
  return new NextResponse(TWIML_EMPTY, {
    status: 200,
    headers: { "Content-Type": "text/xml; charset=utf-8" },
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const from = (formData.get("From") ?? "").toString().trim();
    const to = (formData.get("To") ?? "").toString().trim();
    const body = (formData.get("Body") ?? "").toString().trim();
    const messageSid = (formData.get("MessageSid") ?? "").toString().trim();

    if (!from || !body) {
      console.warn("[Twilio Webhook] Missing From or Body");
      return twimlResponse();
    }

    if (!hasAirtable) {
      console.warn("[Twilio Webhook] Airtable not configured; skipping persist");
      return twimlResponse();
    }

    if (hasLlm) {
      await handleInboundLeadSms({ from, to, body, twilioMessageSid: messageSid });
      return twimlResponse();
    }

    // --- Non-LLM path: idempotency, STOP, do_not_contact gate, then store + Make ---
    if (messageSid) {
      const exists = await messageExistsBySid(messageSid);
      if (exists) {
        console.info("[Twilio Webhook] Duplicate MessageSid, skipping", { messageSid });
        return twimlResponse();
      }
    }

    const lead = await getLeadByPhone(from);
    if (!lead) {
      console.warn("[Twilio Webhook] No lead found for phone:", from.slice(-4));
      return twimlResponse();
    }

    if (isOptOut(body)) {
      await updateLead(lead.id, { status: "do_not_contact", lastMessageAt: new Date().toISOString() });
      await createMessage({
        leadId: lead.id,
        body,
        direction: "in",
        senderType: "lead",
        twilioMessageSid: messageSid || undefined,
      });
      await sendMessage(from, "You have been unsubscribed and will no longer receive messages. Reply START to re-subscribe.", lead.id);
      return twimlResponse();
    }

    if (lead.status === "do_not_contact") {
      await createMessage({
        leadId: lead.id,
        body,
        direction: "in",
        senderType: "lead",
        twilioMessageSid: messageSid || undefined,
      });
      return twimlResponse();
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

    return twimlResponse();
  } catch (err) {
    console.error("[Twilio Webhook]", err);
    return twimlResponse();
  }
}
