"use client";

import { CONTAINER, PAGE_PADDING } from "@/lib/ui";
import { cn } from "@/lib/utils";

const TESTIMONIALS = [
  {
    quote:
      "We were losing leads because nobody knew who was supposed to reply. Now every lead gets a first reply in under 5 minutes. Our show rate went up.",
    author: "Sarah M.",
    role: "Broker-Owner",
    city: "Houston",
    initials: "SM",
  },
  {
    quote:
      "One inbox for the whole team — no more digging through personal texts. I can see every conversation and step in when needed.",
    author: "Mike T.",
    role: "Team Lead",
    city: "Dallas",
    initials: "MT",
  },
  {
    quote:
      "The dashboard shows me who's following up and who's not. I couldn't get that visibility without asking everyone individually.",
    author: "Jennifer L.",
    role: "Broker",
    city: "Austin",
    initials: "JL",
  },
];

export function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className={cn(CONTAINER, PAGE_PADDING)}>
        <h2 className="font-display font-bold text-[#0A0A0A] tracking-tight text-center max-w-2xl mx-auto mb-14 text-[clamp(2rem,4vw,3rem)]">
          Real results from <em className="italic">real brokerages.</em>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.initials}
              className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col transition-all duration-200 hover:border-blue-200 hover:shadow-lg"
            >
              <span
                className="text-5xl font-display text-blue-600/20 leading-none mb-4 block"
                aria-hidden
              >
                &ldquo;
              </span>
              <p className="font-sans text-gray-600 italic flex-1 mb-6 leading-relaxed text-[1.05rem]">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-sans font-semibold shrink-0">
                  {t.initials}
                </div>
                <div>
                  <p className="font-sans font-medium text-[#0A0A0A]">{t.author}</p>
                  <p className="text-sm font-sans text-gray-500">
                    {t.role}, {t.city}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
