"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/app/PageHeader";
import { UpgradeCard } from "@/components/app/UpgradeCard";
import { AirtableErrorFallback } from "@/components/app/AirtableErrorFallback";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Check, GripVertical, Info } from "lucide-react";
import { toast } from "sonner";
import type { Agent } from "@/lib/types";
import { cn } from "@/lib/utils";

type Mode = "round-robin" | "weighted" | "performance";

interface RoutingPageContentProps {
  agents: Agent[];
  demoEnabled: boolean;
  airtableError: boolean;
}

export function RoutingPageContent({
  agents,
  demoEnabled,
  airtableError,
}: RoutingPageContentProps) {
  const { isPro } = useUser();
  const [mode, setMode] = useState<Mode>("round-robin");
  const [weights, setWeights] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    agents.forEach((a) => {
      init[a.id] = a.roundRobinWeight ?? (a.closeRate != null ? Math.min(10, Math.max(1, Math.round(a.closeRate / 10))) : 5);
    });
    return init;
  });
  const [escalationMinutes, setEscalationMinutes] = useState("30");
  const [escalationTarget, setEscalationTarget] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingEscalation, setSavingEscalation] = useState(false);

  useEffect(() => {
    if (!isPro || demoEnabled) return;
    fetch("/api/settings/escalation")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) {
          setEscalationTarget(data.data.escalationTarget ?? "");
          if (typeof data.data.escalationMinutes === "number")
            setEscalationMinutes(String(data.data.escalationMinutes));
        }
      })
      .catch(() => {});
  }, [isPro, demoEnabled]);

  async function handleSave() {
    setSaving(true);
    try {
      if (demoEnabled) {
        toast.success("Demo mode: routing settings not persisted.");
        setSaving(false);
        return;
      }
      const res = await fetch("/api/routing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weights }),
      });
      const data = await res.json();
      if (data.success) toast.success("Routing settings saved.");
      else toast.error(data.error?.message ?? "Could not save");
    } catch {
      toast.error("Could not save routing settings");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveEscalation() {
    setSavingEscalation(true);
    try {
      if (demoEnabled) {
        toast.success("Demo mode: escalation settings not persisted.");
        setSavingEscalation(false);
        return;
      }
      const res = await fetch("/api/settings/escalation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          escalationTarget: escalationTarget.trim(),
          escalationMinutes: parseInt(escalationMinutes, 10) || 30,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Escalation settings saved.");
      } else {
        toast.error(data.error?.message ?? "Could not save escalation settings");
      }
    } catch {
      toast.error("Could not save escalation settings");
    } finally {
      setSavingEscalation(false);
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title="Lead Routing"
        subtitle="Control how new leads are distributed to your agents."
      />
      {airtableError && <AirtableErrorFallback className="mb-4" />}

      {/* Section 1 — Routing Mode */}
      <Card className="rounded-2xl border-[#e2e2e2]">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display font-semibold text-[#111111]">Routing Mode</h2>
            <span className="rounded-full bg-[#f0f0f0] px-2.5 py-0.5 text-sm font-medium text-[#111111] font-sans">
              Active: Round Robin
            </span>
          </div>
          <p className="text-sm text-[#a0a0a0] font-sans mt-1 flex items-center gap-1.5">
            <Info className="h-4 w-4 text-[#a0a0a0] shrink-0" aria-hidden />
            Routing logic is managed via Make.com automation.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => setMode("round-robin")}
              className={cn(
                "rounded-2xl border-2 p-4 text-left transition font-sans",
                mode === "round-robin"
                  ? "border-[#111111] bg-[#f5f5f5]"
                  : "border-[#e2e2e2] hover:border-[#d4d4d4]"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-[#111111]">Round Robin</span>
                {mode === "round-robin" && <Check className="h-5 w-5 text-[#111111]" />}
              </div>
              <p className="text-sm text-[#a0a0a0] mt-1">
                Distribute leads equally across all active agents.
              </p>
            </button>

            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="rounded-2xl border-2 border-[#e2e2e2] p-4 opacity-80 cursor-not-allowed relative">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#222222] font-sans">Weighted</span>
                      <span className="rounded bg-[#f5f5f5] px-2 py-0.5 text-xs font-medium text-[#6a6a6a] font-sans">
                        Coming soon
                      </span>
                    </div>
                    <p className="text-sm text-[#a0a0a0] mt-1 font-sans">
                      Assign leads based on custom agent weights.
                    </p>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">Coming soon</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="rounded-2xl border-2 border-[#e2e2e2] p-4 opacity-80 cursor-not-allowed relative">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#222222] font-sans">Performance-based</span>
                      <span className="rounded bg-[#f5f5f5] px-2 py-0.5 text-xs font-medium text-[#6a6a6a] font-sans">
                        Coming soon
                      </span>
                    </div>
                    <p className="text-sm text-[#a0a0a0] mt-1 font-sans">
                      Route to highest-performing agents automatically.
                    </p>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">Coming soon</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>

      {/* Section 2 — Agent Queue */}
      <Card className="rounded-2xl border-[#e2e2e2]">
        <CardHeader>
          <h2 className="font-display font-semibold text-[#111111]">Agent Queue</h2>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-[#e2e2e2]">
                  <TableHead className="w-10 font-sans text-[#6a6a6a]"></TableHead>
                  <TableHead className="font-sans text-[#6a6a6a]">Agent</TableHead>
                  <TableHead className="font-sans text-[#6a6a6a]">Active</TableHead>
                  <TableHead className="font-sans text-[#6a6a6a]">Priority</TableHead>
                  <TableHead className="font-sans text-[#6a6a6a]">Leads today</TableHead>
                  {isPro && (
                    <TableHead className="font-sans text-[#6a6a6a]">Weight %</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {agents.map((a, idx) => (
                  <TableRow key={a.id} className="border-[#f0f0f0]">
                    <TableCell className="text-[#a0a0a0]">
                      <GripVertical className="h-4 w-4" />
                    </TableCell>
                    <TableCell className="font-medium font-sans">{a.name}</TableCell>
                    <TableCell>
                      <Switch checked={a.active} disabled />
                    </TableCell>
                    <TableCell className="font-sans text-[#6a6a6a]">{idx + 1}</TableCell>
                    <TableCell className="font-sans text-[#6a6a6a]">
                      {a.metrics?.leadsAssigned ?? 0}
                    </TableCell>
                    {isPro && (
                      <TableCell>
                        <Input
                          type="number"
                          min={1}
                          max={10}
                          value={weights[a.id] ?? 5}
                          onChange={(e) => {
                            const n = parseInt(e.target.value, 10);
                            if (!Number.isNaN(n) && n >= 1 && n <= 10)
                              setWeights((prev) => ({ ...prev, [a.id]: n }));
                          }}
                          className="h-9 w-20 font-sans"
                        />
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="mt-4 bg-[#111111] hover:opacity-90 font-sans"
          >
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Section 3 — Escalation (Pro only) */}
      {isPro ? (
        <Card className="rounded-2xl border-[#e2e2e2]">
          <CardHeader>
            <h2 className="font-display font-semibold text-[#111111]">Escalation Rules</h2>
            <p className="text-sm text-[#a0a0a0] font-sans mt-1">
              When a lead isn&apos;t responded to in time, escalate to another agent or owner.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="escalation-min" className="font-sans">
                If no reply within (minutes)
              </Label>
              <Input
                id="escalation-min"
                type="number"
                min={5}
                value={escalationMinutes}
                onChange={(e) => setEscalationMinutes(e.target.value)}
                className="mt-1 max-w-[140px] font-sans"
              />
            </div>
            <div>
              <Label htmlFor="escalation-target" className="font-sans">
                Escalate to (phone number or agent name)
              </Label>
              <Input
                id="escalation-target"
                type="text"
                placeholder="e.g. +1234567890 or Agent name"
                value={escalationTarget}
                onChange={(e) => setEscalationTarget(e.target.value)}
                className="mt-1 max-w-sm font-sans"
              />
            </div>
            <Button
              variant="outline"
              className="font-sans"
              onClick={handleSaveEscalation}
              disabled={savingEscalation}
            >
              {savingEscalation ? "Saving…" : "Save escalation settings"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-[#e2e2e2] p-8">
          <UpgradeCard feature="Escalation Rules" />
        </div>
      )}
    </div>
  );
}
