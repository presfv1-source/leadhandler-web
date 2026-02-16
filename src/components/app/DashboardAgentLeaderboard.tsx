"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { ResponsiveDataList } from "@/components/app/ResponsiveDataList";
import { Card, CardContent } from "@/components/ui/card";
import type { Agent } from "@/lib/types";

const agentColumns: ColumnDef<Agent>[] = [
  { accessorKey: "name", header: "Agent" },
  {
    accessorKey: "metrics.leadsAssigned",
    header: "Leads",
    cell: ({ row }) => row.original.metrics?.leadsAssigned ?? 0,
  },
  {
    accessorKey: "metrics.qualifiedCount",
    header: "Qualified",
    cell: ({ row }) => row.original.metrics?.qualifiedCount ?? 0,
  },
  {
    accessorKey: "metrics.appointmentsSet",
    header: "Appointments",
    cell: ({ row }) => row.original.metrics?.appointmentsSet ?? 0,
  },
  {
    accessorKey: "metrics.closedCount",
    header: "Closed",
    cell: ({ row }) => row.original.metrics?.closedCount ?? 0,
  },
];

interface DashboardAgentLeaderboardProps {
  agents: Agent[];
}

export function DashboardAgentLeaderboard({ agents }: DashboardAgentLeaderboardProps) {
  return (
    <ResponsiveDataList
      columns={agentColumns}
      data={agents}
      mobileCard={(row) => (
        <Card className="min-w-0">
          <CardContent className="min-w-0 p-4">
            <p className="font-medium truncate">{row.original.name}</p>
            <p className="text-sm text-muted-foreground">
              Leads: {row.original.metrics?.leadsAssigned} | Closed:{" "}
              {row.original.metrics?.closedCount}
            </p>
          </CardContent>
        </Card>
      )}
      emptyMessage="No agents yet."
    />
  );
}
