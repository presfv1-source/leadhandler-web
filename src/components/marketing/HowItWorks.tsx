"use client";

import { MessageCircle, Zap, Route } from "lucide-react";
import { CONTAINER, PAGE_PADDING } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { SectionLabel } from "./SectionLabel";

const STEPS = [
  {
    icon: MessageCircle,
    title: "Lead texts your listing number",
    body: "Someone sees your sign or ad and texts. That's the trigger.",
  },
  {
    icon: Zap,
    title: "Instant auto-reply collects the details",
    body: "LeadHandler texts back immediately — name, buying or selling, timeline, budget. No agent needed.",
  },
  {
    icon: Route,
    title: "Routed to the right agent, tracked in one inbox",
    body: "The conversation goes to the right agent based on your rules. Every thread is logged. Nothing falls through.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-gray-50">
      <div className={cn(CONTAINER, PAGE_PADDING)}>
        <div className="text-center mb-14">
          <SectionLabel className="mb-3">How it works</SectionLabel>
          <h2 className="font-display font-bold text-[#0A0A0A] tracking-tight text-center max-w-2xl mx-auto text-[clamp(2rem,4vw,3rem)]">
            From &apos;text for info&apos; to routed conversation — in under a minute.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="relative flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-full bg-blue-50 ring-4 ring-blue-50 flex items-center justify-center mb-4 shrink-0 relative z-10">
                  <Icon className="h-7 w-7 text-blue-600" aria-hidden />
                </div>
                <h3 className="font-display font-semibold text-[#0A0A0A] text-lg mb-2">
                  {step.title}
                </h3>
                <p className="font-sans text-gray-500 text-sm sm:text-base max-w-sm leading-relaxed">
                  {step.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
