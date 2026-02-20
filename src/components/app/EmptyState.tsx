import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  subtitle?: string;
  action?: React.ReactNode | { label: string; href?: string; onClick?: () => void };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  subtitle,
  action,
  className,
}: EmptyStateProps) {
  const desc = description ?? subtitle;
  const actionNode =
    action != null && typeof action === "object" && "label" in action ? (
      action.href ? (
        <Button asChild className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-sans">
          <a href={action.href}>{action.label}</a>
        </Button>
      ) : (
        <Button
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-sans"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )
    ) : (
      action
    );

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-20 text-center",
        className
      )}
      role="status"
      aria-label={title}
    >
      <div className="mb-4 text-slate-300">
        <Icon className="h-12 w-12 shrink-0" aria-hidden />
      </div>
      <h3 className="font-display font-semibold text-lg text-slate-700 mb-1">
        {title}
      </h3>
      {(desc != null && desc !== "") && (
        <p className="text-slate-400 text-sm mb-6 max-w-xs font-sans">{desc}</p>
      )}
      {actionNode}
    </div>
  );
}
