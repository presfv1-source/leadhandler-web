import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LeadHandler.ai — Pricing",
  description:
    "AI-powered SMS lead qualification and routing for real estate brokerages. Simple pricing, 14-day free trial.",
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
