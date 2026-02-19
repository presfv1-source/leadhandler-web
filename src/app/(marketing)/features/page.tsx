"use client";

import Link from "next/link";
import {
  MessageSquare,
  Target,
  Route,
  LayoutDashboard,
  Inbox,
  Shield,
} from "lucide-react";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { CtaBanner } from "@/components/marketing/CtaBanner";
import { FadeUp } from "@/components/marketing/FadeUp";
import { SectionLabel } from "@/components/marketing/SectionLabel";
import { Button } from "@/components/marketing/Button";
import { CONTAINER, PAGE_PADDING } from "@/lib/ui";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    id: "sms",
    title: "AI-Powered SMS Inbox",
    copy: "Every lead gets an instant response — even at 2am. Our AI handles first contact, qualifies intent, and flags hot prospects so your agents only talk to leads that are ready.",
    tags: ["Instant response", "24/7 coverage", "Shared team inbox"],
    illustration: "left",
  },
  {
    id: "qualification",
    title: "Lead Qualification Engine",
    copy: "The AI asks the right questions — timeline, budget, motivation, buyer vs seller. Every lead gets a qualification score so agents know exactly who to prioritize.",
    tags: ["AI scoring", "Buyer/seller detection", "Priority flagging"],
    illustration: "right",
  },
  {
    id: "routing",
    title: "Smart Routing",
    copy: "Round-robin, weighted, or performance-based — leads go to the right agent automatically. No manager in the middle. No confusion about who's following up.",
    tags: ["Round-robin", "Weighted routing", "Escalation"],
    illustration: "left",
  },
  {
    id: "dashboard",
    title: "Brokerage Dashboard",
    copy: "One view for everything. Today's leads, response times, agent activity, conversion pipeline. Broker-owners get full visibility without micromanaging.",
    tags: ["Live metrics", "Agent performance", "Conversion tracking"],
    illustration: "right",
  },
  {
    id: "inbox",
    title: "Shared Inbox",
    copy: "One inbox for every conversation. Every agent sees their assigned leads. Every message is logged. No more leads buried in personal texts.",
    tags: ["Threaded SMS", "Message history", "Status tracking"],
    illustration: "left",
  },
  {
    id: "roles",
    title: "Roles & Permissions",
    copy: "Owners see everything. Agents see only their leads. Clean separation that keeps your team focused and your data secure.",
    tags: ["Owner role", "Agent role", "Secure access"],
    illustration: "right",
  },
];

const INTEGRATIONS = [
  { name: "Zillow", desc: "Lead sync", letter: "Z", color: "bg-amber-100 text-amber-800" },
  { name: "Realtor.com", desc: "Lead sync", letter: "R", color: "bg-blue-100 text-blue-800" },
  { name: "Twilio", desc: "SMS delivery", letter: "T", color: "bg-red-100 text-red-800" },
  { name: "Airtable", desc: "CRM & data", letter: "A", color: "bg-amber-100 text-amber-800" },
  { name: "Stripe", desc: "Billing", letter: "S", color: "bg-indigo-100 text-indigo-800" },
  { name: "Make.com", desc: "Automation", letter: "M", color: "bg-emerald-100 text-emerald-800" },
];

function SmsMockup() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-lg max-w-sm">
      <div className="space-y-3">
        <div className="flex justify-start">
          <div className="rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-2 text-sm font-sans text-gray-700 max-w-[80%]">
            Hi, I saw your listing at 123 Oak St. Is it still available?
          </div>
        </div>
        <div className="flex justify-end">
          <div className="rounded-2xl rounded-tr-sm bg-blue-600 px-4 py-2 text-sm font-sans text-white max-w-[80%]">
            Yes! When would you like to schedule a showing?
          </div>
        </div>
        <div className="flex justify-start">
          <div className="rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-2 text-sm font-sans text-gray-700 max-w-[80%]">
            How about tomorrow at 2pm?
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreMockup() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-lg max-w-xs">
      <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2 font-sans">
        Lead score
      </p>
      <p className="font-display text-4xl font-bold text-[#0A0A0A] mb-1">82</p>
      <p className="text-sm font-sans text-gray-500 mb-3">Hot · Buyer</p>
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full w-[82%] rounded-full bg-blue-500" />
      </div>
    </div>
  );
}

