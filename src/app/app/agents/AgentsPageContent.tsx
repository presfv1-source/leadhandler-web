"use client";

import { useState } from "react";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { AirtableErrorFallback } from "@/components/app/AirtableErrorFallback";
import { Button } from "@/components/ui/button";
import { UserCog, UserPlus, Pencil, X } from "lucide-react";
import type { Agent } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AgentsPageContentProps {
  agents: Agent[];
  airtableError: boolean;
  showEmptyState: boolean;
}

export function AgentsPageContent({
  agents,
  airtableError,
  showEmptyState,
}: AgentsPageContentProps) {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  if (showEmptyState) {
    return (
      <div className="space-y-8">
        <PageHeader title="Agents" subtitle="Manage your team" />
        <EmptyState
          icon={UserCog}
          title="Add your first agent"
          description="Add team members who will receive and work leads. Connect your sources in Settings or add agents here once set up."
          action={{ label: "Go to Settings", href: "/app/settings" }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title="Agents"
        subtitle={`${agents.length} agents`}
        right={
          <Button
            onClick={() => setInviteOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 font-sans"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Agent
          </Button>
        }
      />
      {airtableError && <AirtableErrorFallback className="mb-4" />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => {
          const initials = agent.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
          return (
            <div
              key={agent.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col"
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-display font-semibold flex-shrink-0">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display font-semibold text-slate-900 truncate">
                    {agent.name}
                  </h3>
                  <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 font-sans">
                    Agent
                  </span>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        agent.active ? "bg-green-500" : "bg-slate-300"
                      )}
                    />
                    <span className="text-xs text-slate-500 font-sans">
                      {agent.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center font-sans text-sm">
                <div>
                  <p className="text-slate-500">Leads</p>
                  <p className="font-semibold text-slate-900">{agent.metrics?.leadsAssigned ?? 0}</p>
                </div>
                <div>
                  <p className="text-slate-500">Avg response</p>
                  <p className="font-semibold text-slate-900">—</p>
                </div>
                <div>
                  <p className="text-slate-500">Appointments</p>
                  <p className="font-semibold text-slate-900">{agent.metrics?.appointmentsSet ?? 0}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 font-sans"
                  onClick={() => setSelectedAgent(agent)}
                >
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="font-sans">
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {inviteOpen && (
        <InviteAgentModal onClose={() => setInviteOpen(false)} />
      )}
      {selectedAgent && (
        <AgentDetailPanel agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
      )}
    </div>
  );
}

function InviteAgentModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/20" onClick={onClose} aria-hidden />
      <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6">
        <h3 className="font-display font-semibold text-lg text-slate-900 mb-4">
          Invite Agent
        </h3>
        <form className="space-y-4 font-sans">
          <div>
            <label className="text-sm font-medium text-slate-700">Full name</label>
            <input
              type="text"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              placeholder="Jane Smith"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              placeholder="jane@example.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Phone (optional)</label>
            <input
              type="tel"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              placeholder="+1 555 000 0000"
            />
          </div>
          <p className="text-xs text-slate-500">Role: Agent</p>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 font-sans">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 font-sans">
              Send Invite
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AgentDetailPanel({ agent, onClose }: { agent: Agent; onClose: () => void }) {
  const initials = agent.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-900/20" aria-hidden onClick={onClose} />
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-xl border-l border-slate-200 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="font-display font-semibold text-lg text-slate-900">{agent.name}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-slate-200 flex items-center justify-center text-xl font-display font-semibold text-slate-700">
              {initials}
            </div>
            <div>
              <p className="font-sans text-slate-600">{agent.email}</p>
              <p className="font-sans text-slate-600">{agent.phone}</p>
              <p className="text-sm text-slate-500 mt-1">
                {agent.active ? "Active" : "Inactive"}
              </p>
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold text-slate-900 mb-2">Stats</h4>
            <ul className="space-y-1 font-sans text-sm text-slate-600">
              <li>Leads assigned: {agent.metrics?.leadsAssigned ?? 0}</li>
              <li>Qualified: {agent.metrics?.qualifiedCount ?? 0}</li>
              <li>Appointments: {agent.metrics?.appointmentsSet ?? 0}</li>
              <li>Closed: {agent.metrics?.closedCount ?? 0}</li>
            </ul>
          </div>
          <Button variant="outline" className="w-full font-sans">
            Edit agent
          </Button>
        </div>
      </div>
    </>
  );
}
