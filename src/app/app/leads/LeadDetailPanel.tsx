"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadStatusPill } from "@/components/app/LeadStatusPill";
import { StatusBadge } from "@/components/app/Badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Lead } from "@/lib/types";
import { cn } from "@/lib/utils";

function fallbackQualificationScore(leadId: string): number {
  let h = 0;
  for (let i = 0; i < leadId.length; i++) h = (h << 5) - h + leadId.charCodeAt(i);
  return Math.abs(h) % 101;
}

interface LeadDetailPanelProps {
  lead: Lead;
  onClose: () => void;
  isOwner: boolean;
}

export function LeadDetailPanel({ lead, onClose, isOwner }: LeadDetailPanelProps) {
  const [messages, setMessages] = useState<{ id: string; direction: "in" | "out"; body: string; createdAt: string }[]>([]);

  useEffect(() => {
    const params = new URLSearchParams({ leadId: lead.id });
    fetch(`/api/airtable/messages?${params}`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) setMessages(data.data);
        else setMessages([]);
      })
      .catch(() => setMessages([]));
  }, [lead.id]);

  const score = lead.qualificationScore ?? fallbackQualificationScore(lead.id);

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-slate-900/20"
        aria-hidden
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 z-50 h-full w-full md:w-96 bg-white shadow-2xl border-l border-slate-200 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 shrink-0">
          <h2 className="font-display font-semibold text-lg text-slate-900 truncate">
            {lead.name}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <p className="text-sm text-slate-600 font-sans">{lead.phone ?? "—"}</p>
            <div className="flex gap-2 mt-2">
              <StatusBadge variant="contacted">{lead.source ?? "—"}</StatusBadge>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 font-sans uppercase tracking-wider">Status</label>
            <Select defaultValue={lead.status}>
              <SelectTrigger className="mt-1 font-sans">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="appointment">Appointment</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500 font-sans uppercase tracking-wider">Qualification Score</p>
            <p className="text-2xl font-display font-bold text-slate-900 mt-1">{score}/100</p>
            <p className="text-sm text-slate-500 mt-2 font-sans">
              {lead.aiSummary ?? "Lead showing interest. Engaged via SMS. Budget and location documented."}
            </p>
          </div>

          {isOwner && (
            <div>
              <p className="text-xs font-medium text-slate-500 font-sans uppercase tracking-wider">Assigned Agent</p>
              <p className="font-sans text-slate-900 mt-1">{lead.assignedToName ?? "—"}</p>
              <Button variant="outline" size="sm" className="mt-2 font-sans">
                Reassign
              </Button>
            </div>
          )}

          <div>
            <p className="text-xs font-medium text-slate-500 font-sans uppercase tracking-wider mb-2">Conversation</p>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "rounded-2xl px-3 py-2 text-sm font-sans max-w-[90%]",
                    m.direction === "out"
                      ? "ml-auto bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-900"
                  )}
                >
                  {m.body}
                </div>
              ))}
              {messages.length === 0 && (
                <p className="text-sm text-slate-400 font-sans">No messages yet.</p>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500 font-sans uppercase tracking-wider mb-2">Timeline</p>
            <ul className="space-y-2 font-sans text-sm">
              <li className="text-slate-600">Lead created — {new Date(lead.createdAt ?? "").toLocaleString()}</li>
              <li className="text-slate-600">Assigned to {lead.assignedToName ?? "—"}</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
