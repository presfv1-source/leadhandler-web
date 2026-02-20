"use client";

import { cn } from "@/lib/utils";

export type StatusBadgeVariant =
  | "hot"
  | "warm"
  | "new"
  | "contacted"
  | "qualified"
  | "appointment"
  | "closed"
  | "lost";

const variantStyles: Record<StatusBadgeVariant, string> = {
  hot: "bg-red-50 text-red-600 border border-red-100",
  warm: "bg-orange-50 text-orange-600 border border-orange-100",
  new: "bg-green-50 text-green-600 border border-green-100",
  contacted: "bg-blue-50 text-blue-600 border border-blue-100",
  qualified: "bg-purple-50 text-purple-600 border border-purple-100",
  appointment: "bg-teal-50 text-teal-600 border border-teal-100",
  closed: "bg-slate-100 text-slate-600 border border-slate-200",
  lost: "bg-slate-100 text-slate-500 border border-slate-200",
};

interface BadgeProps {
  variant: StatusBadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function StatusBadge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium font-sans",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

/** Alias for StatusBadge — usage: <Badge variant="hot">Hot</Badge> */
export const Badge = StatusBadge;
