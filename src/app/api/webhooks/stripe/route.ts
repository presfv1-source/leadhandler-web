import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { clerkClient } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { updateAirtableUserPlan } from "@/lib/airtable";
import { hasStripe } from "@/lib/config";
import { env } from "@/lib/env.mjs";

const WEBHOOK_SECRET = env.server.STRIPE_WEBHOOK_SECRET?.trim() ?? "";

function verifyStripeSignature(rawBody: string, signature: string | null): boolean {
  if (!WEBHOOK_SECRET || !signature) return false;
  const parts = signature.split(",").reduce<Record<string, string>>((acc, part) => {
    const [k, v] = part.split("=");
    if (k && v) acc[k.trim()] = v.trim();
    return acc;
  }, {});
  const t = parts.t;
  const v1 = parts.v1;
  if (!t || !v1) return false;
  const payload = `${t}.${rawBody}`;
  const expected = createHmac("sha256", WEBHOOK_SECRET).update(payload).digest("hex");
  return expected === v1;
}

function priceIdToPlanId(priceId: string): "essentials" | "pro" {
  const essentials = process.env.STRIPE_PRICE_ID_ESSENTIALS ?? process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ESSENTIALS ?? "";
  const pro = process.env.STRIPE_PRICE_ID_PRO ?? process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO ?? "";
  if (priceId && essentials && priceId === essentials) return "essentials";
  if (priceId && pro && priceId === pro) return "pro";
  return "pro";
}

async function syncPlanToClerk(email: string, planId: "essentials" | "pro"): Promise<void> {
  try {
    const client = await clerkClient();
    const users = await client.users.getUserList({ emailAddress: [email] });
    const user = users.data[0];
    if (user) {
      await client.users.updateUser(user.id, {
        publicMetadata: { ...user.publicMetadata, plan: planId },
      });
    }
  } catch (e) {
    console.error("[webhooks/stripe] Clerk sync plan:", e);
  }
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature") ?? null;

  if (WEBHOOK_SECRET && !verifyStripeSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    const event = JSON.parse(rawBody) as { type?: string; data?: { object?: Record<string, unknown> } };
    const type = event?.type;
    const obj = event?.data?.object as Record<string, unknown> | undefined;

    if (type === "checkout.session.completed" && obj) {
      const email = (obj.customer_email ?? (obj.customer_details as { email?: string } | undefined)?.email) as string | undefined;
      let planId: "essentials" | "pro" = "pro";
      const line0 = (obj.line_items as { data?: { price?: string | { id?: string } }[] } | undefined)?.data?.[0];
      const priceId = typeof line0?.price === "string" ? line0.price : line0?.price?.id;
      if (priceId) planId = priceIdToPlanId(priceId);
      if (email && typeof email === "string" && email.trim()) {
        await updateAirtableUserPlan(email.trim(), planId);
        await syncPlanToClerk(email.trim(), planId);
      }
    }

    if (type === "customer.subscription.updated" && obj) {
      const customerId = obj.customer as string | undefined;
      if (customerId && hasStripe && env.server.STRIPE_SECRET_KEY) {
        const StripeLib = await import("stripe");
        const stripe = new StripeLib.default(env.server.STRIPE_SECRET_KEY);
        const customer = await stripe.customers.retrieve(customerId);
        const email = (customer as Stripe.Customer).email?.trim();
        if (email) {
          const status = obj.status as string | undefined;
          const planId: "essentials" | "pro" = status === "active" ? "pro" : "essentials";
          await updateAirtableUserPlan(email, planId);
          await syncPlanToClerk(email, planId);
        }
      }
    }

    if (type === "customer.subscription.deleted" && obj) {
      const customerId = obj.customer as string | undefined;
      if (customerId && hasStripe && env.server.STRIPE_SECRET_KEY) {
        const StripeLib = await import("stripe");
        const stripe = new StripeLib.default(env.server.STRIPE_SECRET_KEY);
        const customer = await stripe.customers.retrieve(customerId);
        const email = (customer as Stripe.Customer).email?.trim();
        if (email) {
          await updateAirtableUserPlan(email, "essentials");
          await syncPlanToClerk(email, "essentials");
        }
      }
    }
  } catch (e) {
    console.error("[webhooks/stripe]", e);
  }
  return NextResponse.json({ received: true }, { status: 200 });
}
