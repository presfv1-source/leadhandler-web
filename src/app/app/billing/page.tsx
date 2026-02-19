"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Zap, Building2, Check } from "lucide-react";
import { toast } from "sonner";
import { BILLING_PLANS } from "@/lib/marketingContent";

type PlanId = "free" | "essentials" | "pro" | "enterprise";

const PLAN_ICONS = { essentials: Zap, pro: Building2, enterprise: CreditCard } as const;
const PLAN_POPULAR: Record<string, boolean> = { pro: true };

function getPriceId(planId: string): string {
  if (planId === "essentials") return process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ESSENTIALS ?? "";
  if (planId === "pro") return process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO ?? "";
  return "";
}

export default function BillingPage() {
  const [loading, setLoading] = useState(false);
  const [planId, setPlanId] = useState<PlanId | null>(null);

  useEffect(() => {
    fetch("/api/billing/plan")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data?.planId) setPlanId(data.data.planId);
        else setPlanId("free");
      })
      .catch(() => setPlanId("free"));
  }, []);

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
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-muted-foreground mt-1">Manage your subscription</p>
      </div>

      <Card className="rounded-lg shadow-sm border-primary/30 bg-primary/5">
        <CardContent className="py-4">
          <p className="text-sm font-medium">
            Current plan:{" "}
            <span className="capitalize">
              {planId === null ? "…" : planId === "free" ? "Free" : planId}
            </span>
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {planId === "free"
              ? "Upgrade below or open the billing portal if you have an active subscription."
              : "Update payment or cancel in the billing portal below."}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        {BILLING_PLANS.map((plan) => {
          const Icon = PLAN_ICONS[plan.id as keyof typeof PLAN_ICONS] ?? CreditCard;
          const isCurrent = planId !== null && plan.id === planId;
          const isCustom = plan.price == null;
          const priceId = getPriceId(plan.id);
          return (
            <Card key={plan.id} className={`rounded-lg shadow-sm ${PLAN_POPULAR[plan.id] ? "border-primary" : ""}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Icon className="h-8 w-8 text-primary" />
                  {PLAN_POPULAR[plan.id] && <Badge>Popular</Badge>}
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
                    variant={PLAN_POPULAR[plan.id] && !isCurrent ? "default" : "outline"}
                    onClick={() => handleUpgrade(plan.id, priceId)}
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

      <Card className="rounded-lg shadow-sm">
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
