"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

interface DevTestToolsSectionProps {
  phoneNumber: string;
}

export function DevTestToolsSection({ phoneNumber }: DevTestToolsSectionProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(phoneNumber.replace(/\D/g, "").replace(/^1?/, "+1") || phoneNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card>
      <CardHeader className="py-4">
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="flex items-center justify-between w-full text-left"
          aria-expanded={expanded}
        >
          <CardTitle className="text-base">Dev / Test Tools</CardTitle>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
        <p className="text-sm text-muted-foreground">
          Test SMS number – useful once to verify replies. Leads already have this number.
        </p>
      </CardHeader>
      {expanded && (
        <CardContent className="pt-0 space-y-3">
          <div className="font-mono bg-muted p-3 rounded flex items-center justify-between gap-2">
            <span className="truncate text-sm">{phoneNumber}</span>
            <Button type="button" variant="outline" size="sm" onClick={handleCopy} className="shrink-0">
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/app/messages">Open Inbox</Link>
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