function RoutingMockup() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-lg max-w-xs">
      <div className="flex items-center justify-between gap-2">
        {["A", "B", "C"].map((l, i) => (
          <div
            key={l}
            className="w-12 h-12 rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center text-sm font-display font-bold text-blue-600"
          >
            {l}
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-2">
        <Route className="h-6 w-6 text-gray-400" aria-hidden />
      </div>
      <p className="text-center text-xs font-sans text-gray-500 mt-1">Round-robin</p>
    </div>
  );
}

function DashboardMiniMockup() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-lg max-w-xs">
      <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3 font-sans">
        Today
      </p>
      <div className="grid grid-cols-2 gap-2">
        {["24", "2.5m", "8", "68%"].map((v, i) => (
          <div key={i} className="rounded-lg bg-gray-50 px-3 py-2">
            <p className="text-lg font-display font-semibold text-[#0A0A0A]">{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function InboxMockup() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-lg max-w-sm overflow-hidden">
      <div className="border-b border-gray-200 px-4 py-2 bg-gray-50">
        <p className="text-xs font-sans font-medium text-gray-600">Inbox</p>
      </div>
      <div className="divide-y divide-gray-100">
        {["James R. · Zillow", "Maria S. · Realtor.com", "David K. · Direct"].map((row) => (
          <div key={row} className="px-4 py-3 text-sm font-sans text-[#0A0A0A]">
            {row}
          </div>
        ))}
      </div>
    </div>
  );
}

function RoleMockup() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-lg max-w-xs">
      <p className="text-xs font-sans font-medium text-gray-500 mb-2">Role</p>
      <div className="space-y-2">
        <div className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-sans font-medium text-blue-600">
          Owner
        </div>
        <div className="rounded-lg bg-gray-50 px-3 py-2 text-sm font-sans text-gray-500">
          Agent
        </div>
      </div>
    </div>
  );
}

const ILLUSTRATIONS: Record<string, React.ReactNode> = {
  sms: <SmsMockup />,
  qualification: <ScoreMockup />,
  routing: <RoutingMockup />,
  dashboard: <DashboardMiniMockup />,
  inbox: <InboxMockup />,
  roles: <RoleMockup />,
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main>
        <FadeUp>
          <section className="relative py-16 md:py-24 overflow-hidden">
            <div
              className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,#EFF6FF_0%,#FFFFFF_70%)]"
              aria-hidden
            />
            <div className={cn("relative", CONTAINER, PAGE_PADDING)}>
              <div className="text-center max-w-2xl mx-auto">
                <SectionLabel className="mb-3">Features</SectionLabel>
                <h1 className="font-display font-extrabold text-[#0A0A0A] tracking-tight text-[clamp(2.5rem,5vw,4rem)] mb-4">
                  Built for brokerages that can&apos;t afford to miss a lead.
                </h1>
                <p className="font-sans text-gray-500 text-lg leading-relaxed mb-8">
                  Every feature is designed around one goal — making sure your leads get
                  responded to, qualified, and routed before your competition even wakes up.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button href="/signup" variant="primary">
                    Start free trial
                  </Button>
                  <Button href="/pricing" variant="ghost">
                    See pricing →
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </FadeUp>

        {FEATURES.map((f, i) => (
          <FadeUp key={f.id} delay={i * 50}>
            <section
              className={cn(
                "py-16 md:py-24",
                i % 2 === 0 ? "bg-white" : "bg-gray-50"
              )}
            >
              <div className={cn(CONTAINER, PAGE_PADDING)}>
                <div
                  className={cn(
                    "grid grid-cols-1 md:grid-cols-2 gap-12 items-center",
                    f.illustration === "right" && "md:grid-flow-dense"
                  )}
                >
                  <div className={f.illustration === "right" ? "md:col-start-2" : ""}>
                    <h2 className="font-display font-bold text-[#0A0A0A] text-2xl mb-4">
                      {f.title}
                    </h2>
                    <p className="font-sans text-gray-500 leading-relaxed mb-4">{f.copy}</p>
                    <div className="flex flex-wrap gap-2">
                      {f.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-blue-50 px-3 py-1 text-xs font-sans font-medium text-blue-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div
                    className={cn(
                      "flex justify-center",
                      f.illustration === "right" ? "md:col-start-1 md:row-start-1" : ""
                    )}
                  >
                    {ILLUSTRATIONS[f.id]}
                  </div>
                </div>
              </div>
            </section>
          </FadeUp>
        ))}

        <FadeUp>
          <section className="py-16 md:py-24 bg-gray-50 border-t border-gray-200">
            <div className={cn(CONTAINER, PAGE_PADDING)}>
              <h2 className="font-display font-bold text-[#0A0A0A] text-2xl mb-10 text-center">
                Connects to the tools you already use.
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {INTEGRATIONS.map((int) => (
                  <div
                    key={int.name}
                    className="rounded-2xl border border-gray-200 bg-white p-4 text-center transition-all hover:border-blue-200 hover:shadow-lg"
                  >
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center text-lg font-display font-bold mx-auto mb-2",
                        int.color
                      )}
                    >
                      {int.letter}
                    </div>
                    <p className="font-sans font-semibold text-[#0A0A0A] text-sm">{int.name}</p>
                    <p className="font-sans text-xs text-gray-500 mt-0.5">{int.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </FadeUp>

        <FadeUp>
          <CtaBanner />
        </FadeUp>
        <Footer />
      </main>
    </div>
  );
}
