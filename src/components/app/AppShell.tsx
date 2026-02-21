"use client";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { OnboardingGuard } from "./OnboardingGuard";
import type { Role } from "@/lib/types";

interface AppShellProps {
  children: React.ReactNode;
  session: { userId: string; role: Role; effectiveRole: Role; name?: string; isDemo: boolean } | null;
  demoEnabled: boolean;
  hasBackendConnected?: boolean;
}

export function AppShell({ children, session, demoEnabled, hasBackendConnected = false }: AppShellProps) {
  const isOwner = session?.role === "owner";
  const effectiveRole = session?.effectiveRole ?? session?.role ?? "agent";

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role={effectiveRole} />
      <div className="flex flex-1 flex-col min-w-0 md:ml-16">
        <Topbar
          session={session ? { name: session.name, role: session.role, effectiveRole } : null}
          demoEnabled={demoEnabled}
          isOwner={isOwner}
        />
        <main className="flex-1 p-6 lg:p-8 min-w-0 overflow-auto">
          <OnboardingGuard isOwner={isOwner}>{children}</OnboardingGuard>
        </main>
      </div>
    </div>
  );
}
