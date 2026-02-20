export type Role = "owner" | "broker" | "agent";

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "appointment"
  | "closed"
  | "lost";

export type LeadSource = "zillow" | "realtor" | "direct" | "other";

export interface Brokerage {
  id: string;
  name: string;
  timezone: string;
  address?: string;
  phone?: string;
  createdAt?: string;
  ownerUserId?: string;
  planTier?: "essentials" | "pro";
  maxAgents?: number;
  stripeCustomerId?: string | null;
  demoMode?: boolean;
  routingMode?: "round-robin" | "weighted" | "performance";
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  active: boolean;
  avatarUrl?: string;
  brokerageId?: string;
  /** Optional close rate (0–100) for performance-based routing. */
  closeRate?: number;
  /** Optional weight (1–10) for weighted round robin. Stored in Airtable as round_robin_weight. */
  roundRobinWeight?: number;
  /** Alias for active; used in API/spec. */
  isActive?: boolean;
  /** Order in queue for round-robin. */
  routingPriority?: number;
  /** Same as roundRobinWeight (1–10) for weighted mode. */
  routingWeight?: number;
  metrics?: {
    leadsAssigned: number;
    qualifiedCount: number;
    appointmentsSet: number;
    closedCount: number;
  };
  createdAt?: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: LeadStatus;
  source: string;
  assignedTo?: string;
  assignedToName?: string;
  /** Alias for assignedTo; used in API/spec. */
  assignedAgentId?: string | null;
  brokerageId?: string;
  qualificationScore?: number;
  aiSummary?: string | null;
  lastMessageAt?: string | null;
  tags?: string[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type MessageSenderType = "ai" | "agent" | "lead";

export interface Message {
  id: string;
  direction: "in" | "out";
  body: string;
  createdAt: string;
  leadId?: string;
  from?: string;
  to?: string;
  senderType?: MessageSenderType;
  agentId?: string | null;
}

export interface Insight {
  id: string;
  leadId: string;
  summary?: string;
  nextAction?: string;
  urgency: number; // 0-100
  type?: string;
  createdAt?: string;
}

export interface DashboardStats {
  leadsToday: number;
  qualifiedRate: number;
  avgResponseTime: string;
  appointments: number;
  closedThisMonth: number;
  activeLeads: number;
}

/** Single item in the demo activity feed (recent actions). */
export type ActivityType =
  | "lead_created"
  | "message_sent"
  | "message_received"
  | "status_changed"
  | "lead_assigned";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  leadId?: string;
  leadName?: string;
  agentName?: string;
  createdAt: string;
}
