import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getSession, getDemoEnabled } from "@/lib/auth";
import { getDemoLeadsByDay, demoAnalytics, getDemoLeadsAsAppType, getDemoAgentsAsAppType } from "@/lib/demoData";
import { PageHeader } from "@/components/app/PageHeader";
import { UpgradeCard } from "@/components/app/UpgradeCard";
import { Skeleton } from "@/components/ui/skeleton";
import { AnalyticsPageContent } from "./AnalyticsPageContent";

export const dynamic = "force-dynamic";

async function AnalyticsData() {
  const session = await getSession();
  const effectiveRole = session?.effectiveRole ?? session?.role;
  if (effectiveRole === "agent") redirect("/app/leads");

  const demoEnabled = await getDemoEnabled(session);
  const leadsByDay = demoEnabled ? getDemoLeadsByDay() : [];
  const stats = demoEnabled
    ? {
        totalLeads: demoAnalytics.totalLeads,
        avgResponseMin: demoAnalytics.avgResponseMin,
        conversionRate: demoAnalytics.conversionRate,
        responseRate: demoAnalytics.responseRate,
      }
    : { totalLeads: 0, avgResponseMin: 0, conversionRate: 0, responseRate: 0 };
  const leads = demoEnabled ? getDemoLeadsAsAppType() : [];
  const agents = demoEnabled ? getDemoAgentsAsAppType() : [];

  return (
    <AnalyticsPageContent
      demoEnabled={demoEnabled}
      stats={stats}
      leadsByDay={leadsByDay}
      leads={leads}
      agents={agents}
    />
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-8">
          <Skeleton className="h-10 w-48" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      }
    >
      <AnalyticsData />
    </Suspense>
  );
}
