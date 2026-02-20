"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LeadStatusPill } from "@/components/app/LeadStatusPill";
import type { LeadStatus } from "@/lib/types";
import { toast } from "sonner";

const STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "appointment", label: "Appointment" },
  { value: "closed", label: "Closed" },
  { value: "lost", label: "Lost" },
];

interface LeadStatusSelectProps {
  leadId: string;
  status: LeadStatus;
  demoEnabled: boolean;
}

export function LeadStatusSelect({ leadId, status, demoEnabled }: LeadStatusSelectProps) {
  const router = useRouter();
  const [localStatus, setLocalStatus] = useState<LeadStatus>(status);
  const [updating, setUpdating] = useState(false);
  const displayStatus = demoEnabled ? localStatus : status;

  async function handleChange(value: LeadStatus) {
    if (demoEnabled) {
      setLocalStatus(value);
      toast.success("Updated (demo)");
      return;
    }
    setUpdating(true);
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: value }),
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data?.error?.message ?? "Failed to update status");
        return;
      }
      toast.success("Status updated");
      router.refresh();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  }

  if (updating) {
    return <LeadStatusPill status={displayStatus} />;
  }

  return (
    <Select
      value={displayStatus}
      onValueChange={(v) => handleChange(v as LeadStatus)}
      disabled={updating}
    >
      <SelectTrigger className="w-[140px] font-sans h-8">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        {STATUS_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
