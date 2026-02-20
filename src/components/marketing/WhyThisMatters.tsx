"use client";

import { CONTAINER, PAGE_PADDING } from "@/lib/ui";
import { cn } from "@/lib/utils";

const BULLETS = [
  "Leads go cold fast. The first reply wins the conversation.",
  "Agents are busy, in showings, or off the clock. Gaps happen.",
  "Speed is the only edge that matters before price.",
];

export function WhyThisMatters() {
  return (
    <section className="py-16 md:py-24 bg-slate-900">
      <div className={cn(CONTAINER, PAGE_PADDING)}>
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-display font-bold text-white tracking-tight text-[clamp(2rem,4vw,3rem)] mb-10">
            Most teams lose leads in the first 60 seconds.
          </h2>
          <ul className="space-y-6 text-left mb-10">
            {BULLETS.map((text) => (
              <li
                key={text}
                className="font-sans text-lg sm:text-xl text-slate-200 leading-relaxed"
              >
                {text}
              </li>
            ))}
          </ul>
          <p className="font-sans text-lg text-white/90">
            LeadHandler guarantees the first response happens instantly — every
            time, 24/7.
          </p>
        </div>
      </div>
    </section>
  );
}
