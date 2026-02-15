import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  EMPTY_STATE,
  EMPTY_STATE_ICON,
  EMPTY_STATE_TITLE,
  EMPTY_STATE_DESCRIPTION,
} from "@/lib/ui";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; href?: string; onClick?: () => void };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn(EMPTY_STATE, className)} role="status" aria-label={title}>
      <Icon
        className={cn(EMPTY_STATE_ICON, "shrink-0 text-indigo-600/80 dark:text-indigo-400/80")}
        aria-hidden
      />
      <h3 className={EMPTY_STATE_TITLE}>{title}</h3>
      {description && <p className={EMPTY_STATE_DESCRIPTION}>{description}</p>}
      {action &&
        (action.href ? (
          <Button asChild className="mt-6 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <a href={action.href}>{action.label}</a>
          </Button>
        ) : (
          <Button
            className="mt-6 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        ))}
    </div>
  );
}
