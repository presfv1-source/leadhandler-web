import { Suspense } from "react";
import { getSession, getDemoEnabled } from "@/lib/auth";
import { getDemoLeadsAsAppType, getDemoAgentsAsAppType } from "@/lib/demoData";
import { AirtableAuthError } from "@/lib/airtable";
import { EmptyState } from "@/components/app/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";
import type { Lead, Agent } from "@/lib/types";
import { LeadsPageClient } from "./LeadsPageClient";

async function LeadsContent() {
  const session = await getSession();
  const demoEnabled = await getDemoEnabled(session);
  let leads: Lead[] = [];
  let agents: Agent[] = [];
  let airtableError = false;

  if (demoEnabled) {
    leads = getDemoLeadsAsAppType();
    agents = getDemoAgentsAsAppType();
  } else {
    try {
      const airtable = await import("@/lib/airtable");
      const agentId = session?.role === "agent" ? session?.agentId : undefined;
      const [realLeads, realAgents] = await Promise.all([
        airtable.getLeads(agentId),
        airtable.getAgents(),
      ]);
      leads = realLeads ?? [];
      agents = realAgents ?? [];
    } catch (err) {
      if (err instanceof AirtableAuthError) airtableError = true;
      leads = [];
      agents = [];
    }
  }

  if (!demoEnabled && leads.length === 0 && !airtableError) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <EmptyState
          icon={Users}
          title="No leads yet"
          description="Connect your lead sources in Settings or turn on Demo Mode to see sample leads."
          action={{ label: "Go to Settings", href: "/app/settings" }}
        />
      </div>
    );
  }

  return (
    <LeadsPageClient
      leads={leads}
      agents={agents}
      airtableError={airtableError}
      demoEnabled={demoEnabled}
    />
  );
}

export default function LeadsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-8">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      }
    >
      <LeadsContent />
    </Suspense>
  );
}
