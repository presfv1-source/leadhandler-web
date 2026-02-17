import { getApps, initializeApp, getApp, cert, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { env } from "@/lib/env.mjs";

let app: App | null = null;
let adminAuth: Auth | null = null;

function normalizePrivateKey(value: string): string {
  let key = value.trim();
  if (key.length >= 2) {
    const first = key[0];
    const last = key[key.length - 1];
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      key = key.slice(1, -1);
    }
  }
  return key.replace(/\\n/g, "\n");
}

function getFirebaseAdmin(): { app: App; auth: Auth } {
  if (adminAuth) return { app: app!, auth: adminAuth };

  const projectId = env.server.FIREBASE_ADMIN_PROJECT_ID?.trim();
  const clientEmail = env.server.FIREBASE_ADMIN_CLIENT_EMAIL?.trim();
  const rawKey = env.server.FIREBASE_ADMIN_PRIVATE_KEY?.trim();

  const missing: string[] = [];
  if (!projectId) missing.push("FIREBASE_ADMIN_PROJECT_ID");
  if (!clientEmail) missing.push("FIREBASE_ADMIN_CLIENT_EMAIL");
  if (!rawKey) missing.push("FIREBASE_ADMIN_PRIVATE_KEY");
  if (missing.length > 0) {
    throw new Error(`Missing Firebase Admin env: ${missing.join(", ")}`);
  }

  const privateKey = normalizePrivateKey(rawKey!);

  app = getApps().length ? getApp() : initializeApp({
    credential: cert({
      projectId: projectId!,
      clientEmail: clientEmail!,
      privateKey,
    }),
  });
  adminAuth = getAuth(app);
  return { app, auth: adminAuth };
}

export function getAdminAuth(): Auth | null {
  try {
    return getFirebaseAdmin().auth;
  } catch (e) {
    console.error("[firebase-admin]", e instanceof Error ? e.message : e);
    return null;
  }
}
