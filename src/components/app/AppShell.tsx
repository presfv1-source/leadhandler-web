"use client";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { DemoModeBanner } from "./DemoModeBanner";
import { CONTAINER, PAGE_PADDING, PAGE_SECTION_GAP } from "@/lib/ui";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";

interface AppShellProps {
  children: React.ReactNode;
  session: { userId: string; role: Role; name?: string; isDemo: boolean } | null;
  demoEnabled: boolean;
}

export function AppShell({ children, session, demoEnabled }: AppShellProps) {
  const isOwner = session?.role === "owner";

  return (
    <div className="flex min-h-screen min-w-0">
      <Sidebar role={session?.role ?? "agent"} />
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <Topbar
          session={session ? { name: session.name, role: session.role } : null}
          demoEnabled={demoEnabled}
          isOwner={isOwner}
        />
        <DemoModeBanner demoEnabled={demoEnabled} isOwner={isOwner} />
        <main className="flex-1 min-w-0 overflow-auto overflow-x-hidden">
          <div className={cn(CONTAINER, PAGE_PADDING, PAGE_SECTION_GAP, "min-w-0 py-4 sm:py-6")}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
