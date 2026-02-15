"use client";

import Link from "next/link";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
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
        {demoEnabled && (
          <div className="border-b bg-amber-50 px-4 py-2 text-center text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-200 shrink-0">
            Backend not connected — running in Demo Mode.{" "}
            {isOwner && (
              <Link href="/app/settings" className="font-medium underline hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
                Connect in Settings
              </Link>
            )}
          </div>
        )}
        <main className="flex-1 overflow-auto overflow-x-hidden">
          <div className={cn(CONTAINER, PAGE_PADDING, PAGE_SECTION_GAP, "py-4 sm:py-6")}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
