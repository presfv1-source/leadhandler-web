import Link from "next/link";
import { MarketingHeader } from "@/components/app/MarketingHeader";
import { MarketingFooter } from "@/components/app/MarketingFooter";
import { CONTAINER_NARROW, PAGE_PADDING, TYPO } from "@/lib/ui";
import { cn } from "@/lib/utils";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MarketingHeader />

      <main className={cn(CONTAINER_NARROW, PAGE_PADDING, "flex-1 py-12 md:py-16")}>
        <h1 className={cn(TYPO.h1, "text-3xl md:text-4xl")}>Terms of service</h1>
        <p className={cn(TYPO.muted, "mt-2")}>
          Terms governing your use of LeadHandler.ai.
        </p>

        <section className="mt-8 space-y-6 text-sm text-foreground">
          <p>
            By using LeadHandler.ai you agree to use the service in compliance with applicable law and not to misuse it (e.g. spam, unauthorized access, or abuse of messaging). You are responsible for your account and the data you provide.
          </p>
          <p>
            The service is provided as-is. We do our best to keep it available and secure but do not guarantee uninterrupted service. Billing is handled via Stripe; subscription terms and cancellation follow your plan and our billing page.
          </p>
          <p>
            We may update these terms; continued use after changes constitutes acceptance. For questions, contact us.
          </p>
          <p>
            Last updated: 2026.
          </p>
        </section>

        <p className={cn(TYPO.muted, "mt-10 text-center text-sm")}>
          <Link href="/contact" className="font-medium text-primary hover:underline">
            Contact us
          </Link>
          {" "}with questions.
        </p>
      </main>

      <MarketingFooter />
    </div>
  );
}
