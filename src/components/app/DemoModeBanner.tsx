"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "leadhandler-demo-banner-dismissed";

interface DemoModeBannerProps {
  demoEnabled: boolean;
  isOwner: boolean;
}

export function DemoModeBanner({ demoEnabled, isOwner }: DemoModeBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      setDismissed(stored === "1");
    } catch {
      setDismissed(false);
    }
  }, []);

  function handleDismiss() {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setDismissed(true);
    } catch {
      setDismissed(true);
    }
  }

  if (!demoEnabled || dismissed) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 border-b border-border/60 bg-muted/40 px-4 py-2 text-center text-sm text-muted-foreground shrink-0"
      )}
      role="status"
      aria-label="Demo mode notice"
    >
      <span>
        Demo: sample data.{" "}
        {isOwner ? (
          <>
            <Link
              href="/app/settings"
              className="font-medium text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              Connect Airtable in Settings
            </Link>{" "}
            to go live.
          </>
        ) : (
          "Connect Airtable in Settings to go live."
        )}
      </span>
      <button
        type="button"
        onClick={handleDismiss}
        className="ml-1 p-2 -m-1 min-h-[44px] min-w-[44px] flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Dismiss demo notice"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
