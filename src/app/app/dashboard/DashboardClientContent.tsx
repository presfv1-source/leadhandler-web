"use client";

import Link from "next/link";
import { PageHeader } from "@/components/app/PageHeader";
import { StatCard } from "@/components/app/StatCard";
import { AirtableErrorFallback } from "@/components/app/AirtableErrorFallback";
import { StatusBadge } from "@/components/app/Badge";
import { useUser } from "@/hooks/useUser";
import {
  UserPlus,
  Clock,
  MessageSquare,
  Zap,
  Users,
  LayoutGrid,
  Route,
  Download,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ActivityItem, Agent, Lead } from "@/lib/types";
import { cn } from "@/lib/utils";

function statusToVariant(s: string): "new" | "contacted" | "qualified" | "appointment" | "closed" | "lost" {
  if (s === "new") return "new";
  if (s === "contacted") return "contacted";
  if (s === "qualified") return "qualified";
  if (s === "appointment") return "appointment";
  if (s === "closed") return "closed";
  if (s === "lost") return "lost";
  return "contacted";
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = Date.now();
  const diff = now - d.getTime();
  if (diff < 60 * 1000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

interface DashboardClientContentProps {
  isOwner: boolean;
  role: string;
  firstName: string;
  stats: {
    leadsToday: number;
    qualifiedRate: number;
    avgResponseTime: string;
    appointments: number;
    closedThisMonth: number;
    activeLeads: number;
  };
  recentLeads: Lead[];
  activity: ActivityItem[];
  agents: Agent[];
  airtableError: boolean;
  demoEnabled: boolean;
}

export function DashboardClientContent({
  isOwner,
  role,
  firstName,
  stats,
  recentLeads,
  activity,
  agents,
  airtableError,
  demoEnabled,
}: DashboardClientContentProps) {
  const { isPro } = useUser();
  const greeting = isOwner ? "Good morning" : "Welcome back";
  const subtext = isOwner
    ? "Here's what's happening at your brokerage today."
    : "Here are your assigned leads.";

  return (
    <div className="min-w-0 space-y-6 sm:space-y-8">
      <PageHeader
        title={`${greeting}, ${firstName}.`}
        subtitle={subtext}
      />

      {isOwner && airtableError && <AirtableErrorFallback className="mb-4" />}

      {/* Row 1 — StatCards */}
      {isOwner ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="New Leads Today"
            value={stats.leadsToday}
            icon={UserPlus}
            iconBg="bg-blue-100"
          />
          <StatCard
            title="Avg First Reply"
            value={stats.avgResponseTime}
            icon={Clock}
            iconBg="bg-green-100"
          />
          <StatCard
            title="Active Conversations"
            value={stats.activeLeads}
            icon={MessageSquare}
            iconBg="bg-violet-100"
          />
          <StatCard
            title="Qualification Rate"
            value={`${stats.qualifiedRate}%`}
            icon={Zap}
            iconBg="bg-orange-100"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="My Leads"
            value={recentLeads.length}
            icon={Users}
            iconBg="bg-blue-100"
          />
          <StatCard
            title="Avg Response Time"
            value={stats.avgResponseTime}
            icon={Clock}
            iconBg="bg-green-100"
          />
          <StatCard
            title="Appointments This Week"
            value={stats.appointments}
            icon={LayoutGrid}
            iconBg="bg-violet-100"
          />
        </div>
      )}

      {/* Row 2 — Owner: Recent Leads table + Activity feed. Agent: full-width leads table */}
      {isOwner ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-display font-semibold text-slate-900">Recent Leads</h2>
              <Button variant="ghost" size="sm" asChild className="text-blue-600 font-sans">
                <Link href="/app/leads">View all →</Link>
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-sans">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Source</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Agent</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeads.slice(0, 10).map((l) => (
                    <tr key={l.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <Link
                          href={`/app/leads?leadId=${l.id}`}
                          className="font-medium text-slate-900 hover:text-blue-600"
                        >
                          {l.name}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{l.source}</td>
                      <td className="py-3 px-4">
                        <StatusBadge variant={statusToVariant(l.status)}>{l.status}</StatusBadge>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{l.assignedToName ?? "—"}</td>
                      <td className="py-3 px-4 text-slate-500">{formatTime(l.createdAt ?? "")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="font-display font-semibold text-slate-900">Recent Activity</h2>
            </div>
            <div className="p-4 space-y-3 max-h-[320px] overflow-y-auto">
              {activity.slice(0, 15).map((a) => (
                <div key={a.id} className="flex gap-3">
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full mt-1.5 shrink-0",
                      a.type === "lead_created" && "bg-blue-500",
                      a.type === "message_sent" && "bg-green-500",
                      a.type === "message_received" && "bg-slate-400",
                      a.type === "status_changed" && "bg-amber-500",
                      a.type === "lead_assigned" && "bg-violet-500"
                    )}
                  />
                  <div className="min-w-0">
                    <p className="text-sm text-slate-900 font-sans">{a.title}</p>
                    {a.description && (
                      <p className="text-xs text-slate-500 truncate">{a.description}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-0.5">{formatTime(a.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="font-display font-semibold text-slate-900">My Assigned Leads</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-sans">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Source</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Last Activity</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((l) => (
                  <tr key={l.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <Link
                        href={`/app/leads?leadId=${l.id}`}
                        className="font-medium text-slate-900 hover:text-blue-600"
                      >
                        {l.name}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{l.source}</td>
                    <td className="py-3 px-4">
                      <StatusBadge variant={statusToVariant(l.status)}>{l.status}</StatusBadge>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{formatTime(l.updatedAt ?? l.createdAt ?? "")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Row 3 — Owner only: Agent Performance + Quick Actions */}
      {isOwner && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="font-display font-semibold text-slate-900">Agent Performance</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-sans">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Agent</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Leads assigned</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Avg response</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Appointments</th>
                  </tr>
                </thead>
                <tbody>
                  {agents.slice(0, 5).map((a) => (
                    <tr key={a.id} className="border-b border-slate-100">
                      <td className="py-3 px-4 font-medium text-slate-900">{a.name}</td>
                      <td className="py-3 px-4 text-slate-600">{a.metrics?.leadsAssigned ?? 0}</td>
                      <td className="py-3 px-4 text-slate-600">{stats.avgResponseTime}</td>
                      <td className="py-3 px-4 text-slate-600">{a.metrics?.appointmentsSet ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-display font-semibold text-slate-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button asChild className="w-full justify-start font-sans" variant="outline">
                <Link href="/app/agents" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add Agent
                </Link>
              </Button>
              <Button asChild className="w-full justify-start font-sans" variant="outline">
                <Link href="/app/routing" className="flex items-center gap-2">
                  <Route className="h-4 w-4" />
                  View Routing
                </Link>
              </Button>
              {isPro ? (
                <Button asChild className="w-full justify-start font-sans" variant="outline">
                  <Link href="/app/analytics" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download Report
                  </Link>
                </Button>
              ) : (
                <Button
                  disabled
                  className="w-full justify-start font-sans"
                  variant="outline"
                  title="Pro feature"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
