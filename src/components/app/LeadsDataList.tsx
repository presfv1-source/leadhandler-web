"use client";

import { useRouter } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
import { ResponsiveDataList } from "@/components/app/ResponsiveDataList";
import { LeadStatusPill } from "@/components/app/LeadStatusPill";
import Link from "next/link";
import type { Lead } from "@/lib/types";

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

interface LeadsDataListProps {
  leads: Lead[];
}

export function LeadsDataList({ leads }: LeadsDataListProps) {
  const router = useRouter();

  return (
    <ResponsiveDataList
      columns={columns}
      data={leads}
      onRowClick={(row) => {
        router.push(`/app/leads/${row.original.id}`);
      }}
      mobileCard={(row) => (
        <Link
          href={`/app/leads/${row.original.id}`}
          className="block min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
        >
          <div className="rounded-lg border border-border bg-card p-4 space-y-2 hover:bg-muted/50 transition-colors min-h-[44px] flex flex-col justify-center min-w-0">
            <p className="font-medium truncate">{row.original.name}</p>
            <p className="text-sm text-muted-foreground truncate">{row.original.email}</p>
            <LeadStatusPill status={row.original.status} />
          </div>
        </Link>
      )}
      emptyMessage="No leads yet."
    />
  );
}
