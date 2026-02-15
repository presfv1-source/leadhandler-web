import { Suspense } from "react";
import { getSession, getDemoEnabled } from "@/lib/auth";
import { getDashboardStats, getDemoLeads, getDemoMessages, getDemoAgents } from "@/lib/demo/data";
import { PageHeader } from "@/components/app/PageHeader";
import { StatCard } from "@/components/app/StatCard";
import { SectionCard } from "@/components/app/SectionCard";
import { LeadStatusPill } from "@/components/app/LeadStatusPill";
import { ResponsiveDataList } from "@/components/app/ResponsiveDataList";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  Users,
  Clock,
  Calendar,
  Target,
} from "lucide-react";
import { LeadActivityChart } from "@/components/app/LeadActivityChart";
import { type ColumnDef } from "@tanstack/react-table";
import type { Agent } from "@/lib/types";
import Link from "next/link";

async function DashboardContent() {
  const [session] = await Promise.all([getSession(), getDemoEnabled()]);
  const stats = getDashboardStats(
    session?.role ?? "agent",
    session?.role === "agent" ? session?.userId : undefined
  );
  const leads = getDemoLeads();
  const messages = getDemoMessages().slice(0, 5);
  const agents = getDemoAgents();


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
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back, ${session?.name ?? "User"}`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard title="Leads today" value={stats.leadsToday} icon={Users} />
        <StatCard title="Qualified rate" value={`${stats.qualifiedRate}%`} icon={Target} />
        <StatCard title="Avg response" value={stats.avgResponseTime} icon={Clock} />
        <StatCard title="Appointments" value={stats.appointments} icon={Calendar} />
        <StatCard title="Closed (month)" value={stats.closedThisMonth} icon={TrendingUp} />
        <StatCard title="Active leads" value={stats.activeLeads} icon={Users} />
      </div>

      {isOwner && (
        <SectionCard title="Lead activity">
          <LeadActivityChart />
        </SectionCard>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Recent messages">
          {messages.length ? (
            <ul className="space-y-3">
              {messages.map((m) => (
                <li key={m.id} className="text-sm">
                  <span
                    className={
                      m.direction === "in"
                        ? "text-muted-foreground"
                        : "text-foreground font-medium"
                    }
                  >
                    {m.direction === "in" ? "In" : "Out"}:
                  </span>{" "}
                  {m.body.slice(0, 60)}
                  {m.body.length > 60 ? "…" : ""}
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
                <Card>
                  <CardContent className="p-4">
                    <p className="font-medium">{row.original.name}</p>
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
            {leads.filter((l) => l.assignedTo === "agent-1").length ? (
              <ul className="space-y-2">
                {leads
                  .filter((l) => l.assignedTo === "agent-1")
                  .slice(0, 5)
                  .map((l) => (
                    <li key={l.id} className="flex items-center gap-2">
                      <Link
                        href={`/app/leads/${l.id}`}
                        className="text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                      >
                        {l.name}
                      </Link>
                      <LeadStatusPill status={l.status} className="text-xs" />
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
              <Skeleton key={i} className="h-24" />
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
