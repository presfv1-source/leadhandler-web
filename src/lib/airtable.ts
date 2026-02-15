import { hasAirtable } from "./config";
import type { Agent, Lead } from "./types";

export async function getLeads(): Promise<Lead[]> {
  if (!hasAirtable) return [];
  // TODO: fetch from Airtable
  return [];
}

export async function getAgents(): Promise<Agent[]> {
  if (!hasAirtable) return [];
  // TODO: fetch from Airtable
  return [];
}

export async function createLead(
  lead: Omit<Lead, "id" | "createdAt" | "updatedAt">
): Promise<Lead> {
  if (!hasAirtable) {
    return {
      ...lead,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
  // TODO: create in Airtable
  return {
    ...lead,
    id: `lead-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
