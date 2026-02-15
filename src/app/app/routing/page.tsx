"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

function RoutingForm() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        toast.success("Settings saved (stub)");
      }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>Routing mode</CardTitle>
          <p className="text-sm text-muted-foreground">
            How leads are assigned to agents
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="mode" value="round-robin" defaultChecked />
              <span>Round Robin</span>
            </label>
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
              min="5"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="escalate">Escalate to</Label>
            <Input
              id="escalate"
              name="escalate"
              placeholder="Owner or manager email"
            />
          </div>
        </CardContent>
      </Card>
      <Button type="submit">Save</Button>
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
