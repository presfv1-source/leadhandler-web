"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { User, LogOut, Building2 } from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const [session, setSession] = useState<{ name?: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) {
          setSession(data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/session", { method: "DELETE" });
    router.push("/login");
    router.refresh();
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

  const initials = session?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "U";

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
              <p className="font-medium text-lg">{session?.name ?? "User"}</p>
              <p className="text-sm text-muted-foreground">{session?.role === "owner" ? "Owner" : "Agent"}</p>
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
                Owner
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
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Log out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
