import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getSession, getDemoEnabled } from "@/lib/auth";
import { getDemoAgentsAsAppType } from "@/lib/demoData";
import { AirtableAuthError } from "@/lib/airtable";
import { Skeleton } from "@/components/ui/skeleton";
import type { Agent } from "@/lib/types";
import { AgentsPageContent } from "./AgentsPageContent";

export const dynamic = "force-dynamic";

async function AgentsData() {
  const session = await getSession();
  const effectiveRole = session?.effectiveRole ?? session?.role;
  if (effectiveRole === "agent") redirect("/app/dashboard");

  let agents: Agent[] = [];
  let airtableError = false;
  const demoEnabled = await getDemoEnabled(session);

  if (demoEnabled) {
    agents = getDemoAgentsAsAppType();
  } else {
    try {
      const airtable = await import("@/lib/airtable");
      agents = await airtable.getAgents();
    } catch (err) {
      if (err instanceof AirtableAuthError) airtableError = true;
      agents = [];
    }
  }

  const showEmpty = !demoEnabled && agents.length === 0 && !airtableError;

  return (
    <AgentsPageContent
      agents={agents}
      airtableError={airtableError}
      showEmptyState={showEmpty}
    />
  );
}

export default function AgentsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-8">
          <Skeleton className="h-10 w-32" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))}
          </div>
        </div>
      }
    >
      <AgentsData />
    </Suspense>
  );
}
