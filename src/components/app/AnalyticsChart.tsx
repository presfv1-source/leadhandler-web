"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AnalyticsChartProps {
  data: { date: string; label: string; leads: number }[];
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  if (!data.length) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
        No data
      </div>
    );
  }

  return (
    <div className="h-64 w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} className="text-muted-foreground" />
          <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
          <Tooltip
            contentStyle={{ borderRadius: "8px" }}
            formatter={(value: number | undefined) => [value ?? 0, "Leads"]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Area
            type="monotone"
            dataKey="leads"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary) / 0.2)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
