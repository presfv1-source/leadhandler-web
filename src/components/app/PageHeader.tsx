"use client";

import { cn } from "@/lib/utils";
import { Breadcrumbs } from "./Breadcrumbs";
import type { BreadcrumbSegment } from "./Breadcrumbs";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** Alias for right — primary action(s) on the right */
  action?: React.ReactNode;
  right?: React.ReactNode;
  breadcrumbs?: BreadcrumbSegment[];
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  action,
  right,
  breadcrumbs,
  className,
}: PageHeaderProps) {
  const actions = action ?? right;
  return (
    <div className={cn("flex items-start justify-between mb-8", className)}>
      <div className="min-w-0">
        {breadcrumbs != null && breadcrumbs.length > 0 && (
          <Breadcrumbs segments={breadcrumbs} className="mb-2" />
        )}
        <h1 className="font-display font-bold text-2xl text-[#111111]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[#6a6a6a] text-sm mt-1 font-sans">{subtitle}</p>
        )}
      </div>
      {actions != null && (
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
