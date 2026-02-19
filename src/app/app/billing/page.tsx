"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/app/PageHeader";
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

  const plansToShow = BILLING_PLANS.filter((p) => p.id === "essentials" || p.id === "pro");

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title="Billing & Plan"
        subtitle="Manage your subscription and payment method."
      />

      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 font-sans">
        You&apos;re on beta pricing. Your rate is locked as long as you stay subscribed.
      </div>

      <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Badge className="bg-blue-600 text-white font-sans">
                {planId === null ? "…" : planId === "free" ? "Free" : planId.charAt(0).toUpperCase() + planId.slice(1)}
              </Badge>
              <p className="text-2xl font-display font-bold text-slate-900 mt-2">
                {planId === "essentials" && "$99"}
                {planId === "pro" && "$249"}
                {planId !== "essentials" && planId !== "pro" && planId !== null && "/mo"}
              </p>
              <p className="text-sm text-slate-500 font-sans mt-1">
                Renewal: next billing cycle. Usage: agents and leads this month from dashboard.
              </p>
            </div>
            <div className="flex gap-2">
              {planId === "essentials" && (
                <Button
                  onClick={() => handleUpgrade("pro", getPriceId("pro"))}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 font-sans"
                >
                  Upgrade to Pro
                </Button>
              )}
              {(planId === "pro" || planId === "essentials") && (
                <Button variant="outline" onClick={handlePortal} disabled={loading} className="font-sans">
                  Manage Subscription
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {planId === "essentials" && (
        <div className="grid gap-6 md:grid-cols-2">
          {plansToShow.map((plan) => {
            const Icon = PLAN_ICONS[plan.id as keyof typeof PLAN_ICONS] ?? CreditCard;
            const isCurrent = planId !== null && plan.id === planId;
            const priceId = getPriceId(plan.id);
            return (
              <Card
                key={plan.id}
                className={`rounded-2xl border shadow-sm ${
                  PLAN_POPULAR[plan.id] ? "border-blue-500" : "border-slate-200"
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Icon className="h-8 w-8 text-blue-600" />
                    {PLAN_POPULAR[plan.id] && <Badge className="font-sans">Popular</Badge>}
                  </div>
                  <CardTitle className="font-display">{plan.name}</CardTitle>
                  <p className="text-2xl font-display font-bold text-slate-900">
                    {plan.price != null ? `$${plan.price}` : "Custom"}
                    <span className="text-base font-normal text-slate-500 font-sans">/mo</span>
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-500 font-sans">{plan.description}</p>
                  <ul className="space-y-2 text-sm font-sans">
                    {plan.features.slice(0, 5).map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <Check className="h-4 w-4 shrink-0 text-blue-600" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {plan.id === "essentials" && (
                    <p className="text-xs text-slate-500 font-sans">Current Plan</p>
                  )}
                  {plan.id === "pro" && (
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 font-sans"
                      onClick={() => handleUpgrade(plan.id, priceId)}
                      disabled={loading || isCurrent}
                    >
                      Upgrade to Pro →
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="font-display">Payment Method</CardTitle>
          <p className="text-sm text-slate-500 font-sans">Card on file for subscription</p>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-sans text-slate-600">•••• 4242 — Expires 12/25</p>
          <Button variant="outline" onClick={handlePortal} disabled={loading} className="mt-4 font-sans">
            Update payment method
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
        <CardHeader>
          <CardTitle className="font-display">Billing History</CardTitle>
          <p className="text-sm text-slate-500 font-sans">Invoices and payments</p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-sans">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Description</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { date: "Feb 19, 2026", desc: "LeadHandler Pro — Monthly", amount: "$249.00", status: "Paid" },
                  { date: "Jan 19, 2026", desc: "LeadHandler Pro — Monthly", amount: "$249.00", status: "Paid" },
                  { date: "Dec 19, 2025", desc: "LeadHandler Pro — Monthly", amount: "$249.00", status: "Paid" },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="py-3 px-4 text-slate-600">{row.date}</td>
                    <td className="py-3 px-4 text-slate-900">{row.desc}</td>
                    <td className="py-3 px-4 text-slate-600">{row.amount}</td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary" className="bg-green-100 text-green-800 font-sans">
                        {row.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <button type="button" className="text-blue-600 hover:underline font-sans">
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
