"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Users, Bell } from "lucide-react";
import { toast } from "sonner";
import type { Agent } from "@/lib/types";

interface SettingsSectionsProps {
  session: { name?: string; email?: string } | null;
  agents: Agent[];
}

export function SettingsSections({ session, agents }: SettingsSectionsProps) {
  const router = useRouter();
  const [editName, setEditName] = useState(session?.name ?? "");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);

  function handleNameSave() {
    if (editName.trim() === (session?.name ?? "").trim()) return;
    fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name: editName.trim() }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          toast.success("Profile updated");
          router.refresh();
        } else {
          toast.error(data.error?.message ?? "Could not update name");
        }
      })
      .catch(() => toast.error("Could not update name"));
  }

  function handleEmailAlerts(checked: boolean) {
    setEmailAlerts(checked);
    toast.success(checked ? "Email alerts on" : "Email alerts off");
  }

  function handleSmsAlerts(checked: boolean) {
    setSmsAlerts(checked);
    toast.success(checked ? "SMS alerts on" : "SMS alerts off");
  }

  function handleAddAgent() {
    toast.info("Coming soon");
  }

  function handleRemoveAgent() {
    toast.info("Coming soon");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <p className="text-sm text-muted-foreground">
          Account, team, and notifications
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="account" className="gap-2">
              <User className="h-4 w-4" />
              Account
            </TabsTrigger>
            <TabsTrigger value="team" className="gap-2">
              <Users className="h-4 w-4" />
              Team
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="settings-name">Display name</Label>
              <div className="flex gap-2 flex-wrap">
                <Input
                  id="settings-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Your name"
                  className="max-w-xs h-10"
                />
                <Button size="sm" onClick={handleNameSave} className="min-h-[40px]">
                  Save
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="settings-email">Email</Label>
              <Input
                id="settings-email"
                value={session?.email ?? "—"}
                readOnly
                className="max-w-xs h-10 bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Button variant="outline" size="sm" onClick={() => toast.info("Coming soon")} className="min-h-[40px]">
                Update password
              </Button>
              <p className="text-xs text-muted-foreground">
                Use your account page or sign-in provider to change password.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="team" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Agents in your brokerage</p>
              <Button variant="outline" size="sm" onClick={handleAddAgent} className="min-h-[40px]">
                Add agent
              </Button>
            </div>
            <ul className="space-y-2 rounded-lg border divide-y">
              {agents.map((a) => (
                <li key={a.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="font-medium">{a.name}</p>
                    <p className="text-xs text-muted-foreground">{a.email}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleRemoveAgent} className="text-destructive hover:text-destructive">
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
            {agents.length === 0 && (
              <p className="text-sm text-muted-foreground py-4">No agents yet. Add agents to assign leads.</p>
            )}
          </TabsContent>
          <TabsContent value="notifications" className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">Email alerts on new leads</p>
                <p className="text-sm text-muted-foreground">Get notified by email when a new lead is added</p>
              </div>
              <Switch checked={emailAlerts} onCheckedChange={handleEmailAlerts} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">SMS alerts on new leads</p>
                <p className="text-sm text-muted-foreground">Get a text when a new lead is added</p>
              </div>
              <Switch checked={smsAlerts} onCheckedChange={handleSmsAlerts} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
