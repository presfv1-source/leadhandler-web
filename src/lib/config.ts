import { env } from "./env.mjs";

const has = (key: string) => Boolean(key && key.trim() !== "");

export const hasAirtable =
  has(env.server.AIRTABLE_API_KEY) && has(env.server.AIRTABLE_BASE_ID);
export const hasStripe =
  has(env.server.STRIPE_SECRET_KEY) &&
  has(env.client.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
export const hasTwilio =
  has(env.server.TWILIO_ACCOUNT_SID) &&
  has(env.server.TWILIO_AUTH_TOKEN) &&
  has(env.server.TWILIO_FROM_NUMBER);
export const hasMake = has(env.server.MAKE_WEBHOOK_URL);

export const demoDefault = env.server.DEMO_MODE_DEFAULT;

export function getEnvSummary(): {
  hasAirtable: boolean;
  hasStripe: boolean;
  hasTwilio: boolean;
  hasMake: boolean;
} {
  return {
    hasAirtable,
    hasStripe,
    hasTwilio,
    hasMake,
  };
}
