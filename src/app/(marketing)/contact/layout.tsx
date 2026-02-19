import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LeadHandler.ai — Contact",
  description:
    "AI-powered SMS lead qualification and routing for real estate brokerages. Get in touch for demos and questions.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
