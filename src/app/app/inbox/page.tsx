"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Send, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { AirtableErrorFallback } from "@/components/app/AirtableErrorFallback";
import { EmptyState } from "@/components/app/EmptyState";
import { PageHeader } from "@/components/app/PageHeader";
import { StatusBadge } from "@/components/app/Badge";
import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import type { LeadStatus } from "@/lib/types";

interface Message {
  id: string;
  direction: "in" | "out";
  body: string;
  createdAt: string;
  leadId?: string;
  from?: string;
}

interface Lead {
  id: string;
  name: string;
  phone?: string;
  source?: string;
  status?: LeadStatus;
  assignedTo?: string;
  assignedToName?: string;
}

function formatRelative(time: string): string {
  const d = new Date(time);
  const now = Date.now();
  const diff = now - d.getTime();
  if (diff < 60 * 1000) return "Just now";
  if (diff < 60 * 60 * 1000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / 3600000)}h ago`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function InboxPage() {
  const searchParams = useSearchParams();
  const { isOwner } = useUser();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [body, setBody] = useState("");
  const [searchName, setSearchName] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "mine" | "unread" | "hot">("all");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [demoEnabled, setDemoEnabled] = useState(false);

  const filteredLeads = searchName.trim()
    ? leads.filter((l) => l.name.toLowerCase().includes(searchName.trim().toLowerCase()))
    : leads;

  useEffect(() => {
    Promise.all([
      fetch("/api/demo/state", { credentials: "include" }).then((r) => r.json()),
      fetch("/api/airtable/leads", { credentials: "include" }).then((r) => r.json()),
    ]).then(([demoRes, leadsRes]) => {
      if (demoRes.success && demoRes.data?.enabled) setDemoEnabled(true);
      if (leadsRes.success && leadsRes.data) {
        const l = leadsRes.data as Lead[];
        setLeads(l.slice(0, 50));
        if (l.length > 0) {
          const fromUrl = searchParams.get("leadId");
          const toSelect = fromUrl && l.some((x) => x.id === fromUrl) ? fromUrl : l[0].id;
          setSelectedLeadId(toSelect);
        }
        setLoadError(leadsRes.error?.code === "AUTHENTICATION_REQUIRED");
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [searchParams]);

  useEffect(() => {
    const fromUrl = searchParams.get("leadId");
    if (fromUrl && leads.some((l) => l.id === fromUrl)) setSelectedLeadId(fromUrl);
  }, [searchParams, leads]);

  useEffect(() => {
    if (!selectedLeadId) return;
    const params = new URLSearchParams({ leadId: selectedLeadId });
    fetch(`/api/airtable/messages?${params}`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) setMessages(data.data as Message[]);
        else setMessages([]);
      })
      .catch(() => setMessages([]));
  }, [selectedLeadId]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || !selectedLeadId) return;
    if (demoEnabled) {
      toast.info("SMS sending disabled in demo mode");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: body.trim(), leadId: selectedLeadId }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Message sent");
        setBody("");
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now()}`,
            direction: "out",
            body: body.trim(),
            createdAt: new Date().toISOString(),
            leadId: selectedLeadId,
          },
        ]);
      } else {
        toast.error(data.error?.message ?? "Failed to send");
      }
    } catch {
      toast.error("Failed to send");
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row h-[calc(100vh-12rem)] gap-4 min-w-0">
        <Skeleton className="w-full md:w-80 shrink-0 h-48 md:h-full rounded-2xl" />
        <Skeleton className="flex-1 min-h-64 md:min-h-0 rounded-2xl" />
      </div>
    );
  }

  if (leads.length === 0 && !loadError) {
    return (
      <div className="space-y-6 w-full">
        <EmptyState
          icon={MessageSquare}
          title="No conversations yet"
          description="Turn on Demo Mode or connect sources in Settings to see messages here."
          action={{ label: "Go to Settings", href: "/app/settings" }}
        />
      </div>
    );
  }

  const selectedLead = leads.find((l) => l.id === selectedLeadId);
  const agentName = selectedLead?.assignedToName ?? "Agent";

  return (
    <div className="space-y-4 flex flex-col min-h-0">
      <PageHeader title="Inbox" subtitle="SMS conversations with your leads" />
      <div className="flex flex-col md:flex-row flex-1 min-h-[400px] gap-0 md:gap-4 min-w-0 h-[calc(100vh-14rem)]">
      {/* Left: conversation list */}
      <Card className="w-full md:w-80 shrink-0 flex flex-col rounded-2xl border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="py-4 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search conversations..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="pl-9 h-10 bg-slate-50 border-slate-200 font-sans"
            />
          </div>
          <div className="flex gap-1 mt-3">
            {(["all", "mine", "unread", "hot"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilterTab(tab)}
                className={cn(
                  "px-2.5 py-1.5 rounded-lg text-xs font-medium font-sans capitalize",
                  filterTab === tab
                    ? "bg-blue-600 text-white"
                    : "text-slate-500 hover:bg-slate-100"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-0 min-h-0">
          {filteredLeads.map((lead) => {
            const isActive = selectedLeadId === lead.id;
            const initials = lead.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
            return (
              <button
                key={lead.id}
                type="button"
                onClick={() => setSelectedLeadId(lead.id)}
                className={cn(
                  "w-full text-left px-4 py-3 min-h-[44px] flex items-center gap-3 border-b border-slate-100 last:border-0 transition-colors",
                  isActive ? "bg-blue-50 border-l-4 border-l-blue-600" : "hover:bg-slate-50"
                )}
              >
                <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium text-slate-600 flex-shrink-0">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("font-medium truncate font-sans", isActive && "text-slate-900")}>
                    {lead.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate font-sans">Last message preview…</p>
                </div>
                <div className="shrink-0 text-xs text-slate-400 font-sans">
                  {formatRelative(new Date().toISOString())}
                </div>
                {lead.status && (
                  <StatusBadge
                    variant={
                      lead.status === "new"
                        ? "new"
                        : lead.status === "contacted"
                          ? "contacted"
                          : lead.status === "qualified"
                            ? "qualified"
                            : lead.status === "appointment"
                              ? "appointment"
                              : lead.status === "closed"
                                ? "closed"
                                : lead.status === "lost"
                                  ? "lost"
                                  : "contacted"
                    }
                  >
                    {lead.status}
                  </StatusBadge>
                )}
              </button>
            );
          })}
        </CardContent>
      </Card>

      {/* Right: thread */}
      <Card className="flex-1 flex flex-col min-w-0 min-h-0 rounded-2xl border-slate-200 shadow-sm overflow-hidden">
        {selectedLeadId && selectedLead ? (
          <>
            <CardHeader className="py-4 border-b border-slate-200 flex flex-row items-center justify-between gap-2 flex-wrap">
              <div className="min-w-0">
                <h2 className="font-display font-semibold text-slate-900 truncate">
                  {selectedLead.name}
                </h2>
                <p className="text-sm text-slate-500 font-sans">
                  {selectedLead.phone ?? ""}
                  {selectedLead.source && (
                    <StatusBadge variant="contacted" className="ml-2">
                      {selectedLead.source}
                    </StatusBadge>
                  )}
                  {selectedLead.status && (
                    <StatusBadge
                      variant={
                        selectedLead.status === "qualified"
                          ? "qualified"
                          : selectedLead.status === "appointment"
                            ? "appointment"
                            : "contacted"
                      }
                      className="ml-2"
                    >
                      {selectedLead.status}
                    </StatusBadge>
                  )}
                </p>
              </div>
              <Button variant="outline" size="sm" asChild className="shrink-0 font-sans">
                <Link href={`/app/leads?leadId=${selectedLead.id}`}>View Lead →</Link>
              </Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
              {messages.map((m) => {
                const isOut = m.direction === "out";
                const isSystem = false;
                if (isSystem) {
                  return (
                    <div key={m.id} className="flex justify-center">
                      <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full font-sans">
                        System event
                      </span>
                    </div>
                  );
                }
                return (
                  <div
                    key={m.id}
                    className={cn(
                      "flex flex-col gap-0.5",
                      isOut ? "items-end" : "items-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm font-sans",
                        isOut
                          ? "bg-blue-600 text-white"
                          : "bg-white border border-slate-200 text-slate-900"
                      )}
                    >
                      {m.body}
                    </div>
                    <span className="text-xs text-slate-400 px-1 font-sans">
                      {new Date(m.createdAt).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                );
              })}
              {messages.length === 0 && (
                <div className="flex items-center justify-center h-32 text-slate-500 font-sans">
                  <MessageSquare className="h-8 w-8 mr-2" />
                  No messages yet
                </div>
              )}
            </CardContent>
            <div className="p-4 border-t border-slate-200">
              {demoEnabled && (
                <p className="text-xs text-amber-600 mb-2 font-sans" title="SMS disabled in demo mode — connect Twilio to send real messages">
                  SMS disabled in demo mode — connect Twilio to send real messages
                </p>
              )}
              <form onSubmit={handleSend} className="flex gap-2">
                <Textarea
                  placeholder={`Reply as ${agentName}...`}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={2}
                  className="resize-none flex-1 rounded-xl border-slate-200 font-sans"
                />
                <Button
                  type="submit"
                  disabled={sending || !body.trim()}
                  size="icon"
                  className="shrink-0 min-h-[44px] min-w-[44px] bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <CardContent className="flex-1 flex items-center justify-center text-slate-500 font-sans">
            <MessageSquare className="h-12 w-12 mr-2" />
            Select a conversation
          </CardContent>
        )}
        </Card>
      </div>
    </div>
  );
}
