"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export interface NewLeadAlertItem {
  name: string;
  time: string;
  leadId?: string;
}

const DEMO_ALERTS: NewLeadAlertItem[] = [
  { name: "Maria Santos", time: "2 min ago", leadId: "2" },
  { name: "John Doe", time: "5 min ago", leadId: "1" },
];

interface NewLeadAlertBannerProps {
  alerts?: NewLeadAlertItem[];
}

export function NewLeadAlertBanner({ alerts = DEMO_ALERTS }: NewLeadAlertBannerProps) {
  const items = alerts.slice(0, 2);
  if (items.length === 0) return null;

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 space-y-2">
            {items.map((a) => (
              <p key={a.name + a.time} className="text-sm font-medium">
                New text from <span className="text-foreground">{a.name}</span>{" "}
                <span className="text-muted-foreground font-normal">{a.time}</span>
                {" – "}
                <span className="text-primary font-medium">Reply now</span>
              </p>
            ))}
          </div>
          <Button asChild size="sm" className="shrink-0 min-h-[44px] sm:min-h-[36px]">
            <Link href={items[0]?.leadId ? `/app/messages?leadId=${items[0].leadId}` : "/app/messages"} className="gap-2">
              <MessageSquare className="h-4 w-4" />
              View
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
