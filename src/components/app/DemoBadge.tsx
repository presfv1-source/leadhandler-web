"use client";

import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { FlaskConical } from "lucide-react";

interface DemoBadgeProps {
  enabled: boolean;
  onToggle?: (enabled: boolean) => void;
  ownerOnly?: boolean;
  className?: string;
}

export function DemoBadge({
  enabled,
  onToggle,
  ownerOnly = true,
  className,
}: DemoBadgeProps) {
  if (!enabled) return null;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border bg-amber-50 px-3 py-1.5 text-sm dark:bg-amber-950/30",
        className
      )}
    >
      <FlaskConical className="h-4 w-4 text-amber-600" />
      <Badge variant="outline" className="border-amber-300 text-amber-800 dark:text-amber-200">
        Demo Mode
      </Badge>
      {ownerOnly && onToggle && (
        <Switch checked={enabled} onCheckedChange={onToggle} />
      )}
    </div>
  );
}
