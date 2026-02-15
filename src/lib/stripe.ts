import { hasStripe } from "./config";

export async function createCheckout(): Promise<string> {
  if (!hasStripe) return "https://example.com/checkout-stub";
  // TODO: Stripe Checkout session
  return "https://example.com/checkout-stub";
}

export async function createPortal(): Promise<string> {
  if (!hasStripe) return "https://example.com/portal-stub";
  // TODO: Stripe Customer Portal session
  return "https://example.com/portal-stub";
}
