"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  /** @deprecated Use trend instead */
  change?: string;
  /** @deprecated Use trend.direction instead */
  changeType?: "up" | "down" | "neutral";
  trend?: { value: string; direction: "up" | "down" };
  sparklineData?: number[];
  icon: LucideIcon;
  /** @deprecated Card uses uniform bg-[#f5f5f5] for icon */
  iconBg?: string;
  className?: string;
}

function sparklinePoints(data: number[]): string {
  if (data.length === 0) return "";
  const max = Math.max(...data, 1);
  const n = data.length;
  return data
    .map((v, i) => `${(i / (n - 1 || 1)) * 100},${32 - (v / max) * 28}`)
    .join(" ");
}

export function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  trend: trendProp,
  sparklineData,
  icon: Icon,
  className,
}: StatCardProps) {
  const trend =
    trendProp ??
    (change != null && changeType !== "neutral"
      ? { value: change, direction: changeType as "up" | "down" }
      : undefined);
  const showBottom = (sparklineData != null && sparklineData.length > 0) || trend != null;

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-[#e2e2e2] p-5 flex flex-col gap-3",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-[#f5f5f5] flex items-center justify-center">
            <Icon className="h-4 w-4 text-[#6a6a6a]" />
          </div>
          <span className="text-sm font-medium text-[#6a6a6a]">{title}</span>
        </div>
      </div>

      <div className="text-3xl font-bold text-[#111111] tracking-tight">
        {value}
      </div>

      {showBottom && (
        <div className="flex items-end justify-between">
          {sparklineData != null && sparklineData.length > 0 && (
            <svg className="h-8 w-24 shrink-0" viewBox="0 0 100 32" fill="none">
              <polyline
                points={sparklinePoints(sparklineData)}
                stroke="#111111"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          )}
          {trend != null && (
            <span
              className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full shrink-0",
                trend.direction === "up"
                  ? "text-green-700 bg-green-50"
                  : "text-red-600 bg-red-50"
              )}
            >
              {trend.direction === "up" ? "↗" : "↘"} {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
