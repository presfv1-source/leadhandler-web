import { Suspense } from "react";
import { getSession, getDemoEnabled } from "@/lib/auth";
import { getDemoBrokerage } from "@/lib/demo/data";
import { getDemoAgentsAsAppType } from "@/lib/demoData";
import { Skeleton } from "@/components/ui/skeleton";
import type { Agent } from "@/lib/types";
import { SettingsPageContent } from "./SettingsPageContent";
import { DevTestToolsSection } from "@/components/app/DevTestToolsSection";

async function SettingsContent() {
  const [session, brokerage] = await Promise.all([
    getSession(),
    Promise.resolve(getDemoBrokerage()),
  ]);
  const demoEnabled = await getDemoEnabled(session);
  let agents: Agent[] = [];
  if (demoEnabled) {
    agents = getDemoAgentsAsAppType();
  } else {
    try {
      const airtable = await import("@/lib/airtable");
      agents = await airtable.getAgents();
    } catch {
      agents = [];
    }
  }

  return (
    <SettingsPageContent
      session={session ? { name: session.name, email: session.email } : null}
      brokerage={brokerage}
      agents={agents}
      devToolsPhone={process.env.TWILIO_PHONE_NUMBER || process.env.TWILIO_FROM_NUMBER || "+1-XXX-XXX-XXXX"}
    />
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-8">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
