import { cookies } from "next/headers";
import { auth } from "@/auth";
import { env } from "./env.mjs";
import type { Role } from "./types";

export interface Session {
  userId: string;
  /** Real role from auth (used for demo toggle and backend access). */
  role: Role;
  /** View-as role for UI/nav; only differs when role === 'owner' and lh_view_as is set. */
  effectiveRole: Role;
  name?: string;
  isDemo: boolean;
  /** Set when role is agent: Airtable Agent record id for filtering leads */
  agentId?: string;
}

const OVERRIDE_COOKIE = "lh_session_override";
const VIEW_AS_COOKIE = "lh_view_as";
const VALID_VIEW_AS = ["owner", "broker", "agent"] as const;

function parseOverrideCookie(value: string | undefined): { name?: string } | null {
  if (!value?.trim()) return null;
  try {
    const parsed = JSON.parse(value) as { name?: string };
    return {
      name: typeof parsed.name === "string" ? parsed.name.trim() : undefined,
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<Session | null> {
  const nextAuthSession = await auth();
  const user = nextAuthSession?.user as
    | { userId?: string; role?: Role; name?: string; agentId?: string; email?: string }
    | undefined;
  if (!user) return null;

  const cookieStore = await cookies();
  const override = parseOverrideCookie(cookieStore.get(OVERRIDE_COOKIE)?.value);
  const viewAsRaw = cookieStore.get(VIEW_AS_COOKIE)?.value?.toLowerCase();
  const demoCookie = cookieStore.get("lh_demo")?.value;

  const role = (user.role ?? "broker") as Role;
  const effectiveRole: Role =
    role === "owner" && viewAsRaw && VALID_VIEW_AS.includes(viewAsRaw as Role)
      ? (viewAsRaw as Role)
      : role;

  const name = override?.name ?? user.name ?? user.email?.split("@")[0];
  const userId = user.userId ?? (nextAuthSession as { user?: { id?: string } })?.user?.id ?? "";

  const isDemo =
    role === "owner" &&
    (demoCookie === "true" || (demoCookie !== "false" && env.server.DEMO_MODE_DEFAULT));

  return {
    userId,
    role,
    effectiveRole,
    name: name ?? undefined,
    isDemo,
    agentId: user.agentId,
  };
}

/**
 * Demo is only for owners. Brokers and agents never see demo data.
 */
export async function getDemoEnabled(session?: Session | null): Promise<boolean> {
  if (session?.role !== "owner") return false;
  const cookieStore = await cookies();
  const cookie = cookieStore.get("lh_demo")?.value;
  if (cookie === "true") return true;
  if (cookie === "false") return false;
  return env.server.DEMO_MODE_DEFAULT;
}
