"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  icon: LucideIcon;
  iconBg?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconBg = "bg-blue-100",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-slate-200 p-6 shadow-sm",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-slate-500 font-sans">{title}</p>
        <div className={cn("p-2.5 rounded-xl", iconBg)}>
          <Icon className="h-5 w-5 text-slate-700" />
        </div>
      </div>
      <p className="font-display text-3xl font-bold text-slate-900 tracking-tight">
        {value}
      </p>
      {change != null && (
        <p
          className={cn(
            "text-xs font-medium mt-1.5 font-sans",
            changeType === "up" && "text-green-600",
            changeType === "down" && "text-red-500",
            changeType === "neutral" && "text-slate-400"
          )}
        >
          {change}
        </p>
      )}
    </div>
  );
}
