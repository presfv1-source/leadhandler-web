import { sendMessage } from "./twilio";

/** Minimal agent shape for SMS notification (e.g. AgentForRouting). */
export interface AgentForNotify {
  id: string;
  phone: string;
  receiveSmsAlerts?: boolean;
}

/** Minimal lead shape for notification body (intent, area, timeline, budget, summary). */
export interface LeadForNotify {
  id: string;
  name?: string | null;
  intent?: string | null;
  area?: string | null;
  timeline?: string | null;
  budget?: string | null;
  aiSummary?: string | null;
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://leadhandler.ai";

/**
 * Send one-time SMS notification to assigned agent.
 * Only sends if agent.phone exists and agent has SMS alerts enabled (default true).
 */
export async function notifyAgent(
  agent: AgentForNotify,
  lead: LeadForNotify
): Promise<boolean> {
  const receiveSms = agent.receiveSmsAlerts ?? true;
  if (!receiveSms || !agent.phone?.trim()) {
    return false;
  }

  const intent = lead.intent?.trim() ?? "Unknown";
  const area = lead.area?.trim() ?? "Unknown";
  const timeline = lead.timeline?.trim() ?? "Unknown";
  const budget = lead.budget?.trim() ?? "Unknown";
  const summary = lead.aiSummary?.trim() ?? "No summary";
  const link = `${BASE_URL}/app/leads/${lead.id}`;

  const body = [
    `New lead`,
    `Intent: ${intent}`,
    `Area: ${area}`,
    `Timeline: ${timeline}`,
    `Budget: ${budget}`,
    `Summary: ${summary}`,
    ``,
    `View: ${link}`,
  ].join("\n");

  const result = await sendMessage(agent.phone, body, lead.id);
  if (!result.queued) {
    console.error("[agentNotify] Failed to send agent notification", {
      fn: "notifyAgent",
      agentId: agent.id,
      leadId: lead.id,
    });
  }
  return result.queued;
}
