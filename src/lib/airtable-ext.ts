import { env } from "./env.mjs";
import {
  hasAirtable,
  getBrokerageById,
  getAgents,
  createMessage,
  updateLead,
  AirtableAuthError,
} from "./airtable";
import type { AirtableBrokerage } from "./airtable";
import type { QualificationExtraction } from "./llm";

const BASE_URL = "https://api.airtable.com/v0";
const PAGE_SIZE = 100;

const TABLES = {
  Leads: env.server.AIRTABLE_TABLE_LEADS || "Leads",
  Messages: env.server.AIRTABLE_TABLE_MESSAGES || "Messages",
} as const;

function getAirtableHeaders(): HeadersInit {
  const key = env.server.AIRTABLE_API_KEY?.trim();
  const baseId = env.server.AIRTABLE_BASE_ID?.trim();
  if (!key || !baseId) {
    throw new Error("Missing Airtable env vars: AIRTABLE_API_KEY and AIRTABLE_BASE_ID required");
  }
  return {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
}

function tableUrl(tableName: string, params?: string): string {
  const baseId = env.server.AIRTABLE_BASE_ID;
  const table = encodeURIComponent(tableName);
  const url = `${BASE_URL}/${baseId}/${table}`;
  return params ? `${url}?${params}` : url;
}

/**
 * Idempotency: returns true if a message with this Twilio Message SID already exists.
 */
export async function messageExistsBySid(messageSid: string): Promise<boolean> {
  if (!hasAirtable || !messageSid?.trim()) return false;
  const escaped = messageSid.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const formula = `{Twilio Message SID} = "${escaped}"`;
  const params = new URLSearchParams();
  params.set("pageSize", "1");
  params.set("filterByFormula", formula);
  const url = tableUrl(TABLES.Messages, params.toString());
  const res = await fetch(url, { headers: getAirtableHeaders(), cache: "no-store" });
  if (!res.ok) {
    if (res.status === 401) throw new AirtableAuthError(`Airtable Messages: 401`);
    throw new Error(`Airtable Messages: ${res.status}`);
  }
  const data = (await res.json()) as { records: unknown[] };
  return Array.isArray(data.records) && data.records.length > 0;
}

export interface LeadQualificationUpdate {
  extraction: QualificationExtraction;
  status: "qualifying" | "qualified" | "assigned";
  /** 1–2 sentence summary (e.g. from LlmResult.summary). */
  summary?: string;
  qualifiedAt?: string;
  lastRoutedAt?: string;
  lastLeadMessageAt?: string;
  assignedAgentId?: string;
}

/**
 * PATCH lead with qualification fields (Intent, Timeline, Budget, etc.), status, and timestamps.
 * Uses Airtable field names: Intent, Timeline, Budget, Area, Preapproval, Beds, Baths, Price Range, Summary, Qualified At, Last Routed At, Status, Last Lead Message At, Assigned Agent.
 */
export async function updateLeadQualification(
  leadId: string,
  data: LeadQualificationUpdate
): Promise<void> {
  if (!hasAirtable) return;
  const url = `${tableUrl(TABLES.Leads)}/${leadId}`;
  const e = data.extraction;
  const fields: Record<string, unknown> = {
    Intent: e.intent || undefined,
    Timeline: e.timeline || undefined,
    Budget: e.budget || undefined,
    Area: e.area || undefined,
    Preapproval: e.preapproval || undefined,
    Beds: e.beds || undefined,
    Baths: e.baths || undefined,
    "Price Range": e.price_range || undefined,
    Summary: data.summary || undefined,
    Status: data.status,
  };
  if (data.qualifiedAt) fields["Qualified At"] = data.qualifiedAt;
  if (data.lastRoutedAt) fields["Last Routed At"] = data.lastRoutedAt;
  if (data.lastLeadMessageAt) fields["Last Lead Message At"] = data.lastLeadMessageAt;
  if (data.assignedAgentId) fields["Assigned Agent"] = [data.assignedAgentId];
  const body: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(fields)) {
    if (v !== undefined) body[k] = v;
  }
  if (Object.keys(body).length === 0) return;
  const res = await fetch(url, {
    method: "PATCH",
    headers: getAirtableHeaders(),
    body: JSON.stringify({ fields: body }),
    cache: "no-store",
  });
  if (!res.ok) {
    const err = await res.text();
    if (res.status === 401) throw new AirtableAuthError(`Airtable updateLeadQualification: 401 ${err}`);
    throw new Error(`Airtable updateLeadQualification: ${res.status} ${err}`);
  }
}

/**
 * Update lead after round-robin assignment: Assigned Agent, Assigned At, Last Routed At, Status = assigned.
 */
export async function updateLeadAssignment(
  leadId: string,
  data: { assignedAgentId: string; assignedAt: string; lastRoutedAt: string }
): Promise<void> {
  if (!hasAirtable) return;
  const url = `${tableUrl(TABLES.Leads)}/${leadId}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: getAirtableHeaders(),
    body: JSON.stringify({
      fields: {
        "Assigned Agent": [data.assignedAgentId],
        "Assigned At": data.assignedAt,
        "Last Routed At": data.lastRoutedAt,
        Status: "assigned",
      },
    }),
    cache: "no-store",
  });
  if (!res.ok) {
    const err = await res.text();
    if (res.status === 401) throw new AirtableAuthError(`Airtable updateLeadAssignment: 401 ${err}`);
    throw new Error(`Airtable updateLeadAssignment: ${res.status} ${err}`);
  }
}

/** Brokerage shape used for routing (rrPointer, rrVersion, routingEnabled, defaultAgentId). */
export type BrokerageForRouting = Pick<
  AirtableBrokerage,
  "id" | "rrPointer" | "rrVersion" | "routingEnabled" | "defaultAgentId"
>;

export async function getBrokerageForRouting(brokerageId: string): Promise<BrokerageForRouting | null> {
  if (!hasAirtable || !brokerageId?.trim()) return null;
  const b = await getBrokerageById(brokerageId);
  if (!b) return null;
  return {
    id: b.id,
    rrPointer: b.rrPointer ?? 0,
    rrVersion: b.rrVersion ?? 0,
    routingEnabled: b.routingEnabled ?? false,
    defaultAgentId: b.defaultAgentId ?? null,
  };
}

export interface AgentForRouting {
  id: string;
  fullName: string;
  phone: string;
  weight: number;
  receiveSmsAlerts: boolean;
}

/**
 * Active agents for the brokerage, optionally excluding inactive (when brokerage.excludeInactiveAgents).
 * Used to build the weighted round-robin list.
 */
export async function getActiveAgentsForRouting(brokerageId: string): Promise<AgentForRouting[]> {
  if (!hasAirtable || !brokerageId?.trim()) return [];
  const agents = await getAgents(brokerageId);
  return agents
    .filter((a) => a.status === "active")
    .map((a) => ({
      id: a.id,
      fullName: a.fullName || "—",
      phone: a.phone || "",
      weight: Math.max(1, Math.min(10, a.weight ?? 5)),
      receiveSmsAlerts: a.receiveSmsAlerts ?? false,
    }));
}

// Re-export createMessage so pipeline can ensure SID/senderType; same for updateLead when only status/lastMessageAt
export { createMessage, updateLead };
