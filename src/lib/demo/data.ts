import type { Agent, Brokerage, DashboardStats, Lead, Message, Insight } from "@/lib/types";
import {
  getAgentNames,
  randomEmail,
  randomLeadStatus,
  randomName,
  randomPhone,
  randomSource,
  seededRandom,
} from "./seed";

const BROKERAGE: Brokerage = {
  id: "brokerage-1",
  name: "Houston Premier Realty",
  timezone: "America/Chicago",
  address: "5000 Kirby Dr, Houston, TX 77098",
  phone: "+17135551234",
  createdAt: "2024-01-15T00:00:00Z",
};

let agentsCache: Agent[] | null = null;
let leadsCache: Lead[] | null = null;
const messagesCache: Map<string, Message[]> = new Map();
const insightsCache: Map<string, Insight[]> = new Map();

function buildAgents(): Agent[] {
  if (agentsCache) return agentsCache;
  const names = getAgentNames();
  agentsCache = names.map((name, i) => {
    const id = `agent-${i + 1}`;
    const email = randomEmail(name, id);
    const phone = randomPhone(id);
    const r = seededRandom(id + "active");
    return {
      id,
      name,
      email,
      phone,
      active: r > 0.2,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`,
      brokerageId: BROKERAGE.id,
      metrics: {
        leadsAssigned: 10 + Math.floor(seededRandom(id + "l") * 40),
        qualifiedCount: Math.floor(seededRandom(id + "q") * 20),
        appointmentsSet: Math.floor(seededRandom(id + "a") * 15),
        closedCount: Math.floor(seededRandom(id + "c") * 8),
      },
      createdAt: "2024-01-15T00:00:00Z",
    };
  });
  return agentsCache;
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
    leads.push({
      id,
      name,
      phone: randomPhone(id),
      email: randomEmail(name, id),
      status,
      source,
      assignedTo: agent.id,
      assignedToName: agent.name,
      notes: i % 5 === 0 ? `Note for ${name}` : undefined,
      createdAt: `2024-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}T12:00:00Z`,
      updatedAt: new Date().toISOString(),
    });
  }
  leadsCache = leads;
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
  const bodies = [
    `Hi ${lead.name}, I saw your inquiry about properties in the Houston area.`,
    "Thanks for reaching out! I'd love to schedule a call.",
    "I'm available Tuesday or Wednesday afternoon. Which works?",
    "Wednesday at 2pm works great. I'll send a calendar invite.",
    "Here's the link to the listing: [property link]",
    "Let me know if you have any questions!",
    "I'll follow up next week with more options.",
    "Great speaking with you today!",
  ];
  const inBodies = [
    `Hi, I'm interested in homes around ${lead.source}`,
    "When can we schedule a tour?",
    "That works for me, thanks!",
    "I have a few more questions about the neighborhood",
    "What's the HOA situation?",
  ];
  const count = 4 + Math.floor(seededRandom(leadId) * 6);
  for (let i = 0; i < count; i++) {
    const dir: "in" | "out" = i % 2 === 0 ? "in" : "out";
    const body = dir === "in" ? pick(inBodies, leadId + i) : pick(bodies, leadId + i);
    msgs.push({
      id: `${base}${i}`,
      direction: dir,
      body,
      createdAt: new Date(Date.now() - (count - i) * 3600000).toISOString(),
      leadId,
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

export function getDashboardStats(role: "owner" | "agent", agentId?: string): DashboardStats {
  const leads = buildLeads();
  const agents = buildAgents();
  const today = new Date().toISOString().slice(0, 10);
  const leadsToday = leads.filter((l) => l.createdAt?.startsWith(today)).length;
  const qualified = leads.filter((l) => l.status === "qualified" || l.status === "appointment").length;
  const qualifiedRate = leads.length ? Math.round((qualified / leads.length) * 100) : 0;
  const appointments = leads.filter((l) => l.status === "appointment").length;
  const closed = leads.filter((l) => l.status === "closed").length;
  const activeLeads = leads.filter(
    (l) => l.status !== "closed" && l.status !== "lost"
  ).length;

  if (role === "agent" && agentId) {
    const myLeads = leads.filter((l) => l.assignedTo === agentId);
    const myQualified = myLeads.filter(
      (l) => l.status === "qualified" || l.status === "appointment"
    ).length;
    const myAppointments = myLeads.filter((l) => l.status === "appointment").length;
    const myClosed = myLeads.filter((l) => l.status === "closed").length;
    return {
      leadsToday: myLeads.filter((l) => l.createdAt?.startsWith(today)).length,
      qualifiedRate: myLeads.length ? Math.round((myQualified / myLeads.length) * 100) : 0,
      avgResponseTime: "12 min",
      appointments: myAppointments,
      closedThisMonth: myClosed,
      activeLeads: myLeads.filter(
        (l) => l.status !== "closed" && l.status !== "lost"
      ).length,
    };
  }

  return {
    leadsToday,
    qualifiedRate,
    avgResponseTime: "8 min",
    appointments,
    closedThisMonth: closed,
    activeLeads,
  };
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
