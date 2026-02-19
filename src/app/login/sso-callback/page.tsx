"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

/**
 * Clerk redirects here after Google (and other OAuth) sign-in.
 * This page must exist or you get 404. It completes the flow and redirects to dashboard.
 */
export default function SSOCallbackPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <AuthenticateWithRedirectCallback signInFallbackRedirectUrl="/app/dashboard" />
    </div>
  );
}
