"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Zap, Building2, Check } from "lucide-react";
import { toast } from "sonner";

/** Matches marketing: Essentials $99, Pro $249. Enterprise = contact for custom. */
const plans = [
  {
    id: "essentials",
    name: "Essentials",
    price: 99,
    icon: Zap,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ESSENTIALS ?? "",
    features: ["Up to 15 agents", "AI qualification", "Lead routing", "SMS inbox", "Seamless lead sync"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 249,
    icon: Building2,
    popular: true,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO ?? "",
    features: ["Up to 40+ agents", "Everything in Essentials", "Advanced routing & analytics", "Priority support"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: null,
    icon: CreditCard,
    priceId: "",
    custom: true,
    features: ["Custom limits", "Dedicated support", "API access", "SLA"],
  },
];

/** Current plan for UI (stub: from session or subscription API later). */
const CURRENT_PLAN_ID = "pro";

export default function BillingPage() {
  const [loading, setLoading] = useState(false);

  async function handleUpgrade(planId: string, priceId: string) {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: priceId || undefined }),
      });
      const data = await res.json();
      if (data.success && data.data?.url) {
        window.location.href = data.data.url;
      } else {
        toast.info("Checkout: " + (data.data?.url ?? "configure STRIPE_PRICE_ID in env"));
      }
    } catch {
      toast.error("Failed to start checkout");
    } finally {
      setLoading(false);
    }
  }

  async function handlePortal() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.success && data.data?.url) {
        window.location.href = data.data.url;
      } else {
        toast.info("Portal: " + (data.data?.url ?? "configure Stripe"));
      }
    } catch {
      toast.error("Failed to open portal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-muted-foreground mt-1">Manage your subscription</p>
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="py-4">
          <p className="text-sm font-medium">
            Active: <span className="capitalize">{CURRENT_PLAN_ID}</span> since Feb 2026
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Update payment or cancel in the billing portal below.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrent = plan.id === CURRENT_PLAN_ID;
          const isCustom = plan.price == null;
          return (
            <Card key={plan.id} className={plan.popular ? "border-primary shadow-sm" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Icon className="h-8 w-8 text-primary" />
                  {plan.popular && <Badge>Popular</Badge>}
                </div>
                <CardTitle>{plan.name}</CardTitle>
                <p className="text-3xl font-bold">
                  {plan.price != null ? (
                    <>
                      ${plan.price}
                      <span className="text-base font-normal text-muted-foreground">/mo</span>
                    </>
                  ) : (
                    <span className="text-base font-normal text-muted-foreground">Custom</span>
                  )}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>
                {isCustom ? (
                  <Button className="w-full min-h-[44px]" variant="outline" asChild>
                    <Link href="/contact">Contact for Custom</Link>
                  </Button>
                ) : (
                  <Button
                    className="w-full min-h-[44px]"
                    variant={plan.popular && !isCurrent ? "default" : "outline"}
                    onClick={() => handleUpgrade(plan.id, plan.priceId)}
                    disabled={loading || isCurrent}
                  >
                    {isCurrent ? "Current plan" : "Upgrade"}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage subscription</CardTitle>
          <p className="text-sm text-muted-foreground">
            Update payment method, view invoices, or cancel. Subscription management is handled securely.
          </p>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handlePortal} disabled={loading} className="min-h-[44px]">
            Open billing portal
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
