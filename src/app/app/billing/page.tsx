"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Zap, Building2 } from "lucide-react";
import { toast } from "sonner";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 29,
    seats: 5,
    icon: Zap,
    features: ["Up to 5 agents", "500 leads/month", "SMS included"],
  },
  {
    id: "growth",
    name: "Growth",
    price: 79,
    seats: 15,
    icon: Building2,
    popular: true,
    features: ["Up to 15 agents", "2,000 leads/month", "Priority support", "Airtable sync"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 199,
    seats: 50,
    icon: CreditCard,
    features: ["Unlimited agents", "Unlimited leads", "Dedicated support", "Custom integrations"],
  },
];

export default function BillingPage() {
  const [loading, setLoading] = useState(false);

  async function handleUpgrade(planId: string) {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.success && data.data?.url) {
        window.location.href = data.data.url;
      } else {
        toast.info("Checkout stub: " + (data.data?.url ?? "No URL"));
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
        toast.info("Portal stub: " + (data.data?.url ?? "No URL"));
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
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <Card key={plan.id} className={plan.popular ? "border-primary" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Icon className="h-8 w-8 text-primary" />
                  {plan.popular && <Badge>Popular</Badge>}
                </div>
                <CardTitle>{plan.name}</CardTitle>
                <p className="text-3xl font-bold">${plan.price}<span className="text-base font-normal text-muted-foreground">/mo</span></p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  {plan.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={loading}
                >
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Manage subscription</CardTitle>
          <p className="text-sm text-muted-foreground">
            Update payment method, view invoices, or cancel. Subscription management is handled securely via Stripe.
          </p>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handlePortal} disabled={loading}>
            Open billing portal
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
