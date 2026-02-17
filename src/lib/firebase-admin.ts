import { getApps, initializeApp, getApp, cert, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { env } from "@/lib/env.mjs";

let app: App | null = null;
let adminAuth: Auth | null = null;

function getFirebaseAdmin(): { app: App; auth: Auth } | null {
  if (adminAuth) return { app: app!, auth: adminAuth };

  const projectId = env.server.FIREBASE_ADMIN_PROJECT_ID?.trim();
  const clientEmail = env.server.FIREBASE_ADMIN_CLIENT_EMAIL?.trim();
  let privateKey = env.server.FIREBASE_ADMIN_PRIVATE_KEY?.trim();
  if (!projectId || !clientEmail || !privateKey) return null;

  if (privateKey.includes("\\n")) {
    privateKey = privateKey.replace(/\\n/g, "\n");
  }

  try {
    app = getApps().length ? getApp() : initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    adminAuth = getAuth(app);
    return { app, auth: adminAuth };
  } catch {
    return null;
  }
}

export function getAdminAuth(): Auth | null {
  const admin = getFirebaseAdmin();
  return admin?.auth ?? null;
}
