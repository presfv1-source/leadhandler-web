import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { env } from "./env.mjs";
import type { Role } from "./types";

export interface Session {
  userId: string;
  role: Role;
  name?: string;
  isDemo: boolean;
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("lh_session")?.value;
  if (!cookie) return null;
  try {
    const { payload } = await jwtVerify(
      cookie,
      new TextEncoder().encode(env.server.SESSION_SECRET)
    );
    return payload as unknown as Session;
  } catch {
    return null;
  }
}

export async function getDemoEnabled(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("lh_demo")?.value;
  if (cookie === "true") return true;
  if (cookie === "false") return false;
  return env.server.DEMO_MODE_DEFAULT;
}
