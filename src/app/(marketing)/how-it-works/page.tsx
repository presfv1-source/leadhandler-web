import Link from "next/link";
import { MessageSquare, Route, Users, LayoutDashboard } from "lucide-react";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { SectionLabel } from "@/components/marketing/SectionLabel";
import { CONTAINER, PAGE_PADDING } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { HOW_IT_WORKS_STEPS } from "@/lib/marketingContent";

const stepIcons = [Users, MessageSquare, Route, LayoutDashboard];

export const metadata = {
  title: "LeadHandler.ai — How it works",
  description:
    "SMS lead response and routing for real estate brokerages. From first text to routed conversation — all logged.",
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--white)]">
      <Navbar />
      <section className="py-16 md:py-20 bg-[var(--off)]">
        <div className={cn(CONTAINER, PAGE_PADDING, "text-center max-w-2xl mx-auto")}>
          <SectionLabel className="mb-3">How it works</SectionLabel>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-[-0.5px] text-[var(--ink)]">
            From first text to agent in seconds.
          </h1>
          <p className="mt-4 font-sans text-[var(--muted)] text-base sm:text-lg leading-relaxed">
            From first text to routed conversation — all logged.
          </p>
        </div>
      </section>
      <main className={cn(CONTAINER, PAGE_PADDING, "flex-1 py-16 md:py-24")}>
        <ol className="space-y-10 md:space-y-14 max-w-3xl mx-auto">
          {HOW_IT_WORKS_STEPS.map((step, i) => {
            const Icon = stepIcons[i] ?? Users;
            return (
              <li key={step.title} className="flex gap-6 md:gap-8">
                <div className="flex shrink-0 w-14 h-14 rounded-full bg-[var(--off)] ring-4 ring-[var(--off)] flex items-center justify-center text-[var(--ink)]">
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <div className="min-w-0 pt-1">
                  <span className="text-xs font-sans font-bold uppercase tracking-widest text-[var(--subtle)]">
                    Step {i + 1}
                  </span>
                  <h2 className="font-display font-semibold text-[var(--ink)] text-xl mt-2">
                    {step.title}
                  </h2>
                  <p className="font-sans text-[var(--muted)] mt-2 leading-relaxed">{step.body}</p>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-14 text-center">
          <Link
            href="/demo"
            className="inline-flex items-center justify-center rounded-lg px-8 py-3.5 font-sans font-semibold bg-[var(--ink)] text-white hover:opacity-90 min-h-[48px] transition-all"
          >
            Try demo →
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
