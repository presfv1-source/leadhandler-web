"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { DataTable } from "@/components/app/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/app/PageHeader";
import { LeadStatusPill } from "@/components/app/LeadStatusPill";
import { StatusBadge } from "@/components/app/Badge";
import { LeadDetailPanel } from "./LeadDetailPanel";
import { useUser } from "@/hooks/useUser";
import { Search, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Lead, Agent } from "@/lib/types";
import { cn } from "@/lib/utils";

function qualificationColor(score: number): string {
  if (score <= 40) return "bg-red-100 text-red-800";
  if (score <= 70) return "bg-orange-100 text-orange-800";
  return "bg-green-100 text-green-800";
}

/** Demo: derive a stable pseudo score from lead id for display. */
function qualificationScore(leadId: string): number {
  let h = 0;
  for (let i = 0; i < leadId.length; i++) h = (h << 5) - h + leadId.charCodeAt(i);
  return Math.abs(h) % 101;
}

interface LeadsPageClientProps {
  leads: Lead[];
  agents: Agent[];
  airtableError: boolean;
}

export function LeadsPageClient({ leads: initialLeads, agents, airtableError }: LeadsPageClientProps) {
  const { isOwner } = useUser();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [agentFilter, setAgentFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("all");
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  const filteredLeads = useMemo(() => {
    let list = initialLeads;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          (l.phone ?? "").toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") list = list.filter((l) => l.status === statusFilter);
    if (sourceFilter !== "all") list = list.filter((l) => (l.source ?? "") === sourceFilter);
    if (agentFilter !== "all") list = list.filter((l) => l.assignedTo === agentFilter);
    return list;
  }, [initialLeads, search, statusFilter, sourceFilter, agentFilter]);

  const columns: ColumnDef<Lead>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setSelectedLeadId(row.original.id); }}
            className="font-semibold text-slate-900 hover:text-blue-600 text-left font-sans"
          >
            {row.original.name}
          </button>
        ),
      },
      {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => (
          <span className="text-slate-600 font-sans">{row.original.phone ?? "—"}</span>
        ),
      },
      {
        accessorKey: "source",
        header: "Source",
        cell: ({ row }) => (
          <StatusBadge variant="contacted">{row.original.source ?? "—"}</StatusBadge>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <LeadStatusPill status={row.original.status} />,
      },
      {
        id: "qualification",
        header: "Score",
        cell: ({ row }) => {
          const score = qualificationScore(row.original.id);
          return (
            <span
              className={cn(
                "inline-flex rounded-full px-2 py-0.5 text-xs font-medium font-sans",
                qualificationColor(score)
              )}
            >
              {score}
            </span>
          );
        },
      },
      ...(isOwner
        ? [
            {
              accessorKey: "assignedToName",
              header: "Assigned Agent",
              cell: ({ row }: { row: Row<Lead> }) => (
                <span className="font-sans text-slate-600">
                  {row.original.assignedToName ?? "—"}
                </span>
              ),
            } as ColumnDef<Lead>,
          ]
        : []),
      {
        id: "firstReply",
        header: "First Reply",
        cell: () => <span className="text-slate-500 font-sans text-sm">—</span>,
      },
      {
        id: "lastActivity",
        header: "Last Activity",
        cell: ({ row }) => {
          const t = row.original.updatedAt ?? row.original.createdAt;
          if (!t) return "—";
          const d = new Date(t);
          const now = Date.now();
          const diff = now - d.getTime();
          if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
          if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
          return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
        },
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedLeadId(row.original.id)}>
                View
              </DropdownMenuItem>
              {isOwner && (
                <>
                  <DropdownMenuItem>Reassign</DropdownMenuItem>
                  <DropdownMenuItem>Change Status</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [isOwner]
  );

  const selectedLead = selectedLeadId ? initialLeads.find((l) => l.id === selectedLeadId) : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        subtitle={`${filteredLeads.length} leads`}
        right={
          isOwner ? (
            <Button asChild className="bg-blue-600 hover:bg-blue-700 font-sans">
              <Link href="/app/leads?add=1">Add Lead</Link>
            </Button>
          ) : null
        }
      />

      {airtableError && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 font-sans">
          Check Airtable connection in Settings.
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white border-slate-200 font-sans"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px] font-sans">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="qualified">Qualified</SelectItem>
            <SelectItem value="appointment">Appointment</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="lost">Lost</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-[140px] font-sans">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {Array.from(new Set(initialLeads.map((l) => l.source).filter(Boolean))).map((s) => (
              <SelectItem key={s!} value={s!}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isOwner && (
          <Select value={agentFilter} onValueChange={setAgentFilter}>
            <SelectTrigger className="w-[140px] font-sans">
              <SelectValue placeholder="Agent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {agents.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[140px] font-sans">
            <SelectValue placeholder="Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This week</SelectItem>
            <SelectItem value="month">This month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
        <DataTable
          columns={columns}
          data={filteredLeads}
          onRowClick={(row) => setSelectedLeadId(row.original.id)}
        />
      </div>

      {selectedLead && (
        <LeadDetailPanel
          lead={selectedLead}
          onClose={() => setSelectedLeadId(null)}
          isOwner={isOwner}
        />
      )}
    </div>
  );
}
