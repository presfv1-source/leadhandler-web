import { Suspense } from "react";
import { getSession, getDemoEnabled } from "@/lib/auth";
import {
  getDemoDashboardStats,
  getDemoLeadsAsAppType,
  getDemoAgentsAsAppType,
  getDemoActivity,
} from "@/lib/demoData";
import { computeDashboardStatsFromLeads } from "@/lib/demo/data";
import { AirtableAuthError } from "@/lib/airtable";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3 } from "lucide-react";
import type { ActivityItem, Agent, Lead, DashboardStats } from "@/lib/types";
import { DashboardClientContent } from "./DashboardClientContent";

const DEFAULT_STATS: DashboardStats = {
  leadsToday: 0,
  qualifiedRate: 0,
  avgResponseTime: "—",
  appointments: 0,
  closedThisMonth: 0,
  activeLeads: 0,
};

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

async function DashboardContent() {
  const session = await getSession();
  const demoEnabled = await getDemoEnabled(session);
  const role = session?.role ?? "broker";
  const agentId = role === "agent" ? session?.agentId : undefined;
  const effectiveOwner = session?.effectiveRole === "owner" || session?.effectiveRole === "broker";

  let stats: DashboardStats = DEFAULT_STATS;
  let leads: Lead[] = [];
  let agents: Agent[] = [];
  let activity: ActivityItem[] = [];
  let airtableError = false;

  if (demoEnabled) {
    const demoLeads = getDemoLeadsAsAppType();
    const demoAgents = getDemoAgentsAsAppType();
    stats = getDemoDashboardStats();
    leads = demoLeads;
    agents = demoAgents;
    activity = getDemoActivity(20);
  } else {
    try {
      const airtable = await import("@/lib/airtable");
      const [realLeads, realAgents, realActivity] = await Promise.all([
        airtable.getLeads(agentId),
        airtable.getAgents(),
        airtable.getRecentActivities(20, agentId),
      ]);
      stats = computeDashboardStatsFromLeads(realLeads ?? [], role, agentId);
      leads = realLeads ?? [];
      agents = realAgents ?? [];
      activity = realActivity ?? [];
    } catch (err) {
      if (err instanceof AirtableAuthError) airtableError = true;
      stats = computeDashboardStatsFromLeads([], role, agentId);
      leads = [];
      agents = [];
      activity = [];
    }
  }

  const safeStats: DashboardStats = {
    leadsToday: Number(stats.leadsToday) ?? 0,
    qualifiedRate: Number(stats.qualifiedRate) ?? 0,
    avgResponseTime: typeof stats.avgResponseTime === "string" ? stats.avgResponseTime : "—",
    appointments: Number(stats.appointments) ?? 0,
    closedThisMonth: Number(stats.closedThisMonth) ?? 0,
    activeLeads: Number(stats.activeLeads) ?? 0,
  };

  const firstName = session?.name?.split(" ")[0] ?? "there";
  const recentLeads = role === "agent" && agentId
    ? leads.filter((l) => l.assignedTo === agentId)
    : leads.slice(0, 10);

  if (!demoEnabled && leads.length === 0 && !airtableError) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <PageHeader
          title={`${getGreeting()}, ${firstName}.`}
          subtitle="Here's what's happening at your brokerage today."
        />
        <EmptyState
          icon={BarChart3}
          title="No leads yet"
          description="Connect your lead sources in Settings to see your dashboard, or turn on Demo Mode to explore with sample data."
          action={{ label: "Go to Settings", href: "/app/settings" }}
        />
      </div>
    );
  }

  return (
    <DashboardClientContent
      isOwner={effectiveOwner}
      role={role}
      firstName={firstName}
      stats={safeStats}
      recentLeads={recentLeads}
      activity={activity}
      agents={agents}
      airtableError={airtableError}
      demoEnabled={!!demoEnabled}
    />
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-8">
          <Skeleton className="h-10 w-48" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-[300px] w-full rounded-2xl" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
