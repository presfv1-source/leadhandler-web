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
        <section className="py-24 px-4 md:px-8 bg-gradient-to-b from-indigo-50/50 to-background dark:from-indigo-950/20 dark:to-background">
          <div className="container max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Turn leads into appointments
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              AI-powered lead management for real estate teams. Respond faster, qualify smarter, close more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-base">
                <Link href="/login">Get started</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base">
                <Link href="/pricing">View pricing</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className={cn(CONTAINER, PAGE_PADDING, "py-16 max-w-5xl mx-auto")}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-3xl font-bold text-indigo-600">8x</p>
                <p className="text-sm text-muted-foreground mt-1">Faster response</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-indigo-600">47%</p>
                <p className="text-sm text-muted-foreground mt-1">More qualified leads</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-indigo-600">2.3x</p>
                <p className="text-sm text-muted-foreground mt-1">More appointments</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-indigo-600">500+</p>
                <p className="text-sm text-muted-foreground mt-1">Happy teams</p>
              </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white text-base">
              <Link href="/login">Start Free 14-day Trial</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base border-indigo-600/50 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-950/30">
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>
        </section>

        <section className={cn(CONTAINER, PAGE_PADDING, "py-24 bg-muted/30 max-w-5xl mx-auto")}>
            <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="inline-flex h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Capture leads</h3>
                <p className="text-muted-foreground text-sm">Connect your CRM, website, and Zillow. Leads flow in automatically.</p>
              </div>
              <div className="text-center">
                <div className="inline-flex h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Respond instantly</h3>
                <p className="text-muted-foreground text-sm">AI drafts responses. You send with one click. Never miss a lead.</p>
              </div>
              <div className="text-center">
                <div className="inline-flex h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-indigo-600" />
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
                <Zap className="h-8 w-8 text-indigo-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2">Smart routing</h3>
                <p className="text-muted-foreground text-sm">Round-robin or skills-based. Get the right lead to the right agent.</p>
              </div>
              <div className="rounded-xl border p-6">
                <MessageSquare className="h-8 w-8 text-indigo-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2">SMS & email</h3>
                <p className="text-muted-foreground text-sm">One inbox. Respond from anywhere.</p>
              </div>
              <div className="rounded-xl border p-6">
                <Shield className="h-8 w-8 text-indigo-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2">Security first</h3>
                <p className="text-muted-foreground text-sm">Encryption and secure data handling.</p>
              </div>
              <div className="rounded-xl border p-6">
                <Building2 className="h-8 w-8 text-indigo-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2">Airtable sync</h3>
                <p className="text-muted-foreground text-sm">Keep your base as the source of truth. Real-time sync.</p>
              </div>
            </div>
        </section>

        <section className={cn(CONTAINER, PAGE_PADDING, "py-24 bg-muted/30 max-w-3xl mx-auto text-center")}>
            <h2 className="text-3xl font-bold mb-4">Ready to close more deals?</h2>
            <p className="text-muted-foreground mb-8">Start your free trial. No credit card required.</p>
          <Button asChild size="lg">
            <Link href="/login">Get started</Link>
          </Button>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
