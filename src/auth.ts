import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
import Credentials from "next-auth/providers/credentials";
import { compareSync } from "bcryptjs";
import { env } from "@/lib/env.mjs";
import {
  getAirtableUserByEmailForAuth,
  getAirtableUserByEmail,
  getAgentIdByEmail,
  createAirtableUser,
} from "@/lib/airtable";
import type { Role } from "@/lib/types";

function getAllowedBrokerEmail(): string {
  const fromEnv = env.server.DEV_ADMIN_EMAIL?.trim();
  return fromEnv || "presfv1@gmail.com";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    ...(env.server.GOOGLE_CLIENT_ID && env.server.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: env.server.GOOGLE_CLIENT_ID,
            clientSecret: env.server.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(env.server.APPLE_ID && env.server.APPLE_SECRET
      ? [
          Apple({
            clientId: env.server.APPLE_ID,
            clientSecret: env.server.APPLE_SECRET,
          }),
        ]
      : []),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toString()?.trim();
        const password = credentials?.password?.toString();
        if (!email) return null;
        const emailLower = email.toLowerCase();
        const allowedBroker = getAllowedBrokerEmail().toLowerCase();

        try {
          const airtableUser = await getAirtableUserByEmailForAuth(email);
          if (airtableUser) {
            if (airtableUser.passwordHash) {
              if (!password || !compareSync(password, airtableUser.passwordHash)) {
                return null;
              }
            } else if (emailLower !== allowedBroker) {
              return null;
            }
            let agentId = airtableUser.agentId;
            if (airtableUser.role === "agent" && !agentId) {
              const resolved = await getAgentIdByEmail(email);
              if (resolved) agentId = resolved;
            }
            const userId =
              airtableUser.role === "agent"
                ? `agent-${Buffer.from(email).toString("base64url").slice(0, 24)}`
                : `${airtableUser.role}-${Buffer.from(email).toString("base64url").slice(0, 24)}`;
            return {
              id: userId,
              email,
              name: email.split("@")[0],
              role: airtableUser.role,
              agentId: agentId ?? undefined,
            };
          }
          if (allowedBroker && emailLower === allowedBroker) {
            const userId = `owner-${Buffer.from(email).toString("base64url").slice(0, 24)}`;
            return {
              id: userId,
              email,
              name: email.split("@")[0],
              role: "owner" as Role,
              agentId: undefined,
            };
          }
        } catch {
          if (allowedBroker && emailLower === allowedBroker) {
            const userId = `owner-${Buffer.from(email).toString("base64url").slice(0, 24)}`;
            return {
              id: userId,
              email,
              name: email.split("@")[0],
              role: "owner" as Role,
              agentId: undefined,
            };
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "apple") {
        const email = user.email?.trim();
        if (!email) return false;
        const emailLower = email.toLowerCase();
        const allowedBroker = getAllowedBrokerEmail().toLowerCase();
        try {
          let airtableUser = await getAirtableUserByEmail(email);
          if (!airtableUser) {
            const role = emailLower === allowedBroker ? "owner" : "broker";
            airtableUser = await createAirtableUser(email, role);
            if (!airtableUser) {
              (user as { role?: Role }).role = role as Role;
              (user as { agentId?: string }).agentId = undefined;
              return true;
            }
          }
          (user as { role?: Role }).role = airtableUser.role;
          (user as { agentId?: string }).agentId = airtableUser.agentId;
          if (airtableUser.role === "agent" && !airtableUser.agentId) {
            const resolved = await getAgentIdByEmail(email);
            if (resolved) (user as { agentId?: string }).agentId = resolved;
          }
        } catch {
          const role = emailLower === allowedBroker ? "owner" : "broker";
          (user as { role?: Role }).role = role as Role;
          (user as { agentId?: string }).agentId = undefined;
        }
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.userId = (user as { id?: string }).id ?? user.id;
        token.role = (user as { role?: Role }).role ?? "broker";
        token.name = user.name ?? undefined;
        token.agentId = (user as { agentId?: string }).agentId;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as { userId?: string }).userId = (token.userId as string) ?? token.sub;
        (session.user as { role?: Role }).role = (token.role as Role) ?? "broker";
        (session.user as { agentId?: string }).agentId = token.agentId as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  secret: env.server.NEXTAUTH_SECRET || env.server.SESSION_SECRET,
  trustHost: true,
});
