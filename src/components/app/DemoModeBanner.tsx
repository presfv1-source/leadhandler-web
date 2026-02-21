"use client";

interface DemoModeBannerProps {
  demoEnabled: boolean;
}

/** Small muted badge shown in app shell when demo is on. No banner, no toggle. */
export function DemoModeBanner({ demoEnabled }: DemoModeBannerProps) {
  if (!demoEnabled) return null;

  return (
    <span
      className="inline-flex items-center rounded-md bg-[#f5f5f5] px-2 py-1 text-xs font-medium text-[#6a6a6a] font-sans shrink-0"
      role="status"
      aria-label="Demo mode — sample data"
    >
      Demo · Sample data
    </span>
  );
}
