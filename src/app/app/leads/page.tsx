import { Suspense } from "react";
import { getSession, getDemoEnabled } from "@/lib/auth";
import { getDemoLeads } from "@/lib/demo/data";
import { PageHeader } from "@/components/app/PageHeader";
import { ResponsiveDataList } from "@/components/app/ResponsiveDataList";
import { LeadStatusPill } from "@/components/app/LeadStatusPill";
import { EmptyState } from "@/components/app/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import type { Lead } from "@/lib/types";
import Link from "next/link";

async function LeadsContent() {
  const [session, demoEnabled] = await Promise.all([getSession(), getDemoEnabled()]);
  const leads = demoEnabled
    ? getDemoLeads()
    : await import("@/lib/airtable").then((m) => m.getLeads());

  const columns: ColumnDef<Lead>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <Link
          href={`/app/leads/${row.original.id}`}
          className="font-medium text-primary hover:underline"
        >
          {row.original.name}
        </Link>
      ),
    },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <LeadStatusPill status={row.original.status} />,
    },
    { accessorKey: "source", header: "Source" },
    {
      accessorKey: "assignedToName",
      header: "Agent",
      cell: ({ row }) => row.original.assignedToName ?? "—",
    },
  ];

  if (!demoEnabled && leads.length === 0) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <PageHeader title="Leads" subtitle="Manage your leads" />
        <EmptyState
          icon={Users}
          title="No leads yet"
          description="Leads appear here when you connect your lead sources. Turn on Demo Mode to try with example data, or connect your sources in Settings."
          action={{ label: "Go to Settings", href: "/app/settings" }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader title="Leads" subtitle={`${leads.length} total leads`} />
      <ResponsiveDataList
        columns={columns}
        data={leads}
        onRowClick={(row) => {
          if (typeof window !== "undefined") {
            window.location.href = `/app/leads/${row.original.id}`;
          }
        }}
        mobileCard={(row) => (
          <Link href={`/app/leads/${row.original.id}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg">
            <div className="rounded-lg border border-border bg-card p-4 space-y-2 hover:bg-muted/50 transition-colors">
              <p className="font-medium">{row.original.name}</p>
              <p className="text-sm text-muted-foreground">{row.original.email}</p>
              <LeadStatusPill status={row.original.status} />
            </div>
          </Link>
        )}
        emptyMessage="No leads yet."
      />
    </div>
  );
}

export default function LeadsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-8">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-96 w-full" />
        </div>
      }
    >
      <LeadsContent />
    </Suspense>
  );
}
