import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LeadHandler.ai — About",
  description:
    "LeadHandler.ai — automated SMS lead routing built for Texas real estate brokerages.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
