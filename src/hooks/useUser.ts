"use client";

import { useUser as useClerkUser } from "@clerk/nextjs";

export function useUser() {
  const { user } = useClerkUser();
  const role = (user?.publicMetadata?.role as string) ?? "agent";
  const plan = (user?.publicMetadata?.plan as string) ?? "essentials";
  return {
    role,
    plan,
    isOwner: role === "owner" || role === "broker",
    isPro: plan === "pro",
  };
}
