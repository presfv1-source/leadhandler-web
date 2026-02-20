import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function BillingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const role = session?.effectiveRole ?? session?.role;
  if (role === "agent") redirect("/app/leads");
  return <>{children}</>;
}
