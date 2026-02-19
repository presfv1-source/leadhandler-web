import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LeadHandler.ai — Features",
  description:
    "AI-powered SMS lead qualification and routing for real estate brokerages. Built for brokerages that can't afford to miss a lead.",
};

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
