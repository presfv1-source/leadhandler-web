import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { getAdminAuth } from "@/lib/firebase-admin";
import { getAirtableUserByEmail, createAirtableUser, getAgentIdByEmail } from "@/lib/airtable";
import { env } from "@/lib/env.mjs";

const DEV_ADMIN_EMAIL = "presfv1@gmail.com";
const SESSION_COOKIE_NAME = "lh_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

type ValidRole = "owner" | "broker" | "agent";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const idToken = typeof body?.idToken === "string" ? body.idToken.trim() : null;
    if (!idToken) {
      return NextResponse.json({ ok: false, error: "Missing idToken" }, { status: 400 });
    }

    const auth = getAdminAuth();
    if (!auth) {
      console.error("[firebase/session] Firebase Admin not configured");
      return NextResponse.json({ ok: false, error: "Server auth not configured" }, { status: 503 });
    }

    const decoded = await auth.verifyIdToken(idToken);
    const email = decoded.email?.trim();
    const uid = decoded.uid;
    if (!email) {
      return NextResponse.json({ ok: false, error: "Email required" }, { status: 400 });
    }

    let role: ValidRole = "broker";
    let airtableUser = await getAirtableUserByEmail(email);
    if (!airtableUser) {
      role = email.toLowerCase() === DEV_ADMIN_EMAIL ? "owner" : "broker";
      airtableUser = await createAirtableUser(email, role);
      if (airtableUser) role = airtableUser.role;
    } else {
      role = airtableUser.role;
    }

    let agentId = airtableUser?.agentId;
    if (role === "agent" && !agentId) {
      agentId = (await getAgentIdByEmail(email)) ?? undefined;
    }

    console.log("[firebase/session] verified email:", email, "role:", role, "cookie will be set");

    const secret = env.server.AUTH_SECRET?.trim() || env.server.NEXTAUTH_SECRET?.trim() || env.server.SESSION_SECRET;
    if (!secret || secret.length < 16) {
      console.error("[firebase/session] AUTH_SECRET (or NEXTAUTH_SECRET/SESSION_SECRET) required and at least 16 chars");
      return NextResponse.json({ ok: false, error: "Server misconfigured" }, { status: 503 });
    }

    const jwt = await new SignJWT({ email, role, uid, agentId })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(SESSION_MAX_AGE)
      .setIssuedAt()
      .sign(new TextEncoder().encode(secret));

    const isProduction = process.env.NODE_ENV === "production";
    const res = NextResponse.json({ ok: true, role });
    res.cookies.set(SESSION_COOKIE_NAME, jwt, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
    return res;
  } catch (e) {
    console.error("[firebase/session] error:", e instanceof Error ? e.message : e);
    return NextResponse.json({ ok: false, error: "Invalid or expired token" }, { status: 401 });
  }
}
