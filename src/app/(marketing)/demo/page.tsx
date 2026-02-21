"use client";

import Link from "next/link";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { FadeUp } from "@/components/marketing/FadeUp";
import { SectionLabel } from "@/components/marketing/SectionLabel";
import { CONTAINER, PAGE_PADDING } from "@/lib/ui";
import { cn } from "@/lib/utils";

export default function DemoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--white)]">
      <Navbar />

      <main className="flex-1">
        <section className="py-16 md:py-20 bg-[var(--off)]">
          <div className={cn(CONTAINER, PAGE_PADDING, "text-center max-w-2xl mx-auto")}>
            <SectionLabel className="mb-3">Demo</SectionLabel>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-[-0.5px] text-[var(--ink)]">
              See LeadHandler in action
            </h1>
          </div>
        </section>

        <FadeUp>
          <section className={cn(CONTAINER, PAGE_PADDING, "py-16 md:py-24")}>
            <div className="max-w-3xl mx-auto text-center">
              <p className="font-sans text-[var(--muted)] text-lg mb-8 leading-relaxed">
                Request beta access and we&apos;ll walk you through a live demo personally.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-lg px-8 py-3.5 font-sans font-semibold bg-[var(--ink)] text-white hover:opacity-90 min-h-[48px] transition-all"
              >
                Request beta access
              </Link>
            </div>
          </section>
        </FadeUp>
      </main>

      <Footer />
    </div>
  );
}
