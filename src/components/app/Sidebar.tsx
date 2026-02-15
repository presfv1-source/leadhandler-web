"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
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

interface SidebarProps {
  role: Role;
  className?: string;
}

export function Sidebar({ role, className }: SidebarProps) {
  const pathname = usePathname();
  const filtered = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col w-64 border-r bg-card shrink-0",
        className
      )}
    >
      <nav className="flex-1 p-4 space-y-1">
        {filtered.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
