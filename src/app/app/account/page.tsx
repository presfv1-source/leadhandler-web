"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { User, LogOut, Building2, Database } from "lucide-react";
import { toast } from "sonner";
import { DemoAirtableModal } from "@/components/app/DemoAirtableModal";

export default function AccountPage() {
  const router = useRouter();
  const [session, setSession] = useState<{ name?: string; role: string; demoEnabled?: boolean } | null>(null);
  const [demoEnabled, setDemoEnabled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/session").then((r) => r.json()),
      fetch("/api/demo/state").then((r) => r.json()),
    ]).then(([sessionRes, demoRes]) => {
      if (sessionRes.success && sessionRes.data) setSession(sessionRes.data);
      if (demoRes.success && demoRes.data?.enabled != null) setDemoEnabled(demoRes.data.enabled);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/session", { method: "DELETE" });
    toast.success("You have been logged out");
    router.push("/login");
    router.refresh();
  }

  async function handleDemoToggle(checked: boolean) {
    try {
      const res = await fetch("/api/demo/state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: checked }),
      });
      const data = await res.json();
      if (data.success) {
        setDemoEnabled(checked);
        toast.success(checked ? "Demo mode on" : "Demo mode off");
        router.refresh();
      } else {
        toast.error("Could not update demo mode");
      }
    } catch {
      toast.error("Could not update demo mode");
    }
  }

  async function handleRoleSwitch(role: "owner" | "agent") {
    await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, name: session?.name }),
    });
    router.refresh();
    setSession((prev) => (prev ? { ...prev, role } : null));
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const displayName =
    session?.demoEnabled === false
      ? (session?.role === "owner" ? "Broker" : "Agent")
      : (session?.name ?? "User");
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Account</h1>
        <p className="text-muted-foreground mt-1">Profile and preferences</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-lg">{displayName}</p>
              <p className="text-sm text-muted-foreground">{session?.role === "owner" ? "Broker" : "Agent"}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Role (Demo)</p>
            <p className="text-sm text-muted-foreground mb-2">
              Switch role to change navigation. Changes are saved to session.
            </p>
            <div className="flex gap-2">
              <Button
                variant={session?.role === "owner" ? "default" : "outline"}
                size="sm"
                onClick={() => handleRoleSwitch("owner")}
              >
                <Building2 className="h-4 w-4 mr-2" />
                Broker
              </Button>
              <Button
                variant={session?.role === "agent" ? "default" : "outline"}
                size="sm"
                onClick={() => handleRoleSwitch("agent")}
              >
                <User className="h-4 w-4 mr-2" />
                Agent
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="demo-toggle">Toggle Demo Mode</Label>
              <p className="text-xs text-muted-foreground">Use demo data when lead sync is not connected.</p>
            </div>
            <Switch
              id="demo-toggle"
              checked={demoEnabled ?? false}
              onCheckedChange={handleDemoToggle}
            />
          </div>
          <Button variant="outline" onClick={() => setDemoModalOpen(true)} className="w-full justify-center gap-2 min-h-[44px]">
            <Database className="h-4 w-4" />
            Access Demo lead sync info
          </Button>
          <Button variant="destructive" onClick={handleLogout} className="min-h-[44px]">
            <LogOut className="h-4 w-4 mr-2" />
            Log out
          </Button>
        </CardContent>
      </Card>
      <DemoAirtableModal open={demoModalOpen} onOpenChange={setDemoModalOpen} />
    </div>
  );
}
