import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LeadHandler.ai — About",
  description:
    "AI-powered SMS lead qualification and routing for real estate brokerages. Built in Houston by someone who gets it.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
