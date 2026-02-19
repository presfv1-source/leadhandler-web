"use client";

import { useState } from "react";
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
import { Check, GripVertical } from "lucide-react";
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
  const [saving, setSaving] = useState(false);

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

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title="Lead Routing"
        subtitle="Control how new leads are distributed to your agents."
      />
      {airtableError && <AirtableErrorFallback className="mb-4" />}

      {/* Section 1 — Routing Mode */}
      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardHeader>
          <h2 className="font-display font-semibold text-slate-900">Routing Mode</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => setMode("round-robin")}
              className={cn(
                "rounded-2xl border-2 p-4 text-left transition font-sans",
                mode === "round-robin"
                  ? "border-blue-600 bg-blue-50"
                  : "border-slate-200 hover:border-slate-300"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-900">Round Robin</span>
                {mode === "round-robin" && <Check className="h-5 w-5 text-blue-600" />}
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Distribute leads equally across all active agents.
              </p>
            </button>

            {isPro ? (
              <button
                type="button"
                onClick={() => setMode("weighted")}
                className={cn(
                  "rounded-2xl border-2 p-4 text-left transition font-sans",
                  mode === "weighted"
                    ? "border-blue-600 bg-blue-50"
                    : "border-slate-200 hover:border-slate-300"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-900">Weighted</span>
                  {mode === "weighted" && <Check className="h-5 w-5 text-blue-600" />}
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  Assign leads based on custom agent weights.
                </p>
              </button>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 p-4 opacity-80">
                <p className="font-medium text-slate-700 font-sans">Weighted</p>
                <p className="text-sm text-slate-500 mt-1 font-sans">Pro feature</p>
              </div>
            )}

            {isPro ? (
              <button
                type="button"
                onClick={() => setMode("performance")}
                className={cn(
                  "rounded-2xl border-2 p-4 text-left transition font-sans",
                  mode === "performance"
                    ? "border-blue-600 bg-blue-50"
                    : "border-slate-200 hover:border-slate-300"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-900">Performance-based</span>
                  {mode === "performance" && <Check className="h-5 w-5 text-blue-600" />}
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  Route to highest-performing agents automatically.
                </p>
              </button>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 p-4 opacity-80">
                <p className="font-medium text-slate-700 font-sans">Performance-based</p>
                <p className="text-sm text-slate-500 mt-1 font-sans">Pro feature</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section 2 — Agent Queue */}
      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardHeader>
          <h2 className="font-display font-semibold text-slate-900">Agent Queue</h2>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200">
                  <TableHead className="w-10 font-sans text-slate-600"></TableHead>
                  <TableHead className="font-sans text-slate-600">Agent</TableHead>
                  <TableHead className="font-sans text-slate-600">Active</TableHead>
                  <TableHead className="font-sans text-slate-600">Priority</TableHead>
                  <TableHead className="font-sans text-slate-600">Leads today</TableHead>
                  {isPro && (
                    <TableHead className="font-sans text-slate-600">Weight %</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {agents.map((a, idx) => (
                  <TableRow key={a.id} className="border-slate-100">
                    <TableCell className="text-slate-400">
                      <GripVertical className="h-4 w-4" />
                    </TableCell>
                    <TableCell className="font-medium font-sans">{a.name}</TableCell>
                    <TableCell>
                      <Switch checked={a.active} disabled />
                    </TableCell>
                    <TableCell className="font-sans text-slate-600">{idx + 1}</TableCell>
                    <TableCell className="font-sans text-slate-600">
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
            className="mt-4 bg-blue-600 hover:bg-blue-700 font-sans"
          >
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Section 3 — Escalation (Pro only) */}
      {isPro ? (
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader>
            <h2 className="font-display font-semibold text-slate-900">Escalation Rules</h2>
            <p className="text-sm text-slate-500 font-sans mt-1">
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
            <p className="text-sm text-slate-500 font-sans">
              Escalate to: owner (configurable in Settings)
            </p>
            <Button variant="outline" className="font-sans">Add rule</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 p-8">
          <UpgradeCard feature="Escalation Rules" />
        </div>
      )}
    </div>
  );
}
