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
        "flex items-center justify-center gap-2 border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm text-amber-800 shrink-0 font-sans"
      )}
      role="status"
      aria-label="Demo mode notice"
    >
      <span>
        Demo Mode — using sample data. Toggle off to connect live integrations.
        {!hasBackendConnected && isOwner && (
          <>
            {" "}
            <Link
              href="/app/settings"
              className="font-medium text-amber-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
            >
              Connect in Settings
            </Link>
          </>
        )}
      </span>
      <button
        type="button"
        onClick={handleDismiss}
        className="ml-1 p-2 -m-1 min-h-[44px] min-w-[44px] flex items-center justify-center rounded hover:bg-amber-100 text-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        aria-label="Dismiss demo notice"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
