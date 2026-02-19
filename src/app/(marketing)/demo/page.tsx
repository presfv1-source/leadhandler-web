"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Route,
  MessageSquare,
  UserPlus,
  Clock,
  User,
} from "lucide-react";
import { MarketingHeader } from "@/components/app/MarketingHeader";
import { MarketingFooter } from "@/components/app/MarketingFooter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CONTAINER, PAGE_PADDING, SECTION_CARD } from "@/lib/ui";
import { cn } from "@/lib/utils";

const SAMPLE_STATS = [
  { label: "New leads", value: "12" },
  { label: "Avg first reply", value: "2.5 min" },
  { label: "Conversations active", value: "8" },
  { label: "Routed today", value: "3" },
];

const SAMPLE_LEADS = [
  { name: "James R.", source: "Zillow", status: "New", time: "2m ago" },
  { name: "Maria S.", source: "Realtor.com", status: "Contacted", time: "15m ago" },
  { name: "David K.", source: "Website", status: "Qualified", time: "1h ago" },
];

const SAMPLE_ROUTING = [
  { rule: "Round-robin", detail: "Leads rotate evenly across active agents" },
  { rule: "Weighted", detail: "Assign more leads to top performers" },
  { rule: "Escalation", detail: "Reassign if no reply within set time" },
];

const SAMPLE_INBOX = [
  { name: "James R.", preview: "When can we tour?", time: "2m ago" },
  { name: "Maria S.", preview: "Thanks! See you Saturday", time: "15m ago" },
  { name: "David K.", preview: "Interested in 3br in Heights", time: "1h ago" },
];

export default function DemoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MarketingHeader />

      <main className="flex-1">
        <section className={cn(CONTAINER, PAGE_PADDING, "pt-8 pb-4")}>
          <div
            className={cn(
              "rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-center text-sm text-foreground"
            )}
          >
            Sample data shown. Book a demo to see it connected to your brokerage.
          </div>
        </section>

        <section className={cn(CONTAINER, PAGE_PADDING, "py-6")}>
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
              See LeadHandler in action
            </h1>
            <p className="text-muted-foreground">
              Instant SMS follow-up, lead qualification, and routing — all in one place.
            </p>
          </div>

          <Tabs defaultValue="dashboard" className="w-full max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto gap-1 p-1 bg-muted/50">
              <TabsTrigger value="dashboard" className="gap-2">
                <LayoutDashboard className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="leads" className="gap-2">
                <Users className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Leads</span>
              </TabsTrigger>
              <TabsTrigger value="routing" className="gap-2">
                <Route className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Routing</span>
              </TabsTrigger>
              <TabsTrigger value="inbox" className="gap-2">
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Inbox</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="mt-6">
              <div className={cn(SECTION_CARD, "p-6 min-w-0")}>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
                  Dashboard preview
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                  {SAMPLE_STATS.map((s) => (
                    <div
                      key={s.label}
                      className="rounded-lg border bg-card px-4 py-3 shadow-sm flex items-center gap-3 min-w-0"
                    >
                      <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                        {s.label === "New leads" ? (
                          <UserPlus className="h-4 w-4 text-primary" />
                        ) : s.label === "Avg first reply" ? (
                          <Clock className="h-4 w-4 text-primary" />
                        ) : s.label === "Conversations active" ? (
                          <User className="h-4 w-4 text-primary" />
                        ) : (
                          <Route className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground truncate">{s.label}</p>
                        <p className="text-lg font-semibold truncate">{s.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Your real dashboard will show live metrics and recent activity when connected.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="leads" className="mt-6">
              <div className={cn(SECTION_CARD, "p-6 min-w-0")}>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
                  Leads preview
                </p>
                <div className="rounded-lg border bg-card divide-y overflow-hidden min-w-0">
                  {SAMPLE_LEADS.map((l) => (
                    <div
                      key={l.name}
                      className="flex flex-wrap items-center gap-3 px-4 py-3 hover:bg-muted/30 min-w-0"
                    >
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{l.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{l.source}</p>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground shrink-0">
                        {l.status}
                      </span>
                      <span className="text-xs text-muted-foreground shrink-0">{l.time}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Filter by source, agent, and stage when your brokerage is connected.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="routing" className="mt-6">
              <div className={cn(SECTION_CARD, "p-6 min-w-0")}>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
                  Routing preview
                </p>
                <ul className="space-y-3 min-w-0">
                  {SAMPLE_ROUTING.map((r) => (
                    <li key={r.rule} className="flex gap-3 p-3 rounded-lg border bg-card">
                      <Route className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="font-medium text-sm">{r.rule}</p>
                        <p className="text-xs text-muted-foreground">{r.detail}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-muted-foreground mt-4">
                  Configure round-robin, weighted, or performance-based rules in your account.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="inbox" className="mt-6">
              <div className={cn(SECTION_CARD, "p-6 min-w-0")}>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
                  Inbox preview
                </p>
                <div className="rounded-lg border bg-card divide-y overflow-hidden min-w-0">
                  {SAMPLE_INBOX.map((t) => (
                    <div
                      key={t.name}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 min-w-0"
                    >
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{t.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{t.preview}</p>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">{t.time}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  One shared inbox for your team when connected to your number.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Button asChild size="lg" className="min-h-[44px]">
              <Link href="/contact">Book a Demo</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-h-[44px]">
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
