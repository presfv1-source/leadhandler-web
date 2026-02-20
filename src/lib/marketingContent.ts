/**
 * Single source of truth for marketing positioning, features, how-it-works.
 * Use across homepage, pricing page, demo page, and hero. Client-facing only—no internal implementation details.
 */

export const MARKETING_POSITIONING = {
  headline: "Every text lead answered in seconds — routed to the right agent.",
  subheadline:
    "Leads text your listing number. LeadHandler replies instantly, captures their info, and routes the conversation to the right agent — automatically.",
  valueProps: [
    "Instant SMS follow-up to every new lead",
    "Automated lead filtering and routing",
    "Full visibility in one shared inbox",
  ],
  /** Optional trust line; do NOT hardcode Texas everywhere. */
  trustLine: "Built for Texas brokerages · Beta · Limited spots · Setup in minutes",
} as const;

export const HOW_IT_WORKS_STEPS = [
  {
    title: "Lead texts your listing number",
    body: "Someone sees your sign or ad and texts. That's the trigger.",
  },
  {
    title: "Instant auto-reply collects the details",
    body: "LeadHandler texts back immediately — name, buying or selling, timeline, budget. No agent needed.",
  },
  {
    title: "Routed to the right agent, tracked in one inbox",
    body: "The conversation goes to the right agent based on your rules. Every thread is logged. Nothing falls through.",
  },
] as const;

export interface FeatureCard {
  id: string;
  title: string;
  bullets: [string, string];
}

/** Client-facing feature cards only. No Integrations, Demo mode, or Airtable/Twilio/Stripe/Make as main features. */
export const FEATURES: FeatureCard[] = [
  {
    id: "instant-text-back",
    title: "Instant text-back",
    bullets: ["Every lead gets a reply in seconds", "24/7, no exceptions"],
  },
  {
    id: "smart-routing",
    title: "Smart routing",
    bullets: [
      "Round-robin or rules-based",
      "The right agent gets the right lead, every time",
    ],
  },
  {
    id: "shared-inbox",
    title: "Shared inbox",
    bullets: [
      "Every SMS conversation in one place",
      "Clean handoffs, no dropped threads",
    ],
  },
  {
    id: "owner-visibility",
    title: "Owner visibility",
    bullets: [
      "See every lead, every response time, every agent",
      "Full accountability",
    ],
  },
  {
    id: "missed-lead-prevention",
    title: "Missed-lead prevention",
    bullets: [
      "If no agent responds, it escalates",
      "No lead sits unanswered",
    ],
  },
  {
    id: "setup-in-minutes",
    title: "Setup in minutes",
    bullets: [
      "One phone number. A few routing rules",
      "Live the same day",
    ],
  },
];

/** Show only under a small "Coming soon" label; do not present as a core feature. */
export const COMING_SOON_FEATURES = [
  {
    id: "ai-intake",
    title: "AI intake (coming soon)",
    body: "Automated qualification questions in the conversation flow. In beta.",
  },
] as const;

export type PricingVariant = "beta" | "standard";

export interface PricingPlan {
  id: string;
  name: string;
  price: number | null;
  priceAnnual?: number;
  period: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  primary?: boolean;
  badge?: string;
  footnote?: string;
  priceIdEnvKey?: string;
}

/** Beta pricing: used by marketing Beta tab and in-app billing. */
export const PRICING_PLANS_BETA: PricingPlan[] = [
  {
    id: "essentials",
    name: "Essentials",
    price: 99,
    priceAnnual: 990,
    period: "/mo",
    description: "Automated follow-up, round-robin, inbox, basic dashboard.",
    features: [
      "Up to 15 agents",
      "Automated SMS follow-up",
      "Round-robin routing",
      "SMS inbox",
      "Basic dashboard",
    ],
    cta: "Request beta access",
    href: "/signup",
    primary: false,
    priceIdEnvKey: "NEXT_PUBLIC_STRIPE_PRICE_ID_ESSENTIALS",
  },
  {
    id: "pro",
    name: "Pro",
    badge: "Popular",
    price: 249,
    priceAnnual: 2490,
    period: "/mo",
    description:
      "Everything in Essentials, plus weighted routing, escalation, analytics dashboard, priority support. Up to 40+ agents.",
    footnote: "Spots limited before standard $349/$749.",
    features: [
      "Up to 40+ agents",
      "Everything in Essentials",
      "Weighted & performance-based routing",
      "Escalation targets",
      "Analytics dashboard",
      "Priority support",
    ],
    cta: "Request beta access",
    href: "/signup",
    primary: true,
    priceIdEnvKey: "NEXT_PUBLIC_STRIPE_PRICE_ID_PRO",
  },
];

/** Standard pricing: used by marketing Standard tab only. */
export const PRICING_PLANS_STANDARD: PricingPlan[] = [
  {
    id: "essentials",
    name: "Essentials",
    price: 349,
    period: "/mo",
    description: "For established teams.",
    features: [
      "Up to 15 agents",
      "Automated SMS follow-up",
      "Lead routing",
      "SMS inbox",
      "Lead sync when configured",
    ],
    cta: "Request beta access",
    href: "/signup",
    primary: false,
  },
  {
    id: "pro",
    name: "Pro",
    badge: "Popular",
    price: 749,
    period: "/mo",
    description: "For scaling brokerages.",
    features: [
      "Up to 40+ agents",
      "Everything in Essentials",
      "Analytics dashboard",
      "Priority support",
    ],
    cta: "Request beta access",
    href: "/signup",
    primary: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: null,
    period: "Custom",
    description: "Dedicated support and custom options.",
    features: ["Custom limits", "Dedicated support", "API access", "SLA"],
    cta: "Contact sales",
    href: "/contact",
    primary: false,
  },
];

export const PRICING_COMPARISON_BETA = [
  { feature: "Agents", essentials: "Up to 15", pro: "Up to 40+" },
  { feature: "Automated SMS follow-up", essentials: "✓", pro: "✓" },
  { feature: "Round-robin routing", essentials: "✓", pro: "✓" },
  { feature: "SMS inbox", essentials: "✓", pro: "✓" },
  { feature: "Basic dashboard", essentials: "✓", pro: "✓" },
  { feature: "Analytics dashboard", essentials: "—", pro: "✓" },
  { feature: "Escalation", essentials: "—", pro: "✓" },
  { feature: "Priority support", essentials: "—", pro: "✓" },
] as const;

export const BILLING_PLANS: PricingPlan[] = [
  ...PRICING_PLANS_BETA,
  PRICING_PLANS_STANDARD.find((p) => p.id === "enterprise")!,
];
