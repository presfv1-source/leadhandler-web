/**
 * Demo data — single source of truth is @/lib/demo/data.ts.
 * This file re-exports for backward compatibility so list and detail use the same ids (lead-1, lead-2, …).
 */
import type { Message } from "@/lib/types";
import {
  getDemoLeads,
  getDemoLeadById,
  getDemoAgents,
  getDemoMessages,
  getDemoActivity,
  getDemoDashboardStats,
  getDemoLeadsByDay,
  getDemoAnalytics,
} from "@/lib/demo/data";

export { getDemoLeadById, getDemoDashboardStats, getDemoActivity, getDemoLeadsByDay };

/** Same as getDemoLeads() — full Lead[] with lead-1, lead-2, … ids. */
export const getDemoLeadsAsAppType = getDemoLeads;

/** Same as getDemoAgents(). */
export const getDemoAgentsAsAppType = getDemoAgents;

/** Same as getDemoMessages(leadId). */
export function getDemoMessagesAsAppType(leadId?: string): Message[] {
  return getDemoMessages(leadId);
}

/** Same as getDemoLeads() for inbox/conversation list. */
export const getDemoLeadsForConversations = getDemoLeads;

/** Computed from demo leads; for analytics page. */
export const demoAnalytics = getDemoAnalytics();
