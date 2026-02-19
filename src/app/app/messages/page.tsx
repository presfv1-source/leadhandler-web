"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Send, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { AirtableErrorFallback } from "@/components/app/AirtableErrorFallback";
import { EmptyState } from "@/components/app/EmptyState";

interface Message {
  id: string;
  direction: "in" | "out";
  body: string;
  createdAt: string;
  leadId?: string;
}

interface Lead {
  id: string;
  name: string;
}

export default function MessagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [body, setBody] = useState("");
  const [searchName, setSearchName] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const filteredLeads = searchName.trim()
    ? leads.filter((l) => l.name.toLowerCase().includes(searchName.trim().toLowerCase()))
    : leads;

  useEffect(() => {
    const leadIdFromUrl = searchParams.get("leadId");
    fetch("/api/airtable/leads")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) {
          const l = data.data as Lead[];
          setLeads(l.slice(0, 14));
          if (l.length > 0) {
            const toSelect = leadIdFromUrl && l.some((x) => x.id === leadIdFromUrl)
              ? leadIdFromUrl
              : l[0].id;
            setSelectedLeadId(toSelect);
          }
          setLoadError(false);
        } else if (data.success === false && data.error?.code === "AUTHENTICATION_REQUIRED") {
          setLeads([]);
          setLoadError(true);
          toast.error("Check Airtable connection in Settings.");
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setLoadError(true);
        toast.error("Failed to load conversations. Check your connection or try again.");
      });
  }, []);
  useEffect(() => {
    const leadIdFromUrl = searchParams.get("leadId");
    if (leadIdFromUrl && leads.some((l) => l.id === leadIdFromUrl)) {
      setSelectedLeadId(leadIdFromUrl);
    }
  }, [searchParams, leads]);

  useEffect(() => {
    if (!selectedLeadId) return;
    const params = new URLSearchParams({ leadId: selectedLeadId });
    fetch(`/api/airtable/messages?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) {
          setMessages(data.data as Message[]);
        } else {
          setMessages([]);
          if (data.success === false && data.error?.code === "AUTHENTICATION_REQUIRED") {
            toast.error("Check Airtable connection in Settings.");
          }
        }
      })
      .catch(() => {
        setMessages([]);
        toast.error("Failed to load messages.");
      });
  }, [selectedLeadId]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || !selectedLeadId) return;
    const lead = leads.find((l) => l.id === selectedLeadId);
    if (!lead) return;
    setSending(true);
    try {
      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "+15551234567",
          body: body.trim(),
          leadId: selectedLeadId,
        }),
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
        router.refresh();
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
      <div className="flex flex-col md:flex-row h-[calc(100vh-8rem)] gap-4 min-w-0">
        <Skeleton className="w-full md:w-64 shrink-0 h-48 md:h-full" />
        <Skeleton className="flex-1 min-h-64 md:min-h-0" />
      </div>
    );
  }

  if (leads.length === 0 && !loadError) {
    return (
      <div className="space-y-6 sm:space-y-8 w-full">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Your SMS Inbox – Conversations from Leads</h1>
          <p className="text-muted-foreground text-sm">Conversations with leads</p>
        </div>
        <EmptyState
          icon={MessageSquare}
          title="No conversations yet"
          description="Turn on Demo Mode or connect sources in Settings to see messages here."
          action={{ label: "Go to Settings", href: "/app/settings" }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-[calc(100vh-8rem)] md:h-[calc(100vh-10rem)] min-w-0">
      <div className="mb-4 shrink-0">
        <h1 className="text-2xl font-bold">Your SMS Inbox – Conversations from Leads</h1>
        <p className="text-muted-foreground text-sm">Conversations with leads</p>
      </div>
      {loadError && <AirtableErrorFallback className="mb-4 shrink-0" />}
      <div className="flex flex-col md:flex-row flex-1 gap-4 min-h-0 min-w-0 overflow-hidden">
        <Card className="w-full md:w-64 shrink-0 overflow-hidden flex flex-col min-h-0">
          <CardHeader className="py-4 shrink-0">
            <h2 className="font-medium text-sm">Conversations</h2>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search by name..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="pl-8 h-9"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0 min-h-0">
            <div className="space-y-0">
              {filteredLeads.map((lead) => (
                <button
                  key={lead.id}
                  onClick={() => setSelectedLeadId(lead.id)}
                  className={`w-full text-left px-4 py-3 min-h-[44px] text-sm hover:bg-muted/50 transition-colors ${
                    selectedLeadId === lead.id ? "bg-muted" : ""
                  }`}
                >
                  <div className="font-medium truncate">{lead.name}</div>
                </button>
              ))}
              {filteredLeads.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  {searchName.trim() ? "No names match your search." : "No conversations yet"}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
          {selectedLeadId ? (
            <>
              <CardHeader className="py-4 border-b shrink-0">
                <h2 className="font-medium">
                  {leads.find((l) => l.id === selectedLeadId)?.name ?? "Conversation"}
                </h2>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col gap-0.5 ${m.direction === "out" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
                        m.direction === "out"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {m.body}
                    </div>
                    <span className="text-xs text-muted-foreground px-1">
                      {new Date(m.createdAt).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))}
                {messages.length === 0 && (
                  <div className="flex items-center justify-center h-32 text-muted-foreground">
                    <MessageSquare className="h-8 w-8 mr-2" />
                    No messages yet
                  </div>
                )}
              </CardContent>
              <div className="p-4 border-t">
                <form onSubmit={handleSend} className="flex gap-2">
                  <Textarea
                    placeholder="Type a message..."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={2}
                    className="resize-none flex-1"
                  />
                  <Button type="submit" disabled={sending || !body.trim()} size="icon" className="shrink-0 min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mr-2" />
              Select a conversation
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
