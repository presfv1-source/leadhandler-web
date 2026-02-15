import { Suspense } from "react";
import { getSession, getDemoEnabled } from "@/lib/auth";
import {
  getDashboardStats,
  getDemoLeads,
  getDemoMessages,
  getDemoAgents,
  getDemoActivity,
  getDemoLeadsByDay,
  computeDashboardStatsFromLeads,
} from "@/lib/demo/data";
import { PageHeader } from "@/components/app/PageHeader";
import { StatCard } from "@/components/app/StatCard";
import { SectionCard } from "@/components/app/SectionCard";
import { LeadStatusPill } from "@/components/app/LeadStatusPill";
import { ResponsiveDataList } from "@/components/app/ResponsiveDataList";
import { EmptyState } from "@/components/app/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { LeadActivityChart } from "@/components/app/LeadActivityChart";
import { ActivityFeed } from "@/components/app/ActivityFeed";
import { type ColumnDef } from "@tanstack/react-table";
import type { ActivityItem, Agent, Lead, DashboardStats } from "@/lib/types";
import { BarChart3 } from "lucide-react";
import Link from "next/link";

const DEFAULT_STATS: DashboardStats = {
  leadsToday: 0,
  qualifiedRate: 0,
  avgResponseTime: "—",
  appointments: 0,
  closedThisMonth: 0,
  activeLeads: 0,
};

