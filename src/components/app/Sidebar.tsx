"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  GitBranch,
  UserCog,
  BarChart3,
  CreditCard,
  Settings,
  UserCircle,
  LogOut,
} from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";

const ownerNav = [
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/inbox", label: "Conversations", icon: MessageSquare },
  { href: "/app/leads", label: "Leads", icon: Users },
  { href: "/app/agents", label: "Agents", icon: UserCog },
  { href: "/app/routing", label: "Routing", icon: GitBranch },
  { href: "/app/analytics", label: "Performance", icon: BarChart3 },
  { href: "/app/settings", label: "Settings", icon: Settings },
  { href: "/app/billing", label: "Billing", icon: CreditCard },
];

const agentNav = [
  { href: "/app/leads", label: "My Leads", icon: Users },
  { href: "/app/inbox", label: "Conversations", icon: MessageSquare },
];

interface SidebarProps {
  role?: Role;
  className?: string;
}

export function Sidebar({ role: roleProp, className }: SidebarProps) {
  const pathname = usePathname();
  const { user, signOut } = useClerk();
  const { role: roleFromHook } = useUser();
  const role = roleProp ?? roleFromHook;
  const isOwnerRole = role === "owner" || role === "broker";
  const nav = isOwnerRole ? ownerNav : agentNav;

  const firstName = user?.firstName ?? user?.username ?? "User";
  const initials = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .map((n) => String(n)[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  const navContent = (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-4" aria-label="App navigation">
      {nav.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 mx-2 px-3 py-3 rounded-xl transition-colors duration-150 border-l-2",
              isActive
                ? "bg-blue-600/10 text-white border-blue-500 pl-2.5"
                : "border-transparent text-slate-400 hover:bg-slate-800 hover:text-white"
            )}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium font-sans whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-150 delay-75">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );

  const bottomSection = (
    <div className="border-t border-slate-800 p-2 mt-auto shrink-0">
      <Link
        href="/app/account"
        className={cn(
          "flex items-center gap-3 mx-2 px-3 py-3 rounded-xl transition-colors duration-150 border-l-2",
          pathname === "/app/account" || pathname.startsWith("/app/account/")
            ? "bg-blue-600/10 text-white border-blue-500 pl-2.5"
            : "border-transparent text-slate-400 hover:bg-slate-800 hover:text-white"
        )}
      >
        <UserCircle className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm font-medium font-sans whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-150 delay-75">
          Account
        </span>
      </Link>
      <div className="flex items-center gap-3 px-3 py-3 mx-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 delay-75">
        <div className="h-8 w-8 rounded-full bg-slate-600 flex items-center justify-center text-xs font-medium text-white flex-shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-300 truncate">{firstName}</p>
          <p className="text-xs text-slate-500 font-sans">
            {isOwnerRole ? "Owner" : "Agent"}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => signOut({ redirectUrl: "/login" })}
        className="flex items-center gap-3 w-full mx-2 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white text-sm font-sans transition-colors opacity-0 group-hover:opacity-100"
      >
        <LogOut className="w-4 h-4 flex-shrink-0" />
        <span>Sign out</span>
      </button>
    </div>
  );

  return (
    <aside
      className={cn(
        "group hidden md:flex flex-col fixed left-0 top-0 z-40 h-full w-16 hover:w-56 transition-all duration-200 ease-in-out bg-slate-900",
        className
      )}
    >
      <div className="p-4 border-b border-slate-800 shrink-0">
        <Link
          href={isOwnerRole ? "/app/dashboard" : "/app/leads"}
          className="flex items-center gap-3 rounded-xl px-2 py-2 min-h-[44px] text-slate-300 hover:text-white transition-colors"
        >
          <span className="font-display font-bold text-lg text-white flex-shrink-0 w-8 text-center">
            LH
          </span>
          <span className="text-sm font-display font-semibold whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-150 delay-75">
            LeadHandler
          </span>
        </Link>
      </div>
      {navContent}
      {bottomSection}
    </aside>
  );
}

/** Same nav content for mobile drawer (used by Topbar). */
export function SidebarNavContent({
  role,
  onLinkClick,
}: {
  role: Role;
  onLinkClick?: () => void;
}) {
  const pathname = usePathname();
  const isOwner = role === "owner" || role === "broker";
  const nav = isOwner ? ownerNav : agentNav;
  return (
    <nav className="flex flex-col gap-1 py-4" aria-label="App navigation">
      {nav.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onLinkClick}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 mx-2 transition-colors",
              isActive
                ? "bg-blue-600/10 text-white border-l-2 border-blue-500"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            )}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm font-medium font-sans">{item.label}</span>
          </Link>
        );
      })}
      <Link
        href="/app/account"
        onClick={onLinkClick}
        className={cn(
          "flex items-center gap-3 rounded-xl px-4 py-3 mx-2 mt-4 border-t border-slate-800 pt-4 transition-colors",
          pathname === "/app/account"
            ? "bg-blue-600/10 text-white border-l-2 border-blue-500"
            : "text-slate-400 hover:bg-slate-800 hover:text-white"
        )}
      >
        <UserCircle className="h-5 w-5 flex-shrink-0" />
        <span className="text-sm font-medium font-sans">Account</span>
      </Link>
    </nav>
  );
}
