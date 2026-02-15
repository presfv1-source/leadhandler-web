"use client";

import { cn } from "@/lib/utils";
import {
  METRIC_CARD,
  METRIC_LABEL,
  METRIC_VALUE,
  METRIC_TREND_POSITIVE,
  METRIC_TREND_NEGATIVE,
} from "@/lib/ui";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: { value: string; positive: boolean };
  className?: string;
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  className,
}: MetricCardProps) {
  return (
    <div className={cn(METRIC_CARD, "flex flex-col", className)}>
      <div className="flex flex-row items-center justify-between gap-2">
        <span className={METRIC_LABEL}>{title}</span>
        {Icon && <Icon className="size-4 shrink-0 text-muted-foreground" />}
      </div>
      <div className={METRIC_VALUE}>{value}</div>
      {trend && (
        <p
          className={cn(
            trend.positive ? METRIC_TREND_POSITIVE : METRIC_TREND_NEGATIVE
          )}
        >
          {trend.value}
        </p>
      )}
    </div>
  );
}
