"use client";

import {
  Users,
  Target,
  Clock,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MetricCard } from "./MetricCard";

const ICONS = {
  leads: Users,
  qualified: Target,
  response: Clock,
  appointments: Calendar,
  closed: TrendingUp,
  active: Users,
  messages: Users,
  routing: Users,
  billing: Users,
  settings: Users,
} as const;

export type StatCardIconName = keyof typeof ICONS;

interface StatCardProps {
  title: string;
  value: string | number;
  iconName?: StatCardIconName;
  trend?: { value: string; positive: boolean };
  className?: string;
  /** Optional stagger delay (seconds) when used in a grid */
  staggerDelay?: number;
}

/** KPI card; uses design system MetricCard for consistency. */
export function StatCard({
  title,
  value,
  iconName,
  trend,
  className,
  staggerDelay,
}: StatCardProps) {
  const Icon = iconName ? ICONS[iconName] : undefined;
  return (
    <MetricCard
      title={title}
      value={value}
      icon={Icon}
      trend={trend}
      className={cn(className)}
      staggerDelay={staggerDelay}
    />
  );
}
