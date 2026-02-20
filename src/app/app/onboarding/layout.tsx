import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Agents skip onboarding; redirect to dashboard. */
export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (session?.role === "agent") {
    redirect("/app/dashboard");
  }
  return <>{children}</>;
}
