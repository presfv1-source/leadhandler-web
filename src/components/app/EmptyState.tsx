import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 text-center shadow-sm",
        className
      )}
      role="status"
      aria-label={title}
    >
      <Icon
        className="h-12 w-12 shrink-0 text-slate-400 mb-4"
        aria-hidden
      />
      <h3 className="font-display text-lg font-semibold text-slate-900">
        {title}
      </h3>
      {description && (
        <p className="mt-2 text-sm text-slate-500 max-w-sm font-sans">
          {description}
        </p>
      )}
      {action &&
        (action.href ? (
          <Button
            asChild
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-sans"
          >
            <a href={action.href}>{action.label}</a>
          </Button>
        ) : (
          <Button
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-sans"
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        ))}
    </div>
  );
}
