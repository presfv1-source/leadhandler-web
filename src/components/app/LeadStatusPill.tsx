import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { LeadStatus } from "@/lib/types";

const statusLabels: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  appointment: "Appointment",
  closed: "Closed",
  lost: "Lost",
};

const statusStyles: Record<LeadStatus, string> = {
  new: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400",
  contacted: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  qualified: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  appointment: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400",
  closed: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
  lost: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

export function LeadStatusPill({ status, className }: { status: LeadStatus; className?: string }) {
  return (
    <Badge
      variant="secondary"
      className={cn("font-medium", statusStyles[status], className)}
    >
      {statusLabels[status]}
    </Badge>
  );
}
