"use client";

import Link from "next/link";
import { CONTAINER_WIDE, PAGE_PADDING } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { DashboardMockup } from "./DashboardMockup";
import { Button } from "./Button";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center py-16 md:py-24 overflow-hidden">
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,#EFF6FF_0%,#FFFFFF_70%)]"
        aria-hidden
      />
      <div className="relative w-full">
        <div className={cn(CONTAINER_WIDE, PAGE_PADDING)}>
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1.5 mb-8">
              <span
                className="h-2 w-2 rounded-full bg-blue-600 animate-pulse"
                aria-hidden
              />
              <span className="text-sm font-sans font-medium text-blue-600">
                Now in Beta — 12 spots remaining
              </span>
            </div>
            <h1 className="font-display font-extrabold text-[#0A0A0A] tracking-tight mb-6 leading-[1.1] text-[clamp(3rem,7vw,5.5rem)]">
              Respond first. Close more.
            </h1>
            <p className="text-lg sm:text-xl font-sans text-gray-500 leading-relaxed mb-10 max-w-2xl">
              LeadHandler.ai qualifies every inbound lead by SMS, routes them to the right
              agent, and gives your brokerage the visibility it&apos;s been missing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
              <Button href="/signup" variant="primary">
                Start free trial
              </Button>
              <Button href="/demo" variant="ghost">
                See live demo →
              </Button>
            </div>
            <div className="w-full max-w-4xl">
              <DashboardMockup />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
