"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface DashboardTestSmsCardProps {
  phoneNumber: string;
}

export function DashboardTestSmsCard({ phoneNumber }: DashboardTestSmsCardProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(phoneNumber.replace(/\D/g, "").replace(/^1?/, "+1") || phoneNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-xl border border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="w-full p-4 flex items-center justify-between gap-2 text-left min-h-[44px] hover:bg-orange-100/50 dark:hover:bg-orange-900/20 transition-colors"
        aria-expanded={expanded}
      >
        <span className="font-semibold text-sm">Try it once: Text this number to see live replies</span>
        {expanded ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
      </button>
      {expanded && (
        <div className="px-4 pb-4 pt-0 border-t border-orange-200/50 dark:border-orange-800/50">
          <div className="font-mono bg-white dark:bg-background p-3 rounded mt-3 flex items-center justify-between gap-2">
            <span className="truncate text-sm">{phoneNumber}</span>
            <Button type="button" variant="outline" size="sm" onClick={handleCopy} className="shrink-0 min-h-[36px]">
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <Button asChild variant="outline" size="sm" className="mt-3 min-h-[44px]">
            <Link href="/app/messages">Refresh Inbox</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
