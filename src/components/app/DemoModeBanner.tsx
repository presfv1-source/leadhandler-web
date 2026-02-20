"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "leadhandler-demo-banner-dismissed";

interface DemoModeBannerProps {
  demoEnabled: boolean;
  isOwner: boolean;
  /** When true (Airtable connected), show "Turn off Demo Mode" instead of "Connect in Settings" */
  hasBackendConnected?: boolean;
}

export function DemoModeBanner({ demoEnabled, isOwner, hasBackendConnected = false }: DemoModeBannerProps) {
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
        "bg-yellow-50 border-b border-yellow-200 text-yellow-800 text-xs text-center py-2 font-medium shrink-0 font-sans px-4"
      )}
      role="status"
      aria-label="Demo mode notice"
    >
      <span>
        Demo Mode — using sample data. Toggle off in the top bar to connect live integrations.
        {!hasBackendConnected && isOwner && (
          <>
            {" "}
            <Link
              href="/app/settings"
              className="font-medium text-yellow-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 rounded"
            >
              Connect in Settings
            </Link>
          </>
        )}
      </span>
      <button
        type="button"
        onClick={handleDismiss}
        className="ml-1 p-2 -m-1 min-h-[44px] min-w-[44px] flex items-center justify-center rounded hover:bg-yellow-100 text-yellow-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500"
        aria-label="Dismiss demo notice"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
