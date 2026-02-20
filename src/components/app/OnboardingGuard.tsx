"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

interface OnboardingGuardProps {
  isOwner: boolean;
  children: React.ReactNode;
}

/** Redirects owners who have not completed onboarding to /app/onboarding (except when already there). */
export function OnboardingGuard({ isOwner, children }: OnboardingGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isOwner || pathname === "/app/onboarding") {
      setChecked(true);
      return;
    }
    fetch("/api/onboarding", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data && !data.data.done) {
          router.replace("/app/onboarding");
        }
      })
      .catch(() => {})
      .finally(() => setChecked(true));
  }, [isOwner, pathname, router]);

  if (!checked && isOwner && pathname !== "/app/onboarding") {
    return null;
  }
  return <>{children}</>;
}
