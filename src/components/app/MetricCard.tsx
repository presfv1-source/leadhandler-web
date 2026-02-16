"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  METRIC_CARD,
  METRIC_LABEL,
  METRIC_VALUE,
  METRIC_TREND_POSITIVE,
  METRIC_TREND_NEGATIVE,
} from "@/lib/ui";
import { LucideIcon } from "lucide-react";
import { cardEnterTransition, cardEnterVariants } from "./CardEnter";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: { value: string; positive: boolean };
  className?: string;
  /** Optional stagger delay (seconds) when used in a grid */
  staggerDelay?: number;
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  className,
  staggerDelay = 0,
}: MetricCardProps) {
  return (
    <motion.div
      initial={false}
      animate={cardEnterVariants.animate}
      transition={{ ...cardEnterTransition, delay: staggerDelay }}
      className={cn(METRIC_CARD, "flex flex-col min-w-0", className)}
    >
      <div className="flex flex-row items-center justify-between gap-2">
        <span className={METRIC_LABEL}>{title}</span>
        {Icon && (
          <Icon className="size-4 shrink-0 text-primary" />
        )}
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
    </motion.div>
  );
}
