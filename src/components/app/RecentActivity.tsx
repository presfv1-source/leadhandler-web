"use client";

import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { ActivityItem } from "@/lib/types";

const BADGE_BY_TYPE: Record<
  ActivityItem["type"],
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  lead_created: { label: "New lead", variant: "default" },
  message_sent: { label: "Replied", variant: "default" },
  message_received: { label: "Message", variant: "secondary" },
  status_changed: { label: "Status", variant: "outline" },
  lead_assigned: { label: "Assigned", variant: "default" },
};

const DOT_CLASS_BY_TYPE: Record<ActivityItem["type"], string> = {
  lead_created: "bg-primary",
  message_sent: "bg-emerald-600",
  message_received: "bg-muted-foreground",
  status_changed: "bg-amber-500",
  lead_assigned: "bg-primary",
};

function getActionText(item: ActivityItem): string {
  if (item.type === "lead_created") return `New lead from ${item.leadName ?? "inbound"}`;
  if (item.type === "message_sent") return `Replied to ${item.leadName ?? "lead"}`;
  if (item.type === "message_received") return `Message from ${item.leadName ?? "lead"}`;
  if (item.type === "status_changed") return item.description ?? "Status updated";
  if (item.type === "lead_assigned") return `${item.leadName ?? "Lead"} assigned to ${item.agentName ?? "agent"}`;
  return item.title;
}

function getDetailsFull(item: ActivityItem): string {
  const parts: string[] = [];
  if (item.description) parts.push(item.description);
  if (item.leadName && !getActionText(item).includes(item.leadName)) parts.push(item.leadName);
  return parts.join(" — ");
}

function getDetailsTruncated(item: ActivityItem, maxLen = 120): string {
  const full = getDetailsFull(item);
  return full.length > maxLen ? full.slice(0, maxLen) + "…" : full;
}

interface RecentActivityProps {
  items: ActivityItem[];
  className?: string;
  emptyMessage?: string;
}

export function RecentActivity({
  items,
  className,
  emptyMessage = "No recent activity—add a lead!",
}: RecentActivityProps) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-6" role="status">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className={cn("relative min-w-0", className)}>
      <ul className="relative space-y-6 border-l-2 border-border pl-6" aria-label="Recent activity">
        {items.map((item) => {
          const badge = BADGE_BY_TYPE[item.type];
          const dotClass = DOT_CLASS_BY_TYPE[item.type];
          const detailsShort = getDetailsTruncated(item);
          const detailsFull = getDetailsFull(item);
          const actionText = getActionText(item);

          return (
            <li
              key={item.id}
              className="relative rounded-lg py-1 pr-2 -ml-6 pl-6 hover:bg-muted/50 transition-colors"
            >
              {/* Dot on timeline */}
              <div
                className={cn(
                  "absolute left-0 top-2 h-2.5 w-2.5 -translate-x-[5px] rounded-full border-2 border-background",
                  dotClass
                )}
              />
              {/* Two-column: time left, content right */}
              <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                <div className="shrink-0 w-fit sm:w-24 text-xs text-muted-foreground tabular-nums">
                  {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    {item.leadId ? (
                      <Link
                        href={`/app/leads/${item.leadId}`}
                        className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                      >
                        {item.leadName ?? "Lead"}
                      </Link>
                    ) : (
                      <span>{item.leadName ?? "Lead"}</span>
                    )}{" "}
                    <Badge variant={badge.variant} className="ml-1.5 text-xs">
                      {badge.label}
                    </Badge>
                  </p>
                  <p className="text-sm text-foreground mt-0.5">{actionText}</p>
                  {detailsFull ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-full">
                          {detailsShort}
                        </p>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        {detailsFull}
                      </TooltipContent>
                    </Tooltip>
                  ) : null}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
