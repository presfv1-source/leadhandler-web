"use client";

import { cn } from "@/lib/utils";
import {
  PAGE_HEADER,
  PAGE_TITLE,
  PAGE_SUBTITLE,
  PAGE_HEADER_ACTIONS,
} from "@/lib/ui";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, right, className }: PageHeaderProps) {
  return (
    <div className={cn(PAGE_HEADER, className)}>
      <div className="min-w-0">
        <h1 className={PAGE_TITLE}>{title}</h1>
        {subtitle && <p className={cn(PAGE_SUBTITLE, "mt-1")}>{subtitle}</p>}
      </div>
      {right != null && <div className={PAGE_HEADER_ACTIONS}>{right}</div>}
    </div>
  );
}
