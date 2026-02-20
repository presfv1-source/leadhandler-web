"use client";

import { CONTAINER, PAGE_PADDING } from "@/lib/ui";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const BETA_BULLETS = [
  "Full setup support — we help you configure your number and routing rules",
  "Direct access to the founder — feedback shapes the product",
  "Beta pricing locked in for the life of your subscription",
];

const FAQ_ITEMS = [
  {
    q: "Does this replace my agents?",
    a: "No. LeadHandler routes leads TO your agents faster. They handle the relationship — we handle the first reply and the handoff.",
  },
  {
    q: "Can we use it per listing?",
    a: "Yes. Each listing can have its own number, or you can use one team number for all inbound leads.",
  },
  {
    q: "How fast is setup?",
    a: "Most brokerages are live in under an hour. One number, your routing rules, done.",
  },
  {
    q: "Is this available outside Texas?",
    a: "Beta is Texas-first. We're expanding based on demand — get on the list now.",
  },
  {
    q: "What does it cost?",
    a: "Beta pricing starts at $99/mo. See /pricing for full details.",
  },
];

export function BetaProofFaq() {
  return (
    <section id="beta" className="py-16 md:py-24 bg-gray-50">
      <div className={cn(CONTAINER, PAGE_PADDING)}>
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display font-bold text-[#0A0A0A] tracking-tight text-center text-[clamp(2rem,4vw,3rem)] mb-8">
            Beta — limited spots in Texas.
          </h2>
          <ul className="space-y-3 mb-12 font-sans text-gray-700">
            {BETA_BULLETS.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
          <Accordion type="single" collapsible className="w-full rounded-lg border border-gray-200 bg-white">
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem key={item.q} value={`faq-${i}`} className="px-4">
                <AccordionTrigger className="text-left font-medium text-[#0A0A0A]">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
