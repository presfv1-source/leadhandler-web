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
import { toast } from "sonner";

function RoutingForm() {
  const [saving, setSaving] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const timeoutInput = form.elements.namedItem("timeout") as HTMLInputElement;
    const timeout = timeoutInput ? parseInt(timeoutInput.value, 10) : NaN;
    if (Number.isNaN(timeout) || timeout < 5) {
      toast.error("Response timeout must be at least 5 minutes");
      return;
    }
    setSaving(true);
    toast.success("Saved!");
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
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
                  <input type="radio" name="mode" value="round-robin" defaultChecked />
                  <span>Round Robin</span>
                </label>
              </TooltipTrigger>
              <TooltipContent>Leads rotate evenly among available agents.</TooltipContent>
            </Tooltip>
            <label className="flex items-center gap-2 cursor-pointer text-muted-foreground">
              <input type="radio" name="mode" value="weighted" disabled />
              <span>Weighted (coming soon)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-muted-foreground">
              <input type="radio" name="mode" value="performance" disabled />
              <span>Performance (coming soon)</span>
            </label>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Escalation</CardTitle>
          <p className="text-sm text-muted-foreground">
            When a lead isn’t responded to within the time limit, notify the escalation contact so no lead goes cold.
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
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="escalate">Escalate to</Label>
            <Input
              id="escalate"
              name="escalate"
              type="email"
              placeholder="Broker or manager email"
            />
          </div>
        </CardContent>
      </Card>
      <Button type="submit" disabled={saving} className="min-h-[44px]">
        Save
      </Button>
    </form>
  );
}

export default function RoutingPage() {
  return (
    <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Routing</h1>
          <p className="text-muted-foreground mt-1">
            Configure how leads are distributed
          </p>
        </div>
        <RoutingForm />
    </div>
  );
}
