"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  User,
  LogOut,
  Building2,
  Bell,
  Shield,
  Upload,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { DemoAirtableModal } from "@/components/app/DemoAirtableModal";

const NOTIFY_ESCALATIONS_KEY = "leadhandler-pref-escalations";
const NOTIFY_NEW_LEADS_KEY = "leadhandler-pref-new-leads";

function roleLabel(role: string | undefined): string {
  if (role === "owner") return "Owner";
  if (role === "broker") return "Broker";
  if (role === "agent") return "Agent";
  return "User";
}

function getStoredBool(key: string, fallback: boolean): boolean {
  if (typeof window === "undefined") return fallback;
  try {
    const v = sessionStorage.getItem(key);
    if (v === "true") return true;
    if (v === "false") return false;
  } catch {
    // ignore
  }
  return fallback;
}

function setStoredBool(key: string, value: boolean) {
  try {
    sessionStorage.setItem(key, String(value));
  } catch {
    // ignore
  }
}

export default function AccountPage() {
  const router = useRouter();
  const { signOut } = useClerk();
  const { role: clerkRole } = useUser();
  const [session, setSession] = useState<{
    name?: string;
    email?: string;
    role: string;
    effectiveRole?: string;
    demoEnabled?: boolean;
  } | null>(null);
  const [demoEnabled, setDemoEnabled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [notifyEscalations, setNotifyEscalations] = useState(true);
  const [notifyNewLeads, setNotifyNewLeads] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/session", { credentials: "include" }).then((r) => r.json()),
      fetch("/api/demo/state", { credentials: "include" }).then((r) => r.json()),
    ]).then(([sessionRes, demoRes]) => {
      if (sessionRes.success && sessionRes.data) {
        const data = sessionRes.data as { role?: string; effectiveRole?: string; name?: string; email?: string; demoEnabled?: boolean };
        const role = data.role ?? "broker";
        setSession({ ...data, role, effectiveRole: data.effectiveRole ?? role });
        setEditName(data.name ?? "");
      }
      if (demoRes.success && demoRes.data?.enabled != null) setDemoEnabled(demoRes.data.enabled);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    setNotifyEscalations(getStoredBool(NOTIFY_ESCALATIONS_KEY, true));
    setNotifyNewLeads(getStoredBool(NOTIFY_NEW_LEADS_KEY, true));
  }, []);

  async function handleLogout() {
    toast.success("You have been logged out");
    await signOut({ redirectUrl: "/login" });
  }

  function handleViewAs(role: "owner" | "broker" | "agent") {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("viewAsRole", role);
      document.cookie = `lh_view_as=${role}; path=/; max-age=86400`;
    }
    setSession((prev) => (prev ? { ...prev, effectiveRole: role } : null));
    toast.success(`Switched to ${roleLabel(role)} view`);
    requestAnimationFrame(() => router.refresh());
  }

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
          setSession((prev) => (prev ? { ...prev, name: editName.trim() } : null));
          toast.success("Profile updated");
          router.refresh();
        } else {
          toast.error(data.error?.message ?? "Could not update name");
        }
      })
      .catch(() => toast.error("Could not update name"));
  }

  const effectiveRole = session?.effectiveRole ?? session?.role ?? clerkRole;
  const displayName = session?.name ?? (editName || "User");
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title="Account"
        subtitle="Profile, security, and preferences."
      />

      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="font-display">Profile</CardTitle>
          <p className="text-sm text-slate-500 font-sans">Your name and avatar</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-xl font-display font-semibold text-slate-700 bg-slate-200">
                {initials}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" className="gap-2 font-sans" disabled aria-label="Avatar upload coming soon">
              <Upload className="h-4 w-4" />
              Upload photo
            </Button>
          </div>
          <div className="grid gap-4 sm:max-w-md">
            <div>
              <Label htmlFor="profile-name" className="font-sans">Full name</Label>
              <Input
                id="profile-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Your name"
                className="mt-1 font-sans"
              />
            </div>
            <div>
              <Label htmlFor="profile-email" className="font-sans">Email</Label>
              <Input
                id="profile-email"
                value={session?.email ?? "—"}
                readOnly
                className="mt-1 bg-slate-50 font-sans"
              />
            </div>
            <div>
              <Label className="font-sans">Phone</Label>
              <Input placeholder="+1 555 000 0000" className="mt-1 font-sans" />
            </div>
            <p className="text-sm text-slate-500 font-sans">
              Role: <span className="font-medium text-slate-700">{roleLabel(session?.role)}</span>
            </p>
            <Button onClick={handleNameSave} className="bg-blue-600 hover:bg-blue-700 font-sans">
              Save
            </Button>
          </div>
        </CardContent>
      </Card>

      {session?.role === "owner" && (
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="font-display">Preview as Role</CardTitle>
            <p className="text-sm text-slate-500 font-sans">
              Preview the app as Agent or Broker. You can switch back to Owner anytime.
            </p>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button
              variant={effectiveRole === "owner" ? "default" : "outline"}
              size="sm"
              onClick={() => handleViewAs("owner")}
              className="font-sans"
            >
              <Building2 className="h-4 w-4 mr-2" />
              Preview as Owner
            </Button>
            <Button
              variant={effectiveRole === "broker" ? "default" : "outline"}
              size="sm"
              onClick={() => handleViewAs("broker")}
              className="font-sans"
            >
              <Building2 className="h-4 w-4 mr-2" />
              Preview as Broker
            </Button>
            <Button
              variant={effectiveRole === "agent" ? "default" : "outline"}
              size="sm"
              onClick={() => handleViewAs("agent")}
              className="font-sans"
            >
              <User className="h-4 w-4 mr-2" />
              Preview as Agent
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <Bell className="h-5 w-5 text-slate-500" />
            Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
            <div>
              <Label htmlFor="pref-email-lead" className="font-medium font-sans">Email me when a new lead comes in</Label>
              <p className="text-xs text-slate-500 font-sans">Agent preference</p>
            </div>
            <Switch
              id="pref-email-lead"
              checked={notifyNewLeads}
              onCheckedChange={(c) => {
                setNotifyNewLeads(c);
                setStoredBool(NOTIFY_NEW_LEADS_KEY, c);
                toast.success(c ? "Notifications on" : "Notifications off");
              }}
            />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
            <div>
              <Label htmlFor="pref-sms-hot" className="font-medium font-sans">SMS alert for hot leads</Label>
            </div>
            <Switch
              id="pref-sms-hot"
              checked={notifyEscalations}
              onCheckedChange={(c) => {
                setNotifyEscalations(c);
                setStoredBool(NOTIFY_ESCALATIONS_KEY, c);
                toast.success(c ? "SMS alerts on" : "SMS alerts off");
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <Shield className="h-5 w-5 text-slate-500" />
            Security
          </CardTitle>
          <p className="text-sm text-slate-500 font-sans">Password and two-factor authentication</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-slate-500" />
              <div>
                <p className="font-medium font-sans">Change password</p>
                <p className="text-xs text-slate-500 font-sans">Use Clerk to reset your password</p>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild className="font-sans">
              <Link href="/forgot-password">Change password</Link>
            </Button>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4 opacity-70">
            <div>
              <p className="font-medium font-sans">Two-factor authentication (2FA)</p>
              <p className="text-xs text-slate-500 font-sans">Coming soon</p>
            </div>
            <Switch disabled aria-label="2FA coming soon" />
          </div>
        </CardContent>
      </Card>

      {session?.role === "owner" && (
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="font-display">Demo &amp; Integrations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              onClick={() => setDemoModalOpen(true)}
              className="w-full justify-center gap-2 font-sans"
            >
              View Demo Airtable Info
            </Button>
          </CardContent>
        </Card>
      )}

      <Button
        variant="ghost"
        className="text-red-600 hover:text-red-700 hover:bg-red-50 font-sans"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Sign out
      </Button>

      <DemoAirtableModal open={demoModalOpen} onOpenChange={setDemoModalOpen} />
    </div>
  );
}
