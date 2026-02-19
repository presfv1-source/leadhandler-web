"use client";

import { cn } from "@/lib/utils";
import { Breadcrumbs } from "./Breadcrumbs";
import type { BreadcrumbSegment } from "./Breadcrumbs";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  breadcrumbs?: BreadcrumbSegment[];
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  right,
  breadcrumbs,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4 flex-col items-stretch",
        className
      )}
    >
      {breadcrumbs != null && breadcrumbs.length > 0 && (
        <Breadcrumbs segments={breadcrumbs} className="mb-2" />
      )}
      <div className="flex flex-1 min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-slate-500 sm:text-base font-sans">
              {subtitle}
            </p>
          )}
        </div>
        {right != null && (
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {right}
          </div>
        )}
      </div>
    </div>
  );
}
