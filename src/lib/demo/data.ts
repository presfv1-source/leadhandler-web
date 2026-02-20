import type {
  ActivityItem,
  Agent,
  Brokerage,
  DashboardStats,
  Lead,
  Message,
  Insight,
  Role,
} from "@/lib/types";
import {
  getAgentNames,
  randomEmail,
  randomHoustonNeighborhood,
  randomLeadStatus,
  randomName,
  randomPhone,
  randomRecentDate,
  randomSource,
  randomTimeOfDay,
  seededRandom,
} from "./seed";

const BROKERAGE: Brokerage = {
  id: "brokerage-1",
  name: "Houston Premier Realty",
  timezone: "America/Chicago",
  address: "5000 Kirby Dr, Houston, TX 77098",
  phone: "+17135551234",
  createdAt: "2024-01-15T00:00:00Z",
  planTier: "pro",
  maxAgents: 10,
  routingMode: "round-robin",
};

let agentsCache: Agent[] | null = null;
let leadsCache: Lead[] | null = null;
const messagesCache: Map<string, Message[]> = new Map();
const insightsCache: Map<string, Insight[]> = new Map();

/** First 4 agents use spec names (Houston); rest from seed. */
const FIXED_AGENT_NAMES = ["Sarah Mitchell", "Marcus Johnson", "Ashley Chen", "Tyler Brooks"];

