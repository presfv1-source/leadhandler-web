"use client";

import {
  MessageSquare,
  LayoutDashboard,
  Route,
  Target,
  Plug,
  Shield,
} from "lucide-react";
import { CONTAINER, PAGE_PADDING } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { SectionLabel } from "./SectionLabel";

const FEATURES = [
  {
    title: "AI SMS Inbox",
    description:
      "Instant response, 24/7 coverage, shared inbox with tags so your team never misses a lead.",
    icon: MessageSquare,
    large: true,
    tag: "Core",
  },
  {
    title: "Dashboard",
    description:
      "Full visibility for broker-owners. See every lead, reply time, and conversion at a glance.",
    icon: LayoutDashboard,
    large: false,
    tag: null,
  },
  {
    title: "Smart Routing",
    description:
      "Round-robin, weighted, or performance-based. Route to the right agent every time.",
    icon: Route,
    large: false,
    tag: null,
  },
  {
    title: "Lead Score",
    description:
      "AI scores timeline, budget, and motivation so hot leads get priority.",
    icon: Target,
    large: false,
    tag: null,
  },
  {
    title: "Integrations",
    description:
      "Zillow, Realtor.com, Twilio, Airtable. Connect your existing tools.",
    icon: Plug,
    large: false,
    tag: null,
  },
  {
    title: "Roles & Permissions",
    description:
      "Owner vs agent views. Owners control routing; agents see only their leads.",
    icon: Shield,
    large: false,
    tag: null,
  },
];

export function Features() {
  return (
    <section id="features" className="py-16 md:py-24 bg-white">
      <div className={cn(CONTAINER, PAGE_PADDING)}>
        <div className="text-center mb-14">
          <SectionLabel className="mb-3">Features</SectionLabel>
          <h2 className="font-display font-bold text-[#0A0A0A] tracking-tight text-center max-w-2xl mx-auto text-[clamp(2rem,4vw,3rem)]">
            Everything your brokerage needs to stop losing leads.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className={cn(
                  "rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm transition-all duration-200 hover:border-blue-200 hover:shadow-lg",
                  f.large && "md:col-span-2"
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="rounded-xl bg-blue-50 w-12 h-12 flex items-center justify-center shrink-0">
                    <Icon className="h-6 w-6 text-blue-600" aria-hidden />
                  </div>
                  {f.tag && (
                    <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-sans font-medium text-blue-600">
                      {f.tag}
                    </span>
                  )}
                </div>
                <h3 className="font-display font-semibold text-[#0A0A0A] text-[1.15rem] mb-2">
                  {f.title}
                </h3>
                <p className="font-sans text-gray-500 text-sm sm:text-base leading-relaxed">
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
