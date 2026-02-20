import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LeadHandler.ai — Features",
  description:
    "How LeadHandler.ai works — instant text-back, smart routing, shared inbox.",
};

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
