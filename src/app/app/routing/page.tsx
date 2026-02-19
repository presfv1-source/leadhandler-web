import { redirect } from "next/navigation";
import { getSession, getDemoEnabled } from "@/lib/auth";
import { getAgents } from "@/lib/airtable";
import { getDemoAgentsAsAppType } from "@/lib/demoData";
import type { Agent } from "@/lib/types";
import { AirtableAuthError } from "@/lib/airtable";
import { AirtableErrorFallback } from "@/components/app/AirtableErrorFallback";
import { RoutingPageContent } from "./RoutingPageContent";

export const dynamic = "force-dynamic";

export default async function RoutingPage() {
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
      agents = await getAgents();
    } catch {
      agents = [];
      airtableError = true;
    }
  }

  return (
    <RoutingPageContent
      agents={agents}
      demoEnabled={!!demoEnabled}
      airtableError={airtableError}
    />
  );
}
