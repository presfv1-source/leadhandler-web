import { cn } from "@/lib/utils";

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  time?: string;
  type?: "message" | "status" | "note" | "default";
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
      <ul className="space-y-6">
        {items.map((item) => (
          <li key={item.id} className="relative flex gap-4 pl-10">
            <div
              className={cn(
                "absolute left-0 top-1.5 h-2 w-2 rounded-full -translate-x-[3px]",
                item.type === "message"
                  ? "bg-primary"
                  : item.type === "status"
                    ? "bg-emerald-500 dark:bg-emerald-400"
                    : item.type === "note"
                      ? "bg-amber-500 dark:bg-amber-400"
                      : "bg-muted-foreground"
              )}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{item.title}</p>
              {item.description && (
                <p className="text-sm text-muted-foreground mt-0.5">{item.description}</p>
              )}
              {item.time && (
                <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
