"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { CONTAINER, PAGE_PADDING } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { PRICING_PLANS_BETA } from "@/lib/marketingContent";
import { Button } from "@/components/ui/button";

export function PricingPreview() {
  const plans = PRICING_PLANS_BETA.slice(0, 2); // Essentials + Pro

  return (
    <section
      id="pricing"
      className="py-16 sm:py-20 lg:py-24 bg-[var(--off)]"
      aria-labelledby="pricing-heading"
    >
      <div className={cn(CONTAINER, PAGE_PADDING)}>
        <div className="text-center mb-12">
          <h2
            id="pricing-heading"
            className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[var(--ink)] max-w-2xl mx-auto"
          >
            Simple pricing for serious brokerages
          </h2>
          <p className="text-[var(--muted)] text-base sm:text-lg mt-4">
            Beta pricing — locked for early members.{" "}
            <Link
              href="/pricing"
              className="text-[var(--ink)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border)] rounded"
            >
              See full details →
            </Link>
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "rounded-2xl border bg-[var(--white)] p-6 sm:p-8 shadow-sm flex flex-col transition-all duration-200 hover:shadow-md",
                plan.primary
                  ? "border-[var(--ink)] ring-1 ring-[var(--border)] relative"
                  : "border-[var(--border)]"
              )}
            >
              {plan.primary && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--ink)] px-3 py-1 text-xs font-medium text-white">
                  Most Popular
                </span>
              )}
              <span className="inline-flex w-fit rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 px-2.5 py-1 text-xs font-medium mb-4">
                Beta pricing
              </span>
              <h3 className="font-semibold text-xl text-[var(--ink)] mb-1">
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-2 mb-4 flex-wrap">
                <span className="text-4xl font-bold text-[var(--ink)]">
                  ${plan.price ?? "—"}
                </span>
                <span className="text-[var(--muted)]">/mo</span>
              </div>
              <p className="text-[var(--muted)] text-sm mb-6 leading-relaxed">
                {plan.description}
              </p>
              <ul className="space-y-3 mb-6 flex-1">
                {plan.features.slice(0, 4).map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-[var(--muted)]"
                  >
                    <Check className="h-4 w-4 shrink-0 text-[var(--ink)] mt-0.5" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full rounded-xl min-h-[48px] font-semibold bg-[var(--ink)] text-white hover:opacity-90 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--border)]">
                <Link href="/signup">{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
        <p className="text-center mt-6">
          <Link
            href="/pricing"
            className="text-sm text-[var(--ink)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border)] rounded"
          >
            View full pricing & FAQ →
          </Link>
        </p>
      </div>
    </section>
  );
}
