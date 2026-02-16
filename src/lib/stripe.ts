import { hasStripe } from "./config";

/** Create checkout URL. Pass priceId from client (e.g. env STRIPE_PRICE_ID_ESSENTIALS). */
export async function createCheckout(priceId?: string): Promise<string> {
  if (!hasStripe) return "https://example.com/checkout-stub";
  // TODO: Stripe Checkout session with priceId
  return priceId ? `https://checkout.stripe.com/stub?price=${priceId}` : "https://example.com/checkout-stub";
}

export async function createPortal(): Promise<string> {
  if (!hasStripe) return "https://example.com/portal-stub";
  // TODO: Stripe Customer Portal session
  return "https://example.com/portal-stub";
}
