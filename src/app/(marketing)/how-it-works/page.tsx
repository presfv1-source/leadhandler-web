import Link from "next/link";
import { ArrowRight, MessageSquare, Route, UserCheck, Zap } from "lucide-react";
import { MarketingHeader } from "@/components/app/MarketingHeader";
import { MarketingFooter } from "@/components/app/MarketingFooter";
import { CONTAINER, PAGE_PADDING, TYPO } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const steps = [
  {
    title: "Lead comes in",
    description: "New leads from Zillow, Realtor.com, your website, or other sources hit your pipeline.",
    icon: Zap,
  },
  {
    title: "Respond quickly",
    description: "One inbox for every conversation. Automated SMS follow-up and lead status tracking—no lead left waiting.",
    icon: MessageSquare,
  },
  {
    title: "Routed to the right agent",
    description: "Round robin, weighted, or performance-based routing gets the lead to the best agent.",
    icon: Route,
  },
  {
    title: "You close",
    description: "One inbox, clear visibility, and faster follow-up so your team closes more.",
    icon: UserCheck,
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MarketingHeader />

      <main className={cn(CONTAINER, PAGE_PADDING, "flex-1 py-12 md:py-16")}>
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className={cn(TYPO.h1, "text-3xl md:text-4xl")}>How it works</h1>
          <p className={cn(TYPO.muted, "mt-2")}>
            Four steps from lead to close.
          </p>
        </div>

        <ol className="space-y-8 md:space-y-12 max-w-3xl mx-auto">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <li key={step.title} className="flex gap-4 md:gap-6">
                <div className="flex shrink-0 items-center justify-center h-12 w-12 rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Step {i + 1}
                  </span>
                  <h2 className={cn(TYPO.h2, "mt-1 text-xl")}>{step.title}</h2>
                  <p className={cn(TYPO.muted, "mt-2")}>{step.description}</p>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-12 md:mt-16 text-center">
          <Button asChild size="lg" className="min-h-[44px]">
            <Link href="/login" className="inline-flex items-center gap-2">
              Try demo
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