async function DashboardContent() {
  const [session, demoEnabled] = await Promise.all([getSession(), getDemoEnabled()]);
  const role = session?.role ?? "agent";
  const agentId = role === "agent" ? session?.userId : undefined;

  let stats: DashboardStats = DEFAULT_STATS;
  let leads: Lead[] = [];
  let messages: { id: string; direction: "in" | "out"; body: string; createdAt: string }[] = [];
  let agents: Agent[] = [];
  let activity: ActivityItem[] = [];
  let leadsByDay: { date: string; label: string; leads: number }[] = [];

  if (demoEnabled) {
    const demoLeads = getDemoLeads();
    const demoAgents = getDemoAgents();
    stats = getDashboardStats(role, agentId);
    leads = demoLeads;
    messages = getDemoMessages().slice(0, 5);
    agents = demoAgents;
    activity = getDemoActivity(20);
    leadsByDay = getDemoLeadsByDay();
  } else {
    try {
      const airtable = await import("@/lib/airtable");
      const [realLeads, realAgents, realMessages] = await Promise.all([
        airtable.getLeads(),
        airtable.getAgents(),
        airtable.getMessages(),
      ]);
      stats = computeDashboardStatsFromLeads(realLeads ?? [], role, agentId);
      leads = realLeads ?? [];
      messages = (realMessages ?? []).slice(0, 5).map((m) => ({
        id: m.id,
        direction: m.direction,
        body: m.body,
        createdAt: m.createdAt,
      }));
      agents = realAgents ?? [];
    } catch {
      stats = computeDashboardStatsFromLeads([], role, agentId);
      leads = [];
      messages = [];
      agents = [];
    }
  }

  stats = stats ?? DEFAULT_STATS;
  leads = Array.isArray(leads) ? leads : [];
  messages = Array.isArray(messages) ? messages : [];
  agents = Array.isArray(agents) ? agents : [];
  activity = Array.isArray(activity) ? activity : [];
  leadsByDay = Array.isArray(leadsByDay) ? leadsByDay : [];

  // Guarantee stats is a valid DashboardStats (all fields defined, no NaN)
  const safeStats: DashboardStats = {
    leadsToday: Number(stats.leadsToday) || 0,
    qualifiedRate: Number(stats.qualifiedRate) || 0,
    avgResponseTime: typeof stats.avgResponseTime === "string" ? stats.avgResponseTime : "—",
    appointments: Number(stats.appointments) || 0,
    closedThisMonth: Number(stats.closedThisMonth) || 0,
    activeLeads: Number(stats.activeLeads) || 0,
  };
  stats = safeStats;

  // Normalize messages: only valid objects, stable keys and required fields
  const rawMessages = messages.filter((m) => m != null && typeof m === "object");
  messages = rawMessages.map((m, i) => ({
    id: typeof (m as { id?: unknown }).id === "string" ? (m as { id: string }).id : `msg-${i}`,
    direction: (m as { direction?: string }).direction === "in" ? "in" : "out",
    body: typeof (m as { body?: unknown }).body === "string" ? (m as { body: string }).body : "",
    createdAt:
      typeof (m as { createdAt?: unknown }).createdAt === "string"
        ? (m as { createdAt: string }).createdAt
        : new Date().toISOString(),
  }));

  // Normalize activity: stable keys, valid ActivityType, required fields for ActivityFeed
  const VALID_ACTIVITY_TYPES: ActivityItem["type"][] = [
    "lead_created",
    "message_sent",
    "message_received",
    "status_changed",
    "lead_assigned",
  ];
  const rawActivity = activity.filter((a) => a != null && typeof a === "object");
  activity = rawActivity.map((a, i) => {
    const type = VALID_ACTIVITY_TYPES.includes((a as ActivityItem).type) ? (a as ActivityItem).type : "lead_created";
    return {
      id: typeof (a as { id?: unknown }).id === "string" ? (a as { id: string }).id : `activity-${i}`,
      type,
      title: typeof (a as { title?: unknown }).title === "string" ? (a as { title: string }).title : "",
      description: (a as ActivityItem).description,
      leadId: (a as ActivityItem).leadId,
      leadName: (a as ActivityItem).leadName,
      agentName: (a as ActivityItem).agentName,
      createdAt:
        typeof (a as { createdAt?: unknown }).createdAt === "string"
          ? (a as { createdAt: string }).createdAt
          : new Date().toISOString(),
    } satisfies ActivityItem;
  });

  // Normalize leadsByDay: ensure { date, label, leads } for LeadActivityChart
  leadsByDay = leadsByDay.map((d, i) => ({
    date: typeof d?.date === "string" ? d.date : new Date().toISOString().slice(0, 10),
    label: typeof d?.label === "string" ? d.label : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i % 7] ?? "—",
    leads: Number(d?.leads) || 0,
  }));

  const agentFilterId = demoEnabled ? "agent-1" : session?.userId;
  const myLeads = agentFilterId ? leads.filter((l) => l.assignedTo === agentFilterId) : [];

  if (!demoEnabled && leads.length === 0) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <PageHeader title="Dashboard" subtitle={`Welcome back, ${session?.name ?? "User"}`} />
        <EmptyState
          icon={BarChart3}
          title="No data yet"
          description="Connect your lead sources in Settings to see your dashboard. Or turn on Demo Mode to explore with example data."
          action={{ label: "Go to Settings", href: "/app/settings" }}
        />
      </div>
    );
  }

  const agentColumns: ColumnDef<Agent>[] = [
    { accessorKey: "name", header: "Agent" },
    {
      accessorKey: "metrics.leadsAssigned",
      header: "Leads",
      cell: ({ row }) => row.original.metrics?.leadsAssigned ?? 0,
    },
    {
      accessorKey: "metrics.qualifiedCount",
      header: "Qualified",
      cell: ({ row }) => row.original.metrics?.qualifiedCount ?? 0,
    },
    {
      accessorKey: "metrics.appointmentsSet",
      header: "Appointments",
      cell: ({ row }) => row.original.metrics?.appointmentsSet ?? 0,
    },
    {
      accessorKey: "metrics.closedCount",
      header: "Closed",
      cell: ({ row }) => row.original.metrics?.closedCount ?? 0,
    },
  ];

  const isOwner = session?.role === "owner";

  return (
    <div className="min-w-0 space-y-6 sm:space-y-8">
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back, ${session?.name ?? "User"}`}
      />

      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[
          { title: "Leads today", value: stats.leadsToday, iconName: "leads" as const },
          { title: "Qualified rate", value: `${stats.qualifiedRate}%`, iconName: "qualified" as const },
          { title: "Avg response", value: stats.avgResponseTime, iconName: "response" as const },
          { title: "Appointments", value: stats.appointments, iconName: "appointments" as const },
          { title: "Closed (month)", value: stats.closedThisMonth, iconName: "closed" as const },
          { title: "Active leads", value: stats.activeLeads, iconName: "active" as const },
        ].map((stat, i) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            iconName={stat.iconName}
            staggerDelay={i * 0.04}
          />
        ))}
      </div>

      {isOwner && (
        <SectionCard title="Lead activity">
          <LeadActivityChart data={leadsByDay} />
        </SectionCard>
      )}

      {isOwner && (
        <SectionCard title="Recent activity">
          <ActivityFeed items={activity} />
        </SectionCard>
      )}

      <div className="grid min-w-0 gap-6 lg:grid-cols-2">
        <SectionCard title="Recent messages">
          {messages.length ? (
            <ul className="space-y-0">
              {messages.map((m) => (
                <li
                  key={m.id}
                  className="min-h-[44px] flex items-center py-2 text-sm border-b border-border/60 last:border-0"
                >
                  <span
                    className={
                      m.direction === "in"
                        ? "text-muted-foreground"
                        : "text-foreground font-medium"
                    }
                  >
                    {m.direction === "in" ? "In" : "Out"}:
                  </span>{" "}
                  <span className="min-w-0 truncate">
                    {m.body.slice(0, 60)}
                    {m.body.length > 60 ? "…" : ""}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No recent messages</p>
          )}
        </SectionCard>

        {isOwner ? (
          <SectionCard title="Agent leaderboard">
            <ResponsiveDataList
              columns={agentColumns}
              data={agents}
              mobileCard={(row) => (
                <Card className="min-w-0">
                  <CardContent className="min-w-0 p-4">
                    <p className="font-medium truncate">{row.original.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Leads: {row.original.metrics?.leadsAssigned} | Closed:{" "}
                      {row.original.metrics?.closedCount}
                    </p>
                  </CardContent>
                </Card>
              )}
              emptyMessage="No agents yet."
            />
          </SectionCard>
        ) : (
          <SectionCard title="My recent leads">
            {myLeads.length ? (
              <ul className="space-y-0">
                {myLeads.slice(0, 5).map((l) => (
                  <li
                    key={l.id}
                    className="min-h-[44px] flex items-center gap-2 border-b border-border/60 last:border-0"
                  >
                    <Link
                      href={`/app/leads/${l.id}`}
                      className="min-h-[44px] flex items-center flex-1 min-w-0 py-2 -my-0.5 text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                    >
                      <span className="truncate">{l.name}</span>
                    </Link>
                    <LeadStatusPill status={l.status} className="text-xs shrink-0" />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No assigned leads</p>
            )}
          </SectionCard>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-8">
          <Skeleton className="h-10 w-48" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={`skeleton-stat-${i}`} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-[300px] w-full" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
