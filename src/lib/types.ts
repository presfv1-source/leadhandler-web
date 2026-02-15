export type Role = "owner" | "agent";

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "appointment"
  | "closed"
  | "lost";

export interface Brokerage {
  id: string;
  name: string;
  timezone: string;
  address?: string;
  phone?: string;
  createdAt?: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  active: boolean;
  avatarUrl?: string;
  brokerageId?: string;
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
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  id: string;
  direction: "in" | "out";
  body: string;
  createdAt: string;
  leadId?: string;
  from?: string;
  to?: string;
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
