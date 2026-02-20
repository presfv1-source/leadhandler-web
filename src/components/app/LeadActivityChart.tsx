"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

/** Chart expects { label, leads } per day. Pass data from getDemoLeadsByDay() for demo. */
export function LeadActivityChart({
  data,
}: {
  data?: { date: string; label: string; leads: number }[];
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  const chartData =
    data?.map((d) => ({
      name: d.label,
      leads: typeof d.leads === "number" && Number.isFinite(d.leads) ? d.leads : 0,
    })) ??
    Array.from({ length: 7 }, (_, i) => ({
      name: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i],
      leads: 0,
    }));

  if (!mounted) {
    return <Skeleton className="h-[300px] w-full rounded-lg" />;
  }

  return (
    <div className="h-[300px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="name" className="text-xs" />
          <YAxis className="text-xs" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="leads"
            stroke="#14b8a6"
            fill="rgba(20, 184, 166, 0.2)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
