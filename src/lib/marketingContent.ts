/**
 * Single source of truth for marketing positioning, features, how-it-works, and pricing.
 * Use across homepage, pricing page, and in-app billing so copy cannot drift.
 */

export const MARKETING_POSITIONING = {
  headline: "Respond first. Close more.",
  subheadline:
    "Speed-to-lead wins listings. Broker-owners use LeadHandler for fast SMS follow-up, lead status tracking, and fair routing—from one inbox.",
  valueProps: [
    "Reply in minutes with one shared inbox",
    "Fair round-robin and weighted routing to your agents",
    "Dashboard visibility and activity feed so nothing slips",
  ],
  /** Optional trust line; use in one place only. Texas is optional. */
  trustLine: "Trusted by Broker-Owners",
} as const;

export const HOW_IT_WORKS_STEPS = [
  {
    title: "Capture leads",
    description:
      "Connect your lead sources. Leads sync to your dashboard. Setup in under 30 minutes.",
  },
  {
    title: "Respond quickly",
    description:
      "One inbox for every conversation. Automated SMS follow-up and lead status tracking. Never miss a lead.",
  },
  {
    title: "Route & track",
    description:
      "Round-robin or weighted routing gets the lead to the right agent. Dashboard shows activity and performance.",
  },
] as const;

export interface FeatureCard {
  id: string;
  title: string;
  bullets: [string, string];
}

export const FEATURES: FeatureCard[] = [
  {
    id: "sms-inbox",
    title: "SMS inbox",
    bullets: [
      "One shared inbox for all lead conversations.",
      "Respond from anywhere; every message is logged.",
    ],
  },
  {
    id: "routing",
    title: "Round-robin & weighted routing",
    bullets: [
      "Distribute leads fairly with round-robin or weight by agent.",
      "Optional performance-based and escalation targets in routing.",
    ],
  },
  {
    id: "lead-pipeline",
    title: "Lead status pipeline & filtering",
    bullets: [
      "Track status from new to contacted, qualified, appointment, closed.",
      "Filter and search leads by source, agent, and status.",
    ],
  },
  {
    id: "dashboard",
    title: "Dashboard & activity feed",
    bullets: [
      "Today's metrics and recent activity in one view.",
      "Demo mode available; live data when sources are connected.",
    ],
  },
  {
    id: "roles",
    title: "Roles & permissions",
    bullets: [
      "Owner and agent roles with appropriate visibility.",
      "Agents see assigned leads; owners see full brokerage view.",
    ],
  },
  {
    id: "integrations",
    title: "Integrations",
    bullets: [
      "Connect Airtable, Twilio, and Stripe when configured.",
      "Lead sync and SMS work once env is set; no fake claims.",
    ],
  },
];

export const COMING_SOON_FEATURES = [
  "AI-assisted qualification",
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
  /** Env key for Stripe price ID, e.g. NEXT_PUBLIC_STRIPE_PRICE_ID_ESSENTIALS */
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
    cta: "Claim Beta Spot",
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
    cta: "Claim Beta Spot",
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
    cta: "Get started",
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
    cta: "Get started",
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

/** Comparison rows for Beta Essentials vs Pro (feature name, essentials column, pro column). */
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

/** Plans shown in app billing (Beta Essentials + Pro + Enterprise). */
export const BILLING_PLANS: PricingPlan[] = [
  ...PRICING_PLANS_BETA,
  PRICING_PLANS_STANDARD.find((p) => p.id === "enterprise")!,
];
