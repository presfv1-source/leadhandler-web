import { Suspense } from "react";
import { getDemoEnabled } from "@/lib/auth";
import { getDemoBrokerage } from "@/lib/demo/data";
import { getEnvSummary } from "@/lib/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Check, X, Link2 } from "lucide-react";

async function SettingsContent() {
  const [demoEnabled, brokerage, env] = await Promise.all([
    getDemoEnabled(),
    Promise.resolve(getDemoBrokerage()),
    Promise.resolve(getEnvSummary()),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Brokerage and integrations
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

      <Card>
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
          <p className="text-sm text-muted-foreground">
            Connect your tools. Each integration unlocks specific features. How to connect: add keys to .env (see README) or follow the instructions below.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Link2 className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium">Airtable</p>
                  <p className="text-sm text-muted-foreground">Leads and agents</p>
                </div>
              </div>
              {env.hasAirtable ? (
                <Badge variant="default" className="gap-1">
                  <Check className="h-3 w-3" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1">
                  <X className="h-3 w-3" />
                  Not connected
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 font-bold text-sm">S</span>
                </div>
                <div>
                  <p className="font-medium">Stripe</p>
                  <p className="text-sm text-muted-foreground">Payments</p>
                </div>
              </div>
              {env.hasStripe ? (
                <Badge variant="default" className="gap-1">
                  <Check className="h-3 w-3" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1">
                  <X className="h-3 w-3" />
                  Not connected
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <span className="text-red-600 font-bold text-sm">T</span>
                </div>
                <div>
                  <p className="font-medium">Twilio</p>
                  <p className="text-sm text-muted-foreground">SMS</p>
                </div>
              </div>
              {env.hasTwilio ? (
                <Badge variant="default" className="gap-1">
                  <Check className="h-3 w-3" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1">
                  <X className="h-3 w-3" />
                  Not connected
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-teal-100 flex items-center justify-center">
                  <span className="text-teal-600 font-bold text-sm">A</span>
                </div>
                <div>
                  <p className="font-medium">Automations</p>
                  <p className="text-sm text-muted-foreground">Trigger workflows from lead events</p>
                </div>
              </div>
              {env.hasMake ? (
                <Badge variant="default" className="gap-1">
                  <Check className="h-3 w-3" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1">
                  <X className="h-3 w-3" />
                  Not connected
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

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
