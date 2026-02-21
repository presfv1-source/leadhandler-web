"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/app/PageHeader";
import { StatCard } from "@/components/app/StatCard";
import { AirtableErrorFallback } from "@/components/app/AirtableErrorFallback";
import { StatusBadge } from "@/components/app/Badge";
import {
  UserPlus,
  Clock,
  MessageSquare,
  Zap,
  Users,
  LayoutGrid,
  BarChart3,
  MoreHorizontal,
  ChevronRight,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
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
  leadsByDay: { date: string; label: string; leads: number }[];
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
  leadsByDay,
  activity,
  agents,
  airtableError,
  demoEnabled,
}: DashboardClientContentProps) {
  const [leadSearch, setLeadSearch] = useState("");
  const greeting = isOwner ? "Good morning" : "Welcome back";
  const subtext = isOwner
    ? "Here's what's happening at your brokerage today."
    : "Here are your assigned leads.";

  const filteredLeads = leadSearch.trim()
    ? recentLeads.filter((l) =>
        l.name.toLowerCase().includes(leadSearch.trim().toLowerCase())
      )
    : recentLeads;
  const displayLeads = isOwner ? filteredLeads.slice(0, 8) : filteredLeads;

  return (
    <div className="min-w-0 space-y-6 sm:space-y-8">
      <PageHeader
        title={`${greeting}, ${firstName}.`}
        subtitle={subtext}
      />

      {isOwner && airtableError && <AirtableErrorFallback className="mb-4" />}

      {/* Row 1 — StatCards with sparklines and trends */}
      {isOwner ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="New Leads Today"
            value={stats.leadsToday}
            icon={UserPlus}
            trend={{ value: "+12%", direction: "up" }}
            sparklineData={[2, 4, 3, 6, 5, 8, stats.leadsToday || 3]}
          />
          <StatCard
            title="Avg First Reply"
            value={stats.avgResponseTime}
            icon={Clock}
            trend={{ value: "-18%", direction: "up" }}
            sparklineData={[15, 12, 14, 10, 8, 9, 8]}
          />
          <StatCard
            title="Active Conversations"
            value={stats.activeLeads}
            icon={MessageSquare}
            trend={{
              value: `${stats.activeLeads > 0 ? "+" : ""}${stats.activeLeads}`,
              direction: stats.activeLeads > 0 ? "up" : "down",
            }}
            sparklineData={[3, 5, 4, 7, 6, 8, stats.activeLeads || 2]}
          />
          <StatCard
            title="Qualification Rate"
            value={`${stats.qualifiedRate}%`}
            icon={Zap}
            trend={{
              value: `${stats.qualifiedRate}%`,
              direction: stats.qualifiedRate >= 50 ? "up" : "down",
            }}
            sparklineData={[40, 45, 42, 50, 48, 52, stats.qualifiedRate || 45]}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="My Leads"
            value={recentLeads.length}
            icon={Users}
            trend={{ value: `${recentLeads.length}`, direction: "up" }}
            sparklineData={[2, 3, 2, 4, 3, 5, recentLeads.length || 2]}
          />
          <StatCard
            title="Avg Response Time"
            value={stats.avgResponseTime}
            icon={Clock}
            trend={{ value: "-18%", direction: "up" }}
            sparklineData={[15, 12, 14, 10, 8, 9, 8]}
          />
          <StatCard
            title="Appointments This Week"
            value={stats.appointments}
            icon={LayoutGrid}
            trend={{ value: `${stats.appointments}`, direction: "up" }}
            sparklineData={[1, 2, 1, 3, 2, 4, stats.appointments || 2]}
          />
        </div>
      )}

      {/* Row 2 — Owner: Lead Activity chart + Recent Activity. Agent: skip (go to table) */}
      {isOwner && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-[#e2e2e2] p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[#6a6a6a]" />
                <h2 className="font-semibold text-[#111111]">Lead Activity</h2>
              </div>
              <button
                type="button"
                className="text-[#a0a0a0] hover:text-[#111111]"
                aria-label="More options"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
            <div className="h-48">
              {leadsByDay.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={leadsByDay} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 12, fill: "#a0a0a0" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#a0a0a0" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Bar dataKey="leads" fill="#111111" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-[#a0a0a0] text-sm">
                  No data
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#e2e2e2] p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#6a6a6a]" />
                <h2 className="font-semibold text-[#111111]">Recent Activity</h2>
              </div>
              <button
                type="button"
                className="text-[#a0a0a0] hover:text-[#111111]"
                aria-label="More options"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-0 divide-y divide-[#f0f0f0]">
              {activity.slice(0, 5).map((a) => (
                <div key={a.id} className="flex items-center gap-4 py-3">
                  <div className="h-10 w-10 rounded-xl bg-[#f5f5f5] flex items-center justify-center shrink-0">
                    <span className="text-[10px] leading-tight text-center text-[#6a6a6a] font-medium">
                      {new Date(a.createdAt).toLocaleDateString(undefined, { month: "short" })}
                      <br />
                      {new Date(a.createdAt).getDate()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#111111] truncate">{a.title}</p>
                    {a.description && (
                      <p className="text-xs text-[#a0a0a0] truncate">{a.description}</p>
                    )}
                  </div>
                  <ChevronRight className="h-4 w-4 text-[#d4d4d4] shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Row 3 — Full-width Recent Leads / My Assigned Leads table */}
      <div className="bg-white rounded-2xl border border-[#e2e2e2] overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b border-[#f0f0f0]">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[#6a6a6a]" />
            <h2 className="font-semibold text-[#111111]">
              {isOwner ? "Recent Leads" : "My Assigned Leads"}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {isOwner && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a0a0a0]" />
                <input
                  type="text"
                  placeholder="Search"
                  value={leadSearch}
                  onChange={(e) => setLeadSearch(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-sm border border-[#e2e2e2] rounded-lg bg-white placeholder:text-[#a0a0a0] focus:outline-none focus:border-[#111111] w-48"
                />
              </div>
            )}
            <Button variant="ghost" size="sm" asChild className="text-[#111111] font-medium">
              <Link href="/app/leads">View all →</Link>
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#f0f0f0]">
                <th className="text-left py-3 px-6 font-medium text-[#a0a0a0] text-xs uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left py-3 px-4 font-medium text-[#a0a0a0] text-xs uppercase tracking-wider">
                  Source
                </th>
                <th className="text-left py-3 px-4 font-medium text-[#a0a0a0] text-xs uppercase tracking-wider">
                  Status
                </th>
                {isOwner && (
                  <th className="text-left py-3 px-4 font-medium text-[#a0a0a0] text-xs uppercase tracking-wider">
                    Agent
                  </th>
                )}
                <th className="text-left py-3 px-4 font-medium text-[#a0a0a0] text-xs uppercase tracking-wider">
                  {isOwner ? "Time" : "Last Activity"}
                </th>
              </tr>
            </thead>
            <tbody>
              {displayLeads.map((l) => {
                const initials = l.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();
                return (
                  <tr
                    key={l.id}
                    className="border-b border-[#f5f5f5] hover:bg-[#fafafa] transition-colors"
                  >
                    <td className="py-3 px-6">
                      <Link
                        href={`/app/leads?leadId=${l.id}`}
                        className="flex items-center gap-3"
                      >
                        <div className="h-8 w-8 rounded-full bg-[#f0f0f0] flex items-center justify-center text-xs font-medium text-[#6a6a6a]">
                          {initials}
                        </div>
                        <span className="font-medium text-[#111111]">{l.name}</span>
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-[#6a6a6a]">{l.source}</td>
                    <td className="py-3 px-4">
                      <StatusBadge variant={statusToVariant(l.status)}>{l.status}</StatusBadge>
                    </td>
                    {isOwner && (
                      <td className="py-3 px-4 text-[#6a6a6a]">{l.assignedToName ?? "—"}</td>
                    )}
                    <td className="py-3 px-4 text-[#a0a0a0]">
                      {formatTime(
                        isOwner ? (l.createdAt ?? "") : (l.updatedAt ?? l.createdAt ?? "")
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
