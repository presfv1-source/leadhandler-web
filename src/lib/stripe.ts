import Stripe from "stripe";
import { hasStripe } from "./config";
import { env } from "./env.mjs";

let stripeInstance: Stripe | null = null;

function getStripe(): Stripe | null {
  if (!hasStripe || !env.server.STRIPE_SECRET_KEY?.trim()) return null;
  if (!stripeInstance) {
    stripeInstance = new Stripe(env.server.STRIPE_SECRET_KEY);
  }
  return stripeInstance;
}

const PRICE_ESSENTIALS = process.env.STRIPE_PRICE_ID_ESSENTIALS ?? process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ESSENTIALS ?? "";
const PRICE_PRO = process.env.STRIPE_PRICE_ID_PRO ?? process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO ?? "";

function planIdToPriceId(planId: "essentials" | "pro"): string | null {
  if (planId === "essentials" && PRICE_ESSENTIALS) return PRICE_ESSENTIALS;
  if (planId === "pro" && PRICE_PRO) return PRICE_PRO;
  return PRICE_PRO || PRICE_ESSENTIALS || null;
}

/** Create Stripe Checkout session URL for the given plan. */
export async function createCheckout(
  priceIdOrPlanId?: string,
  userId?: string,
  email?: string
): Promise<string> {
  if (!hasStripe) {
    console.warn("[stripe] createCheckout: Stripe not configured");
    return "https://example.com/checkout-stub";
  }
  const stripe = getStripe();
  if (!stripe) return "https://example.com/checkout-stub";

  const planId = priceIdOrPlanId === "essentials" || priceIdOrPlanId === "pro"
    ? priceIdOrPlanId
    : undefined;
  const priceId = planId ? planIdToPriceId(planId) : (priceIdOrPlanId ?? planIdToPriceId("pro"));
  if (!priceId) {
    console.warn("[stripe] createCheckout: No price ID configured");
    return "https://example.com/checkout-stub";
  }

  const baseUrl = env.client.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/app/billing?success=1`,
    cancel_url: `${baseUrl}/app/billing?canceled=1`,
    customer_email: email ?? undefined,
    client_reference_id: userId ?? undefined,
  });
  return session.url ?? "https://example.com/checkout-stub";
}

/** Create Stripe Customer Portal session URL. Requires customerId from Stripe (subscription customer). */
export async function createPortal(userId?: string, email?: string): Promise<string> {
  if (!hasStripe) {
    console.warn("[stripe] createPortal: Stripe not configured");
    return "https://example.com/portal-stub";
  }
  const stripe = getStripe();
  if (!stripe) return "https://example.com/portal-stub";

  const customers = await stripe.customers.list({ email: email ?? undefined, limit: 1 });
  const customerId = customers.data[0]?.id;
  if (!customerId) {
    console.warn("[stripe] createPortal: No customer found for email");
    return "https://example.com/portal-stub";
  }

  const baseUrl = env.client.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${baseUrl}/app/billing`,
  });
  return session.url;
}

/** Get current subscription for a Stripe customer. */
export async function getSubscription(customerId: string): Promise<Stripe.Subscription | null> {
  if (!hasStripe) return null;
  const stripe = getStripe();
  if (!stripe) return null;
  const subs = await stripe.subscriptions.list({ customer: customerId, status: "active", limit: 1 });
  return subs.data[0] ?? null;
}
