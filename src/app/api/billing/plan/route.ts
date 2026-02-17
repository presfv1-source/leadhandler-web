import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAirtableUserPlan } from "@/lib/airtable";

export type PlanId = "free" | "essentials" | "pro";

export async function GET() {
  try {
    const session = await getSession();
    const email = session?.email;
    if (!email) {
      return NextResponse.json({ success: true, data: { planId: "free" as PlanId } });
    }
    const plan = await getAirtableUserPlan(email);
    const planId: PlanId = plan === "essentials" || plan === "pro" ? plan : "free";
    return NextResponse.json({ success: true, data: { planId } });
  } catch {
    return NextResponse.json({ success: true, data: { planId: "free" as PlanId } });
  }
}
