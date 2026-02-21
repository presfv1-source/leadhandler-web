"use client";

import { useState } from "react";
import { PageHeader } from "@/components/app/PageHeader";
import { UpgradeCard } from "@/components/app/UpgradeCard";
import { StatCard } from "@/components/app/StatCard";
import { AnalyticsChart } from "@/components/app/AnalyticsChart";
import { useUser } from "@/hooks/useUser";
import { UserPlus, Clock, TrendingUp, Calendar } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import type { Lead, Agent } from "@/lib/types";

const COLORS = ["#111111", "#16A34A", "#EA580C", "#a0a0a0"];

interface AnalyticsPageContentProps {
  demoEnabled: boolean;
  stats: {
    totalLeads: number;
    avgResponseMin: number;
    conversionRate: number;
    responseRate: number;
  };
  leadsByDay: { date: string; label: string; leads: number }[];
  leads: Lead[];
  agents: Agent[];
}

export function AnalyticsPageContent({
  demoEnabled,
  stats,
  leadsByDay,
  leads,
  agents,
}: AnalyticsPageContentProps) {
  const { isPro } = useUser();
  const [dateRange, setDateRange] = useState<"today" | "week" | "month" | "custom">("week");

  if (!isPro) {
    return (
      <div className="p-8">
        <PageHeader
          title="Analytics"
          subtitle="Track brokerage performance over time."
        />
        <UpgradeCard feature="Analytics Dashboard" />
      </div>
    );
  }

  const sourceCounts: Record<string, number> = {};
  leads.forEach((l) => {
    const s = l.source ?? "Other";
    sourceCounts[s] = (sourceCounts[s] ?? 0) + 1;
  });
  const sourceData = Object.entries(sourceCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const agentBarData = agents.map((a) => ({
    name: a.name.split(" ")[0] ?? a.name,
    leads: a.metrics?.leadsAssigned ?? 0,
  }));

  const statusOrder = ["new", "contacted", "qualified", "appointment", "closed"];
  const funnelCounts = statusOrder.map((s) => ({
    stage: s.charAt(0).toUpperCase() + s.slice(1),
    count: leads.filter((l) => l.status === s).length,
  }));

  const totalFunnel = leads.length || 1;
  const leadsBySourceTable = sourceData.map((s) => {
    const total = s.value;
    const qualified = leads.filter((l) => l.source === s.name && (l.status === "qualified" || l.status === "appointment")).length;
    const appointments = leads.filter((l) => l.source === s.name && l.status === "appointment").length;
    const conversion = total ? Math.round((appointments / total) * 100) : 0;
    return { source: s.name, total, qualified, appointments, conversion };
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title="Analytics"
        subtitle="Track brokerage performance over time."
        right={
          <div className="flex gap-2 font-sans text-sm">
            {(["today", "week", "month", "custom"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setDateRange(r)}
                className={`px-3 py-1.5 rounded-lg capitalize ${
                  dateRange === r ? "bg-[#111111] text-white" : "bg-white border border-[#e2e2e2] text-[#6a6a6a] hover:bg-[#fafafa]"
                }`}
              >
                {r === "week" ? "This Week" : r === "month" ? "This Month" : r}
              </button>
            ))}
          </div>
        }
      />

      {demoEnabled && (
        <p className="text-xs text-[#a0a0a0] font-sans">Demo data</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Leads" value={stats.totalLeads} icon={UserPlus} iconBg="bg-[#f0f0f0]" />
        <StatCard title="Avg First Reply" value={`${stats.avgResponseMin} min`} icon={Clock} iconBg="bg-green-100" />
        <StatCard title="Qualification Rate" value={`${stats.conversionRate}%`} icon={TrendingUp} iconBg="bg-orange-100" />
        <StatCard title="Appointments Booked" value={stats.totalLeads} icon={Calendar} iconBg="bg-violet-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white rounded-2xl border border-[#e2e2e2] p-6">
          <h3 className="font-display font-semibold text-[#111111] mb-4">Leads Over Time</h3>
          <div className="h-64 min-w-0">
            {leadsByDay.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={leadsByDay} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-[#e2e2e2]" />
                  <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#a0a0a0" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#a0a0a0" }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="leads" stroke="#111111" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-[#a0a0a0] font-sans text-sm">
                No data
              </div>
            )}
          </div>
        </div>
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e2e2e2] p-6">
          <h3 className="font-display font-semibold text-[#111111] mb-4">Lead Sources</h3>
          <div className="h-64 min-w-0">
            {sourceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  >
                    {sourceData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [v ?? 0, "Leads"]} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-[#a0a0a0] font-sans text-sm">
                No data
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#e2e2e2] p-6">
          <h3 className="font-display font-semibold text-[#111111] mb-4">Agent Performance</h3>
          <div className="h-64 min-w-0">
            {agentBarData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={agentBarData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-[#e2e2e2]" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#a0a0a0" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#a0a0a0" }} />
                  <Tooltip />
                  <Bar dataKey="leads" fill="#111111" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-[#a0a0a0] font-sans text-sm">
                No data
              </div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#e2e2e2] p-6">
          <h3 className="font-display font-semibold text-[#111111] mb-4">Funnel</h3>
          <div className="space-y-3">
            {funnelCounts.map((s, i) => {
              const pct = totalFunnel ? Math.round((s.count / totalFunnel) * 100) : 0;
              const widthPct = totalFunnel ? (s.count / totalFunnel) * 100 : 0;
              return (
                <div key={s.stage} className="font-sans">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#222222]">{s.stage}</span>
                    <span className="text-[#a0a0a0]">{s.count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-[#f5f5f5] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#111111] rounded-full transition-all"
                      style={{ width: `${Math.max(widthPct, 5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e2e2e2] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e2e2e2]">
          <h3 className="font-display font-semibold text-[#111111]">Leads by Source</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b border-[#f0f0f0]">
                <th className="text-left py-3 px-4 font-medium text-[#a0a0a0] text-xs uppercase tracking-wider">Source</th>
                <th className="text-left py-3 px-4 font-medium text-[#a0a0a0] text-xs uppercase tracking-wider">Total</th>
                <th className="text-left py-3 px-4 font-medium text-[#a0a0a0] text-xs uppercase tracking-wider">Qualified</th>
                <th className="text-left py-3 px-4 font-medium text-[#a0a0a0] text-xs uppercase tracking-wider">Appointments</th>
                <th className="text-left py-3 px-4 font-medium text-[#a0a0a0] text-xs uppercase tracking-wider">Conversion Rate</th>
              </tr>
            </thead>
            <tbody>
              {leadsBySourceTable.map((row) => (
                <tr key={row.source} className="border-b border-[#f0f0f0]">
                  <td className="py-3 px-4 font-medium text-[#111111]">{row.source}</td>
                  <td className="py-3 px-4 text-[#6a6a6a]">{row.total}</td>
                  <td className="py-3 px-4 text-[#6a6a6a]">{row.qualified}</td>
                  <td className="py-3 px-4 text-[#6a6a6a]">{row.appointments}</td>
                  <td className="py-3 px-4 text-[#6a6a6a]">{row.conversion}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
