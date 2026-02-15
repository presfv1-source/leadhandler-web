import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { MetricCard } from "./MetricCard";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: { value: string; positive: boolean };
  className?: string;
}

/** KPI card; uses design system MetricCard for consistency. */
export function StatCard({ title, value, icon, trend, className }: StatCardProps) {
  return (
    <MetricCard
      title={title}
      value={value}
      icon={icon}
      trend={trend}
      className={cn(className)}
    />
  );
}
