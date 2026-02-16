"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, LogOut, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DemoBadge } from "./DemoBadge";
import { MobileNav } from "./MobileNav";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";

interface TopbarProps {
  session: { name?: string; role: Role } | null;
  demoEnabled: boolean;
  isOwner: boolean;
  onDemoToggle?: (enabled: boolean) => void;
  className?: string;
}

export function Topbar({
  session,
  demoEnabled,
  isOwner,
  onDemoToggle,
  className,
}: TopbarProps) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/session", { method: "DELETE" });
    router.push("/login");
    router.refresh();
  }

  async function handleDemoToggle(enabled: boolean) {
    await fetch("/api/demo/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled }),
    });
    onDemoToggle?.(enabled);
    router.refresh();
  }

  const displayName =
    !demoEnabled ? (session?.role === "owner" ? "Owner" : "Agent") : (session?.name ?? "User");
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <header
      className={cn(
        "flex h-14 items-center gap-4 border-b bg-background px-4 shrink-0",
        className
      )}
    >
      <MobileNav role={session?.role ?? "agent"} open={mobileOpen} onOpenChange={setMobileOpen} />
      <div className="flex-1 flex items-center gap-4">
        <div className="hidden sm:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              className="pl-9 bg-muted/50"
              readOnly
            />
          </div>
        </div>
        {demoEnabled && (
          <DemoBadge
            enabled={demoEnabled}
            onToggle={isOwner ? handleDemoToggle : undefined}
            ownerOnly={isOwner}
          />
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-11 w-11 min-h-[44px] min-w-[44px] rounded-full md:h-9 md:w-9 md:min-h-0 md:min-w-0">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span>{displayName}</span>
              <span className="text-xs font-normal text-muted-foreground">
                {session?.role === "owner" ? "Owner" : "Agent"}
                {demoEnabled && <span className="ml-0.5">(Demo)</span>}
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="max-md:min-h-[44px]">
            <a href="/app/account" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              Account
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="max-md:min-h-[44px]">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
