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

const data = [
  { name: "Mon", leads: 12 },
  { name: "Tue", leads: 19 },
  { name: "Wed", leads: 15 },
  { name: "Thu", leads: 22 },
  { name: "Fri", leads: 18 },
  { name: "Sat", leads: 8 },
  { name: "Sun", leads: 5 },
];

export function LeadActivityChart() {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="name" className="text-xs" />
          <YAxis className="text-xs" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="leads"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary) / 0.2)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
