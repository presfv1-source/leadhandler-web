import {
  getBrokerageForRouting,
  getActiveAgentsForRouting,
  updateLeadAssignment,
} from "./airtable-ext";
import { getLeadById, incrementBrokeragePointer } from "./airtable";
import { notifyAgent } from "./agentNotify";

/**
 * Build a weighted list of agent IDs: each agent appears `weight` times so distribution matches weights.
 */
function buildWeightedAgentList(agents: { id: string; weight: number }[]): string[] {
  const list: string[] = [];
  for (const a of agents) {
    const w = Math.max(1, Math.min(10, a.weight));
    for (let i = 0; i < w; i++) list.push(a.id);
  }
  return list;
}

/**
 * Airtable-backed round robin: pick agent at rr_pointer % weightedList.length, assign lead, increment pointer, notify agent by SMS.
 * If no active agents, uses brokerage.defaultAgentId; if still none, returns null (lead stays qualified but unassigned).
 */
export async function assignRoundRobin(
  leadId: string,
  brokerageId: string
): Promise<{ assignedAgentId: string | null }> {
  const brokerage = await getBrokerageForRouting(brokerageId);
  if (!brokerage) return { assignedAgentId: null };
  if (!brokerage.routingEnabled) return { assignedAgentId: null };

  const agents = await getActiveAgentsForRouting(brokerageId);
  let assignedAgentId: string | null = null;

  if (agents.length === 0) {
    if (brokerage.defaultAgentId) assignedAgentId = brokerage.defaultAgentId;
    if (assignedAgentId) {
      const now = new Date().toISOString();
      await updateLeadAssignment(leadId, {
        assignedAgentId,
        assignedAt: now,
        lastRoutedAt: now,
      });
    }
    return { assignedAgentId };
  }

  const weightedList = buildWeightedAgentList(agents);
  const ptr = brokerage.rrPointer ?? 0;
  const ver = brokerage.rrVersion ?? 0;
  const index = ptr % weightedList.length;
  assignedAgentId = weightedList[index] ?? null;
  if (!assignedAgentId) return { assignedAgentId: null };

  const now = new Date().toISOString();
  await updateLeadAssignment(leadId, {
    assignedAgentId,
    assignedAt: now,
    lastRoutedAt: now,
  });

  try {
    await incrementBrokeragePointer(brokerageId, ptr, ver);
  } catch (e) {
    console.error("[routing-backend] Failed to increment rr_pointer:", e);
  }

  const agent = agents.find((a) => a.id === assignedAgentId);
  if (agent?.phone && agent.receiveSmsAlerts) {
    try {
      const leadRecord = await getLeadById(leadId);
      const leadForNotify = leadRecord
        ? {
            id: leadRecord.id,
            name: leadRecord.fullName,
            intent: leadRecord.intentLabel ?? (leadRecord as { intent?: string }).intent ?? null,
            area: (leadRecord as { area?: string }).area ?? null,
            timeline: leadRecord.timeline ?? null,
            budget:
              leadRecord.budgetMin != null
                ? String(leadRecord.budgetMin)
                : leadRecord.budgetMax != null
                  ? String(leadRecord.budgetMax)
                  : null,
            aiSummary: (leadRecord as { summary?: string }).summary ?? leadRecord.notes ?? null,
          }
        : { id: leadId, name: null, intent: null, area: null, timeline: null, budget: null, aiSummary: null };
      await notifyAgent(agent, leadForNotify);
    } catch (e) {
      console.warn("[routing-backend] Agent SMS notification failed:", e);
    }
  }

  return { assignedAgentId };
}
