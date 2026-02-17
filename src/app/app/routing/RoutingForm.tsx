"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import type { Agent } from "@/lib/types";

type Mode = "round-robin" | "weighted" | "performance";

function derivedWeight(closeRate: number | undefined): number {
  if (closeRate == null) return 5;
  const w = Math.round(closeRate / 10);
  return Math.min(10, Math.max(1, w));
}

interface RoutingFormProps {
  agents: Agent[];
  demoEnabled: boolean;
}

export function RoutingForm({ agents, demoEnabled }: RoutingFormProps) {
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<Mode>("round-robin");
  const [weights, setWeights] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    agents.forEach((a) => {
      init[a.id] = a.roundRobinWeight ?? (a.closeRate != null ? derivedWeight(a.closeRate) : 5);
    });
    return init;
  });
  const [escalationIds, setEscalationIds] = useState<string[]>([]);
  const [prioritizeZillow, setPrioritizeZillow] = useState(false);
  const [zillowAgentIds, setZillowAgentIds] = useState<string[]>([]);

  function handleWeightChange(agentId: string, value: string) {
    const n = parseInt(value, 10);
    if (Number.isNaN(n) || n < 1 || n > 10) return;
    setWeights((prev) => ({ ...prev, [agentId]: n }));
  }

  function toggleEscalation(agentId: string) {
    setEscalationIds((prev) =>
      prev.includes(agentId) ? prev.filter((id) => id !== agentId) : [...prev, agentId]
    );
  }

  function toggleZillowAgent(agentId: string) {
    setZillowAgentIds((prev) =>
      prev.includes(agentId) ? prev.filter((id) => id !== agentId) : [...prev, agentId]
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const timeoutInput = form.elements.namedItem("timeout") as HTMLInputElement;
    const timeout = timeoutInput ? parseInt(timeoutInput.value, 10) : NaN;
    if (Number.isNaN(timeout) || timeout < 5) {
      toast.error("Response timeout must be at least 5 minutes");
      return;
    }
    if (mode === "weighted") {
      const invalid = agents.find((a) => {
        const w = weights[a.id];
        return w == null || w < 1 || w > 10;
      });
      if (invalid) {
        toast.error("All agent weights must be between 1 and 10");
        return;
      }
      const sum = agents.reduce((s, a) => s + (weights[a.id] ?? 0), 0);
      if (sum <= 0) {
        toast.error("Weights must sum to more than 0");
        return;
      }
    }
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
      if (data.success) {
        toast.success("Routing settings saved.");
      } else {
        toast.error(data.error?.message ?? "Could not save routing settings");
      }
    } catch {
      toast.error("Could not save routing settings");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle>Routing mode</CardTitle>
          <p className="text-sm text-muted-foreground">
            How leads are assigned to agents
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="mode"
                    value="round-robin"
                    checked={mode === "round-robin"}
                    onChange={() => setMode("round-robin")}
                  />
                  <span>Round Robin</span>
                </label>
              </TooltipTrigger>
              <TooltipContent>Leads rotate evenly among available agents.</TooltipContent>
            </Tooltip>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="mode"
                value="weighted"
                checked={mode === "weighted"}
                onChange={() => setMode("weighted")}
              />
              <span>Weighted</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="mode"
                value="performance"
                checked={mode === "performance"}
                onChange={() => setMode("performance")}
              />
              <span>Performance</span>
            </label>
          </div>

          {mode === "weighted" && agents.length > 0 && (
            <div className="rounded-md border shadow-sm mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead className="w-[120px]">Weight (1–10)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agents.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium">{a.name}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={1}
                          max={10}
                          value={weights[a.id] ?? 5}
                          onChange={(e) => handleWeightChange(a.id, e.target.value)}
                          className="h-9 w-20"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {mode === "performance" && (
            <div className="mt-4 space-y-2">
              <p className="text-sm text-muted-foreground">
                Weights are auto-set from close rates. Higher close rate = higher weight.
              </p>
              {agents.length > 0 ? (
                <div className="rounded-md border shadow-sm">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Agent</TableHead>
                        <TableHead className="w-[100px]">Close rate</TableHead>
                        <TableHead className="w-[80px]">Weight</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {agents.map((a) => {
                        const rate = a.closeRate ?? (a.metrics?.leadsAssigned
                          ? Math.round((a.metrics.closedCount ?? 0) / (a.metrics.leadsAssigned || 1) * 100)
                          : 0);
                        const w = derivedWeight(rate);
                        return (
                          <TableRow key={a.id}>
                            <TableCell className="font-medium">{a.name}</TableCell>
                            <TableCell>{rate}%</TableCell>
                            <TableCell>{w}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No agents to display.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle>Source-based rules</CardTitle>
          <p className="text-sm text-muted-foreground">
            Prioritize specific agents for certain lead sources (e.g. Zillow).
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={prioritizeZillow}
              onChange={(e) => setPrioritizeZillow(e.target.checked)}
              className="rounded border-input"
            />
            <span className="text-sm font-medium">Prioritize Zillow leads</span>
          </label>
          {prioritizeZillow && agents.length > 0 && (
            <div className="rounded-md border p-3 space-y-2 max-h-[200px] overflow-y-auto">
              <p className="text-xs text-muted-foreground">Agents to prioritize for Zillow:</p>
              {agents.map((a) => (
                <label
                  key={a.id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 rounded px-2 py-1.5 -mx-2 min-h-[44px]"
                >
                  <input
                    type="checkbox"
                    checked={zillowAgentIds.includes(a.id)}
                    onChange={() => toggleZillowAgent(a.id)}
                    className="rounded border-input"
                  />
                  <span className="text-sm">{a.name}</span>
                </label>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle>Escalation</CardTitle>
          <p className="text-sm text-muted-foreground">
            When a lead isn’t responded to within the time limit, notify the selected agents so no lead goes cold.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="timeout">Response timeout (minutes)</Label>
            <Input
              id="timeout"
              name="timeout"
              type="number"
              defaultValue="30"
              min={5}
              required
              className="max-w-[140px]"
            />
          </div>
          <div className="space-y-2">
            <Label>Escalate to</Label>
            {agents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No agents available. Add agents to select escalation targets.</p>
            ) : (
              <div className="rounded-md border p-3 space-y-2 max-h-[200px] overflow-y-auto">
                {agents.map((a) => (
                  <label
                    key={a.id}
                    className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 rounded px-2 py-1.5 -mx-2"
                  >
                    <input
                      type="checkbox"
                      checked={escalationIds.includes(a.id)}
                      onChange={() => toggleEscalation(a.id)}
                      className="rounded border-input"
                    />
                    <span className="text-sm">{a.name}</span>
                    {a.email && (
                      <span className="text-xs text-muted-foreground truncate">{a.email}</span>
                    )}
                  </label>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <Button type="submit" disabled={saving} className="min-h-[44px] rounded-md">
        Save
      </Button>
    </form>
  );
}
