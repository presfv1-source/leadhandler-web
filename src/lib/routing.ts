import type { Agent, Lead } from "./types";

export type RoutingMode = "round-robin" | "weighted" | "performance";

/**
 * Assign a lead to an agent based on brokerage routing mode.
 * Skips inactive agents. Returns null if no eligible agents.
 */
export function assignLeadToAgent(
  lead: Lead,
  agents: Agent[],
  _brokerageId: string,
  mode: RoutingMode
): Agent | null {
  const active = agents.filter((a) => a.active ?? a.isActive !== false);
  if (active.length === 0) {
    console.warn("[routing] No active agents for brokerage");
    return null;
  }

  if (mode === "round-robin") {
    return roundRobinPick(active, lead);
  }
  if (mode === "weighted") {
    return weightedPick(active);
  }
  if (mode === "performance") {
    return performancePick(active);
  }
  return roundRobinPick(active, lead);
}

/** Round-robin: choose agent with fewest assigned leads (from lead.assignedTo distribution we use order as tie-break). */
function roundRobinPick(agents: Agent[], lead: Lead): Agent {
  const weight = (a: Agent) => a.metrics?.leadsAssigned ?? 0;
  const byCount = [...agents].sort((a, b) => weight(a) - weight(b));
  const minCount = weight(byCount[0]);
  const tied = byCount.filter((a) => weight(a) === minCount);
  const byPriority = tied.sort((a, b) => (a.routingPriority ?? 999) - (b.routingPriority ?? 999));
  return byPriority[0];
}

/** Weighted: proportional to routingWeight (1–10). */
function weightedPick(agents: Agent[]): Agent {
  const total = agents.reduce((s, a) => s + (a.routingWeight ?? a.roundRobinWeight ?? 5), 0);
  let r = Math.random() * total;
  for (const a of agents) {
    const w = a.routingWeight ?? a.roundRobinWeight ?? 5;
    r -= w;
    if (r <= 0) return a;
  }
  return agents[agents.length - 1];
}

/** Performance: highest close rate (or appointments conversion). */
function performancePick(agents: Agent[]): Agent {
  const score = (a: Agent) => a.closeRate ?? (a.metrics?.closedCount ?? 0) / Math.max(1, a.metrics?.leadsAssigned ?? 1) * 100;
  const sorted = [...agents].sort((a, b) => score(b) - score(a));
  return sorted[0];
}