function buildAgents(): Agent[] {
  if (agentsCache) return agentsCache;
  const seedNames = getAgentNames();
  agentsCache = seedNames.map((name, i) => {
    const id = `agent-${i + 1}`;
    const displayName = i < FIXED_AGENT_NAMES.length ? FIXED_AGENT_NAMES[i] : name;
    const email = randomEmail(displayName, id);
    const phone = randomPhone(id);
    const r = seededRandom(id + "active");
    const active = i < 3 ? true : r > 0.2; // Tyler Brooks (index 3) sometimes inactive
    const routingWeight = i < 4 ? [5, 4, 3, 2][i] : Math.min(10, Math.max(1, Math.floor(seededRandom(id + "w") * 10)));
    return {
      id,
      name: displayName,
      email,
      phone,
      active,
      isActive: active,
      routingPriority: i + 1,
      roundRobinWeight: routingWeight,
      routingWeight,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=6366f1&color=fff`,
      brokerageId: BROKERAGE.id,
      metrics: {
        leadsAssigned: 0,
        qualifiedCount: 0,
        appointmentsSet: 0,
        closedCount: 0,
      },
      createdAt: "2024-01-15T00:00:00Z",
    };
  });
  return agentsCache;
}

/** Recompute each agent's metrics from actual lead counts so KPIs match. */
function computeAgentMetricsFromLeads(leads: Lead[], agents: Agent[]): void {
  for (const agent of agents) {
    const assigned = leads.filter((l) => l.assignedTo === agent.id);
    agent.metrics = {
      leadsAssigned: assigned.length,
      qualifiedCount: assigned.filter(
        (l) => l.status === "qualified" || l.status === "appointment"
      ).length,
      appointmentsSet: assigned.filter((l) => l.status === "appointment").length,
      closedCount: assigned.filter((l) => l.status === "closed").length,
    };
  }
}

function buildLeads(): Lead[] {
  if (leadsCache) return leadsCache;
  const agents = buildAgents();
  const leads: Lead[] = [];
  for (let i = 0; i < 65; i++) {
    const id = `lead-${i + 1}`;
    const name = randomName(id);
    const status = randomLeadStatus(id);
    const source = randomSource(id);
    const agentIdx = Math.floor(seededRandom(id + "agent") * agents.length);
    const agent = agents[agentIdx];
    const dateStr = randomRecentDate(id, { daysBack: 30, todayWeight: 0.12 });
    const timeStr = randomTimeOfDay(id);
    const createdAt = `${dateStr}T${timeStr}:00.000Z`;
    const neighborhood = randomHoustonNeighborhood(id + "n");
    const notes =
      i % 4 === 0
        ? `Interested in ${neighborhood}.`
        : i % 5 === 0
          ? `Note for ${name}`
          : undefined;
    const qualScore = 20 + Math.floor(seededRandom(id + "q") * 80);
    const aiSummary =
      i % 3 === 0
        ? `Buyer. ${i % 2 === 0 ? "3BR" : "4BR"} budget $${300 + (i % 5) * 50}k. Timeline ${i % 4 === 0 ? "60 days" : "90 days"}. ${qualScore > 70 ? "High intent." : "Early stage."}`
        : undefined;
    leads.push({
      id,
      name,
      phone: randomPhone(id),
      email: randomEmail(name, id),
      status,
      source,
      assignedTo: agent.id,
      assignedToName: agent.name,
      assignedAgentId: agent.id,
      brokerageId: BROKERAGE.id,
      qualificationScore: qualScore,
      aiSummary: aiSummary ?? null,
      lastMessageAt: createdAt,
      tags: i % 5 === 0 ? ["hot"] : [],
      notes,
      createdAt,
      updatedAt: createdAt,
    });
  }
  leadsCache = leads;
  computeAgentMetricsFromLeads(leads, agents);
  return leads;
}

function buildMessagesForLead(leadId: string): Message[] {
  const cached = messagesCache.get(leadId);
  if (cached) return cached;
  const leads = buildLeads();
  const lead = leads.find((l) => l.id === leadId);
  if (!lead) return [];
  const msgs: Message[] = [];
  const base = `msg-${leadId}-`;
  const area = randomHoustonNeighborhood(leadId + "area");
  const bodies = [
    `Hi ${lead.name}, I saw your inquiry about properties in ${area}.`,
    "Thanks for reaching out! I'd love to schedule a call.",
    "I'm available Tuesday or Wednesday afternoon. Which works?",
    "Wednesday at 2pm works great. I'll send a calendar invite.",
    "Here's the link to the listing — great area near downtown.",
    "Let me know if you have any questions!",
    "I'll follow up next week with more options.",
    "Great speaking with you today!",
  ];
  const inBodies = [
    `Hi, I'm interested in homes in ${area}.`,
    "When can we schedule a tour?",
    "That works for me, thanks!",
    "I have a few more questions about the neighborhood",
    "What's the HOA situation?",
  ];
  const count = 4 + Math.floor(seededRandom(leadId) * 6);
  const now = Date.now();
  const agentId = lead?.assignedTo ?? undefined;
  for (let i = 0; i < count; i++) {
    const dir: "in" | "out" = i % 2 === 0 ? "in" : "out";
    const body = dir === "in" ? pick(inBodies, leadId + i) : pick(bodies, leadId + i);
    const r = seededRandom(leadId + "msgT" + i);
    const offsetMs = 2 * 60 * 1000 + r * (36 * 60 * 60 * 1000);
    const senderType = dir === "in" ? ("lead" as const) : i === 1 ? ("ai" as const) : ("agent" as const);
    msgs.push({
      id: `${base}${i}`,
      direction: dir,
      body,
      createdAt: new Date(now - offsetMs).toISOString(),
      leadId,
      senderType,
      agentId: dir === "out" && senderType === "agent" ? agentId : null,
    });
  }
  msgs.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  messagesCache.set(leadId, msgs);
  return msgs;
}

function pick<T>(arr: T[], key: string): T {
  const h = arr.reduce((a, c) => a + String(c).length, 0);
  const idx = Math.abs(h + key.length) % arr.length;
  return arr[idx];
}

function buildInsightsForLead(leadId: string): Insight[] {
  const cached = insightsCache.get(leadId);
  if (cached) return cached;
  const urgency = 20 + Math.floor(seededRandom(leadId) * 70);
  const insights: Insight[] = [
    {
      id: `insight-${leadId}-1`,
      leadId,
      summary: `Lead showing strong interest. Engaged via ${seededRandom(leadId) > 0.5 ? "email" : "SMS"}.`,
      nextAction: urgency > 70 ? "Schedule property tour" : "Send follow-up within 24h",
      urgency,
      type: "engagement",
      createdAt: new Date().toISOString(),
    },
    {
      id: `insight-${leadId}-2`,
      leadId,
      summary: "Budget and location preferences documented.",
      nextAction: "Prepare matching listings",
      urgency: Math.floor(urgency * 0.8),
      type: "preference",
      createdAt: new Date().toISOString(),
    },
  ];
  insightsCache.set(leadId, insights);
  return insights;
}

export function getDemoBrokerage(): Brokerage {
  return BROKERAGE;
}

export function getDemoAgents(): Agent[] {
  return buildAgents();
}

export function getDemoLeads(): Lead[] {
  return buildLeads();
}

export function getDemoLeadById(id: string): Lead | null {
  return buildLeads().find((l) => l.id === id) ?? null;
}

export function getDemoMessages(leadId?: string): Message[] {
  if (leadId) return buildMessagesForLead(leadId);
  const leads = buildLeads();
  const leadIdsWithMessages = leads.slice(0, 14).map((l) => l.id);
  const all: Message[] = [];
  for (const lid of leadIdsWithMessages) {
    all.push(...buildMessagesForLead(lid));
  }
  all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return all.slice(0, 20);
}

export function getDemoInsights(leadId: string): Insight[] {
  return buildInsightsForLead(leadId);
}

/** Build activity feed from leads + messages; KPIs and thread are consistent. */
export function getDemoActivity(limit = 25): ActivityItem[] {
  const leads = buildLeads();
  const agents = buildAgents();
  const allMessages = getDemoMessages();
  const leadById = new Map(leads.map((l) => [l.id, l]));
  const agentById = new Map(agents.map((a) => [a.id, a]));

  const activities: ActivityItem[] = [];

  for (const lead of leads) {
    const agentName = lead.assignedToName ?? agentById.get(lead.assignedTo ?? "")?.name;
    activities.push({
      id: `activity-lead-${lead.id}`,
      type: "lead_created",
      title: "Lead added",
      description: lead.source,
      leadId: lead.id,
      leadName: lead.name,
      agentName,
      createdAt: lead.createdAt ?? new Date().toISOString(),
    });
  }

  for (const msg of allMessages) {
    const lead = msg.leadId ? leadById.get(msg.leadId) : undefined;
    const activityType: ActivityItem["type"] = msg.direction === "out" ? "message_sent" : "message_received";
    activities.push({
      id: `activity-msg-${msg.id}`,
      type: activityType,
      title: msg.direction === "out" ? "Message sent" : "Message received",
      description: lead ? `To ${lead.name}` : msg.body.slice(0, 40) + (msg.body.length > 40 ? "…" : ""),
      leadId: msg.leadId,
      leadName: lead?.name,
      createdAt: msg.createdAt,
    });
  }

  activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return activities.slice(0, limit);
}

const thisMonthPrefix = new Date().toISOString().slice(0, 7); // YYYY-MM

/** Compute dashboard KPIs from a list of leads. Used by demo and by real-data dashboard. */
export function computeDashboardStatsFromLeads(
  leads: Lead[],
  role: Role,
  agentId?: string
): DashboardStats {
  const today = new Date().toISOString().slice(0, 10);
  const slice = role === "agent" && agentId ? leads.filter((l) => l.assignedTo === agentId) : leads;
  const leadsToday = slice.filter((l) => l.createdAt?.startsWith(today)).length;
  const qualified = slice.filter((l) => l.status === "qualified" || l.status === "appointment").length;
  const qualifiedRate = slice.length ? Math.round((qualified / slice.length) * 100) : 0;
  const appointments = slice.filter((l) => l.status === "appointment").length;
  const closedThisMonth = slice.filter(
    (l) => l.status === "closed" && (l.createdAt?.startsWith(thisMonthPrefix) ?? false)
  ).length;
  const activeLeads = slice.filter((l) => l.status !== "closed" && l.status !== "lost").length;
  const avgResponseTime = role === "agent" && agentId ? "12 min" : "8 min";
  return {
    leadsToday,
    qualifiedRate,
    avgResponseTime,
    appointments,
    closedThisMonth,
    activeLeads,
  };
}

export function getDashboardStats(role: Role, agentId?: string): DashboardStats {
  return computeDashboardStatsFromLeads(buildLeads(), role, agentId);
}

/** Alias for dashboard when demo; uses owner role. */
export function getDemoDashboardStats(): DashboardStats {
  return getDashboardStats("owner");
}

/** Analytics aggregates from demo leads (for analytics page). */
export function getDemoAnalytics(): {
  totalLeads: number;
  avgResponseMin: number;
  conversionRate: number;
  responseRate: number;
} {
  const leads = buildLeads();
  const qualified = leads.filter(
    (l) => l.status === "qualified" || l.status === "appointment" || l.status === "closed"
  ).length;
  return {
    totalLeads: leads.length,
    avgResponseMin: 3,
    conversionRate: leads.length ? Math.round((qualified / leads.length) * 100) : 0,
    responseRate: 95,
  };
}

/** Leads per day for last 7 days (for chart); derived from demo leads. */
export function getDemoLeadsByDay(): { date: string; label: string; leads: number }[] {
  const leads = buildLeads();
  const days: { date: string; label: string; leads: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const label = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()];
    const count = leads.filter((l) => l.createdAt?.startsWith(dateStr)).length;
    days.push({ date: dateStr, label, leads: count });
  }
  return days;
}

export function appendMessage(leadId: string, body: string, direction: "in" | "out" = "out"): Message {
  const msgs = messagesCache.get(leadId) ?? buildMessagesForLead(leadId);
  const msg: Message = {
    id: `msg-${leadId}-${Date.now()}`,
    direction,
    body,
    createdAt: new Date().toISOString(),
    leadId,
  };
  msgs.push(msg);
  messagesCache.set(leadId, msgs);
  return msg;
}

export function addLead(lead: Omit<Lead, "id" | "createdAt" | "updatedAt">): Lead {
  const leads = buildLeads();
  const id = `lead-${Date.now()}`;
  const newLead: Lead = {
    ...lead,
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  leads.push(newLead);
  leadsCache = leads;
  return newLead;
}
