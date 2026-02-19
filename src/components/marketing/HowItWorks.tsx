"use client";

import { CONTAINER, PAGE_PADDING } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { SectionLabel } from "./SectionLabel";

const STEPS = [
  { title: "Lead comes in", body: "A buyer or seller submits from Zillow, Realtor.com, or your site. Captured instantly." },
  { title: "AI qualifies by SMS", body: "Our AI texts them within seconds, scores their intent, and flags hot leads." },
  { title: "Routed to right agent", body: "Qualified leads go to the right agent instantly. You see everything from one dashboard." },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-16 md:py-24 bg-gray-50">
      <div className={cn(CONTAINER, PAGE_PADDING)}>
        <div className="text-center mb-14">
          <SectionLabel className="mb-3">How it works</SectionLabel>
          <h2 className="font-display font-bold text-[#0A0A0A] tracking-tight text-center max-w-2xl mx-auto text-[clamp(2rem,4vw,3rem)]">
            From new lead to booked appointment — automatically.
          </h2>
        </div>
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
          <div className="hidden md:block absolute top-10 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-0.5 bg-gray-200" aria-hidden />
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="relative flex flex-col items-center text-center md:items-start md:text-left"
            >
              <div className="w-14 h-14 rounded-full bg-blue-50 ring-4 ring-blue-50 flex items-center justify-center text-xl font-display font-bold text-blue-600 mb-4 shrink-0 relative z-10">
                {i + 1}
              </div>
              <h3 className="font-display font-semibold text-[#0A0A0A] text-lg mb-2">
                {step.title}
              </h3>
              <p className="font-sans text-gray-500 text-sm sm:text-base max-w-sm leading-relaxed">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
