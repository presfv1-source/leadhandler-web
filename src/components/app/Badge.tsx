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
  hot: "bg-red-100 text-red-800 border-red-200",
  warm: "bg-orange-100 text-orange-800 border-orange-200",
  new: "bg-sky-100 text-sky-800 border-sky-200",
  contacted: "bg-amber-100 text-amber-800 border-amber-200",
  qualified: "bg-emerald-100 text-emerald-800 border-emerald-200",
  appointment: "bg-violet-100 text-violet-800 border-violet-200",
  closed: "bg-slate-100 text-slate-600 border-slate-200",
  lost: "bg-slate-100 text-slate-500 border-slate-200",
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
