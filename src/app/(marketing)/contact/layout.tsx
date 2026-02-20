import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LeadHandler.ai — Contact",
  description:
    "Contact LeadHandler.ai — get beta access or ask us anything.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
