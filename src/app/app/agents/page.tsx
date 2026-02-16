import { Suspense } from "react";
import { getDemoEnabled } from "@/lib/auth";
import { getDemoAgents } from "@/lib/demo/data";
import { DataTable } from "@/components/app/DataTable";
import { EmptyState } from "@/components/app/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { type ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { UserCog, Plus } from "lucide-react";
import type { Agent } from "@/lib/types";

async function AgentsContent() {
  const demoEnabled = await getDemoEnabled();
  const agents = demoEnabled ? getDemoAgents() : await import("@/lib/airtable").then((m) => m.getAgents());

  const columns: ColumnDef<Agent>[] = [
    {
      accessorKey: "name",
      header: "Agent",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.original.avatarUrl} />
            <AvatarFallback>
              {row.original.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    {
      accessorKey: "active",
      header: "Active",
      cell: ({ row }) => (
        <Switch checked={row.original.active} disabled />
      ),
    },
    {
      accessorKey: "metrics.leadsAssigned",
      header: "Leads",
      cell: ({ row }) => row.original.metrics?.leadsAssigned ?? 0,
    },
    {
      accessorKey: "metrics.closedCount",
      header: "Closed",
      cell: ({ row }) => row.original.metrics?.closedCount ?? 0,
    },
  ];

  if (agents.length === 0 && !demoEnabled) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Agents</h1>
          <p className="text-muted-foreground mt-1">Manage your team</p>
        </div>
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
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Agents</h1>
          <p className="text-muted-foreground mt-1">{agents.length} agents</p>
        </div>
        <Button disabled>
          <Plus className="h-4 w-4 mr-2" />
          Add agent
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={agents}
        mobileCard={(row) => (
          <div className="rounded-lg border p-4 flex items-center gap-4 min-h-[44px] min-w-0">
            <Avatar>
              <AvatarImage src={row.original.avatarUrl} />
              <AvatarFallback>
                {row.original.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium">{row.original.name}</p>
              <p className="text-sm text-muted-foreground">{row.original.email}</p>
              <Badge variant={row.original.active ? "default" : "secondary"} className="mt-2">
                {row.original.active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        )}
      />
    </div>
  );
}

export default function AgentsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-8">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-96 w-full" />
        </div>
      }
    >
      <AgentsContent />
    </Suspense>
  );
}
