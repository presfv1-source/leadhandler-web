"use client";

import { Check } from "lucide-react";
import { CONTAINER, PAGE_PADDING } from "@/lib/ui";
import { cn } from "@/lib/utils";

const TAGS = [
  "Houston Brokerages",
  "Dallas Teams",
  "Austin Agents",
  "14-day free trial",
  "No card required",
];

export function TrustBar() {
  return (
    <section className="py-8 md:py-10 bg-gray-50 border-y border-gray-100">
      <div className={cn(CONTAINER, PAGE_PADDING)}>
        <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 font-sans">
          Trusted by brokerages across Texas
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
          {TAGS.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-2 text-sm font-sans text-gray-600"
            >
              <Check className="h-4 w-4 shrink-0 text-blue-600" aria-hidden />
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
