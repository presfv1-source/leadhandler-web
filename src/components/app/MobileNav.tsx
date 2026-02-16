"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Menu,
  LayoutDashboard,
  Users,
  MessageSquare,
  UserCog,
  Settings,
  CreditCard,
  Route,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: Role[];
}

const navItems: NavItem[] = [
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["owner", "agent"] },
  { href: "/app/leads", label: "Leads", icon: Users, roles: ["owner", "agent"] },
  { href: "/app/messages", label: "Messages", icon: MessageSquare, roles: ["owner", "agent"] },
  { href: "/app/agents", label: "Agents", icon: UserCog, roles: ["owner"] },
  { href: "/app/routing", label: "Routing", icon: Route, roles: ["owner"] },
  { href: "/app/billing", label: "Billing", icon: CreditCard, roles: ["owner"] },
  { href: "/app/settings", label: "Settings", icon: Settings, roles: ["owner"] },
  { href: "/app/account", label: "Account", icon: User, roles: ["owner", "agent"] },
];

interface MobileNavProps {
  role: Role;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function MobileNav({ role, open, onOpenChange }: MobileNavProps) {
  const pathname = usePathname();
  const filtered = navItems.filter((item) => item.roles.includes(role));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden h-11 w-11 min-h-[44px] min-w-[44px]">
          <Menu className="h-5 w-5" aria-hidden />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 max-w-[calc(100vw-2rem)] pt-12 overflow-y-auto">
        <nav className="flex flex-col gap-1" aria-label="App navigation">
          {filtered.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onOpenChange?.(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 min-h-[44px] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
