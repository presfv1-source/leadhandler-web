import { getLeadByPhone, getMessages, type MessageCompat } from "./airtable";
import {
  messageExistsBySid,
  updateLeadQualification,
  createMessage,
  updateLead,
  getBrokerageForRouting,
} from "./airtable-ext";
import { generateReplyAndExtract, type LlmExtracted } from "./llm";
import { sendMessage } from "./twilio";
import { assignRoundRobin } from "./routing-backend";
import type { Lead, Message } from "./types";

// ---------------------------------------------------------------------------
// Deterministic qualification guard (no LLM)
// ---------------------------------------------------------------------------

export interface QualificationResult {
  isQualified: boolean;
  status: "qualifying" | "qualified";
  summary: string | null;
}

/**
 * Deterministic qualification check.
 * A lead is "qualified" only if intent, area, and timeline are all non-empty.
 * Use after LLM extraction as a guard; not a prompt trick.
 */
export function checkQualification(lead: {
  intent?: string | null;
  area?: string | null;
  timeline?: string | null;
  budget?: string | null;
  name?: string;
}): QualificationResult {
  const hasIntent = Boolean(lead.intent?.trim());
  const hasArea = Boolean(lead.area?.trim());
  const hasTimeline = Boolean(lead.timeline?.trim());

  if (!hasIntent || !hasArea || !hasTimeline) {
    return { isQualified: false, status: "qualifying", summary: null };
  }

  const parts = [
    lead.intent?.trim(),
    `in ${lead.area?.trim()}`,
    `timeline: ${lead.timeline?.trim()}`,
  ];
  if (lead.budget?.trim()) parts.push(`budget: ${lead.budget.trim()}`);
  const summary = `${lead.name ?? "Lead"} — ${parts.join(", ")}.`;

  return { isQualified: true, status: "qualified", summary };
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

/** How many past messages to include as LLM context */
const MESSAGE_HISTORY_LIMIT = 20;

/** Statuses that should NOT trigger the AI pipeline (store message only, then return) */
const SKIP_STATUSES = new Set(["closed", "lost", "assigned", "complete", "do_not_contact"]);

/** Opt-out keywords (case-insensitive) */
const OPT_OUT_KEYWORDS = ["stop", "unsubscribe", "cancel", "end", "quit", "opt out", "optout"];

function isOptOut(body: string): boolean {
  const normalized = body.trim().toLowerCase();
  return OPT_OUT_KEYWORDS.some((k) => normalized === k || normalized.startsWith(k + " "));
}

function toMessageForLlm(m: MessageCompat): Message {
  return { id: m.id, direction: m.direction, body: m.body ?? "", createdAt: m.createdAt };
}

export interface HandleInboundParams {
  from: string;
  to: string;
  body: string;
  /** Twilio Message SID (idempotency key) */
  twilioMessageSid: string;
}

/**
 * Main pipeline: idempotency → store inbound → opt-out/assigned/closed check → LLM → reply → store outbound → update lead → route if qualified.
 */
export async function handleInboundLeadSms(params: HandleInboundParams): Promise<void> {
  const { from, to, body, twilioMessageSid } = params;
  const tag = `[qualification][${from.slice(-4)}]`;
  const now = new Date().toISOString();

  if (twilioMessageSid) {
    const exists = await messageExistsBySid(twilioMessageSid);
    if (exists) {
      console.log(`${tag} Duplicate SID ${twilioMessageSid} — skipping`);
      return;
    }
  }

  const lead = await getLeadByPhone(from);
  if (!lead) {
    console.warn(`${tag} No lead found for phone — skipping`);
    return;
  }

  const status = (lead as { status?: string }).status ?? lead.status;
  const assignedAgentId = lead.assignedTo ?? (lead as { assignedAgentId?: string }).assignedAgentId;

  await createMessage({
    leadId: lead.id,
    body,
    direction: "in",
    senderType: "lead",
    twilioMessageSid,
    fromNumber: from,
    toNumber: to,
  });
  await updateLead(lead.id, { lastMessageAt: now });

  if (SKIP_STATUSES.has(status) || assignedAgentId) {
    console.log(`${tag} Lead ${lead.id} status=${status}${assignedAgentId ? " (assigned)" : ""} — storing message only`);
    return;
  }

  if (isOptOut(body)) {
    const optOutReply =
      "You've been unsubscribed and will no longer receive messages from us. Reply START to re-subscribe anytime.";
    try {
      const sent = await sendMessage(from, optOutReply);
      await createMessage({
        leadId: lead.id,
        body: optOutReply,
        direction: "out",
        senderType: "ai",
        twilioMessageSid: sent.sid ?? "",
        fromNumber: to,
        toNumber: from,
      });
    } catch (e) {
      console.error(`${tag} Failed to send opt-out reply:`, e);
    }
    await updateLead(lead.id, {
      status: "do_not_contact",
      lastMessageAt: now,
      notes: `Opted out at ${now}`,
      intent: "opt_out",
    });
    return;
  }

  const messages = await getMessages(lead.id);
  const recentMessages = messages.slice(0, MESSAGE_HISTORY_LIMIT);
  const leadForLlm: Lead = {
    id: lead.id,
    name: lead.name ?? "",
    phone: lead.phone ?? "",
    email: lead.email ?? "",
    status: lead.status,
    source: (lead as { source?: string }).source ?? "other",
  };
  const messagesForLlm: Message[] = recentMessages.map(toMessageForLlm);

  let reply: string;
  let extraction: LlmExtracted;
  let summary = "";
  let qualified = false;

  try {
    const result = await generateReplyAndExtract({ lead: leadForLlm, messages: messagesForLlm });
    reply = result.replyText;
    extraction = result.extracted;
    summary = result.summary;
    qualified = result.isQualified;
  } catch (e) {
    console.error(`${tag} LLM error:`, e);
    reply = "Thanks for your message! Someone will follow up shortly.";
    extraction = {};
    summary = "";
  }

  let outboundSid: string | undefined;
  try {
    const sendResult = await sendMessage(from, reply);
    outboundSid = sendResult.sid;
  } catch (e) {
    console.error(`${tag} Twilio send failed:`, e);
  }

  await createMessage({
    leadId: lead.id,
    body: reply,
    direction: "out",
    senderType: "ai",
    twilioMessageSid: outboundSid ?? "",
    fromNumber: to,
    toNumber: from,
  });

  if (qualified) {
    console.log(`${tag} Lead ${lead.id} QUALIFIED`);
  }
  await updateLeadQualification(lead.id, {
    extraction,
    summary: summary || undefined,
    status: qualified ? "qualified" : "qualifying",
    qualifiedAt: qualified ? now : undefined,
    lastLeadMessageAt: now,
  });

  if (qualified && lead.brokerageId) {
    const brokerage = await getBrokerageForRouting(lead.brokerageId);
    if (brokerage?.routingEnabled) {
      try {
        await assignRoundRobin(lead.id, lead.brokerageId);
      } catch (e) {
        console.error(`${tag} assignRoundRobin failed:`, e);
      }
    }
  }
}
