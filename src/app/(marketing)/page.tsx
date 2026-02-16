import Link from "next/link";
import { Building2, Zap, MessageSquare, Users, Shield, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingHeader } from "@/components/app/MarketingHeader";
import { MarketingFooter } from "@/components/app/MarketingFooter";
import { CONTAINER, PAGE_PADDING } from "@/lib/ui";
import { cn } from "@/lib/utils";

export default function MarketingHomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MarketingHeader />

      <main>
        <section className="py-24 px-4 md:px-8 bg-gradient-to-b from-primary/5 to-background dark:from-primary/10 dark:to-background">
          <div className="container max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Turn new leads into conversations faster
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              AI-assisted SMS lead response and routing for real estate teams. Respond first, qualify with confidence, route to the right agent.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-base">
                <Link href="/signup">Start free trial</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base">
                <Link href="/pricing">View pricing</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className={cn(CONTAINER, PAGE_PADDING, "py-12 max-w-5xl mx-auto")}>
          <p className="text-center text-sm text-muted-foreground mb-6">Built for fast-moving teams</p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            <span className="text-sm font-medium text-muted-foreground/80">Airtable</span>
            <span className="text-muted-foreground/40">·</span>
            <span className="text-sm font-medium text-muted-foreground/80">Twilio</span>
            <span className="text-muted-foreground/40">·</span>
            <span className="text-sm font-medium text-muted-foreground/80">Stripe</span>
          </div>
        </section>

        <section className={cn(CONTAINER, PAGE_PADDING, "py-16 max-w-5xl mx-auto")}>
          <h2 className="text-2xl font-bold text-center mb-8">Trusted by broker-owners</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-xl border bg-card p-6 text-card-foreground">
              <p className="text-sm text-muted-foreground italic mb-4">
                &ldquo;We cut our first-response time in half. Zillow leads used to sit for hours—now we reply in minutes.&rdquo;
              </p>
              <p className="text-sm font-medium">— Sarah M., Houston</p>
            </div>
            <div className="rounded-xl border bg-card p-6 text-card-foreground">
              <p className="text-sm text-muted-foreground italic mb-4">
                &ldquo;One inbox for all our lead conversations. No more digging through texts and emails.&rdquo;
              </p>
              <p className="text-sm font-medium">— Mike T., Dallas</p>
            </div>
            <div className="rounded-xl border bg-card p-6 text-card-foreground">
              <p className="text-sm text-muted-foreground italic mb-4">
                &ldquo;Finally we can see who&apos;s following up. The dashboard gives me visibility I never had.&rdquo;
              </p>
              <p className="text-sm font-medium">— Jennifer L., Austin</p>
            </div>
          </div>
        </section>

        <section className={cn(CONTAINER, PAGE_PADDING, "py-24 bg-muted/30 max-w-5xl mx-auto")}>
            <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="inline-flex h-12 w-12 rounded-full bg-primary/10 items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Capture leads</h3>
                <p className="text-muted-foreground text-sm">Connect your lead sources (e.g. via Airtable and automations). Leads flow in when configured.</p>
              </div>
              <div className="text-center">
                <div className="inline-flex h-12 w-12 rounded-full bg-primary/10 items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Respond quickly</h3>
                <p className="text-muted-foreground text-sm">Respond from one inbox. Keep every conversation in one place so you don&apos;t miss a lead.</p>
              </div>
              <div className="text-center">
                <div className="inline-flex h-12 w-12 rounded-full bg-primary/10 items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Track & close</h3>
                <p className="text-muted-foreground text-sm">Dashboard shows performance. Route leads to the right agents.</p>
              </div>
            </div>
        </section>

        <section className={cn(CONTAINER, PAGE_PADDING, "py-24 max-w-5xl mx-auto")}>
            <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="rounded-xl border p-6">
                <Zap className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Smart routing</h3>
                <p className="text-muted-foreground text-sm">Round-robin (more options coming). Get the right lead to the right agent.</p>
              </div>
              <div className="rounded-xl border p-6">
                <MessageSquare className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">SMS inbox</h3>
                <p className="text-muted-foreground text-sm">One inbox. Respond from anywhere.</p>
              </div>
              <div className="rounded-xl border p-6">
                <Shield className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Security & data</h3>
                <p className="text-muted-foreground text-sm">Your data is stored securely; we don&apos;t overclaim compliance.</p>
              </div>
              <div className="rounded-xl border p-6">
                <Building2 className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Airtable sync</h3>
                <p className="text-muted-foreground text-sm">Keep your base as the source of truth. Real-time sync.</p>
              </div>
            </div>
        </section>

        <section className={cn(CONTAINER, PAGE_PADDING, "py-24 bg-muted/30 max-w-3xl mx-auto text-center")}>
            <h2 className="text-3xl font-bold mb-4">Ready to respond first?</h2>
            <p className="text-muted-foreground mb-8">Start your free trial.</p>
          <Button asChild size="lg">
            <Link href="/signup">Start free trial</Link>
          </Button>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
