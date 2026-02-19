import { Suspense } from "react";
import { getSession, getDemoEnabled } from "@/lib/auth";
import { getDemoBrokerage } from "@/lib/demo/data";
import { getDemoAgentsAsAppType } from "@/lib/demoData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { SettingsSections } from "@/components/app/SettingsSections";
import { DevTestToolsSection } from "@/components/app/DevTestToolsSection";
import type { Agent } from "@/lib/types";

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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Brokerage, account, and team
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Brokerage</CardTitle>
          <p className="text-sm text-muted-foreground">
            Your company information
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue={brokerage.name} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" defaultValue={brokerage.timezone} readOnly />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" defaultValue={brokerage.address ?? ""} readOnly />
            </div>
          </div>
        </CardContent>
      </Card>

      <SettingsSections
        session={session ? { name: session.name, email: session.email } : null}
        agents={agents}
      />

      <DevTestToolsSection
        phoneNumber={process.env.TWILIO_PHONE_NUMBER || process.env.TWILIO_FROM_NUMBER || "+1-XXX-XXX-XXXX"}
      />

      {/* Integrations section commented out per polish – uncomment to restore:
      <Card>
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
          ...
        </CardHeader>
        <CardContent>...</CardContent>
      </Card>
      */}

      {/* Demo mode card commented out per polish – uncomment to restore:
      {demoEnabled && (
        <Card>
          <CardHeader>
            <CardTitle>Demo mode</CardTitle>
            <p className="text-sm text-muted-foreground">
              Demo mode is on. Toggle in the top bar to switch to live data when integrations are connected.
            </p>
          </CardHeader>
        </Card>
      )}
      */}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-8">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
