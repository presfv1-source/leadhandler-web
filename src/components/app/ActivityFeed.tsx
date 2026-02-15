import type { ActivityItem } from "@/lib/types";
import { Activity, MessageSquare, UserPlus, ArrowRightLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const ICONS: Record<ActivityItem["type"], React.ComponentType<{ className?: string }>> = {
  lead_created: UserPlus,
  message_sent: MessageSquare,
  message_received: MessageSquare,
  status_changed: ArrowRightLeft,
  lead_assigned: Activity,
};

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

interface ActivityFeedProps {
  items: ActivityItem[];
  className?: string;
}

export function ActivityFeed({ items, className }: ActivityFeedProps) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4">No recent activity</p>
    );
  }

  return (
    <ul className={cn("min-w-0 space-y-3", className)} aria-label="Recent activity">
      {items.map((item) => {
        const Icon = ICONS[item.type] ?? Activity;
        const leadLink = item.leadId ? (
          <Link
            href={`/app/leads/${item.leadId}`}
            className="inline-block min-h-[44px] min-w-0 max-w-full py-2 -my-1 font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded leading-tight truncate"
          >
            {item.leadName ?? "Lead"}
          </Link>
        ) : (
          <span className="font-medium">{item.leadName ?? "Lead"}</span>
        );

        return (
          <li
            key={item.id}
            className="flex min-h-[44px] gap-3 py-3 text-sm border-b border-border/60 last:border-0 last:pb-0"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Icon className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-foreground">
                {item.type === "lead_created" && (
                  <>New lead {leadLink} from {item.description ?? "inbound"}</>
                )}
                {item.type === "message_sent" && (
                  <>Message sent to {leadLink}</>
                )}
                {item.type === "message_received" && (
                  <>Message from {leadLink}</>
                )}
                {item.type === "status_changed" && item.description && (
                  <>{item.description}</>
                )}
                {item.type === "lead_assigned" && item.agentName && (
                  <>{leadLink} assigned to {item.agentName}</>
                )}
                {!["lead_created", "message_sent", "message_received", "status_changed", "lead_assigned"].includes(item.type) && (
                  <>{item.title}{item.description ? ` — ${item.description}` : ""}</>
                )}
              </p>
              <p className="text-muted-foreground text-xs mt-0.5">
                {formatTime(item.createdAt)}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
