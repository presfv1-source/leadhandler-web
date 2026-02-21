"use client";

import Link from "next/link";
import { Lock } from "lucide-react";

export function UpgradeCard({ feature }: { feature: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#e2e2e2] bg-[#f5f5f5] p-16 text-center min-h-64">
      <div className="mb-4 rounded-full bg-[#f0f0f0] p-4">
        <Lock className="h-8 w-8 text-[#111111]" />
      </div>
      <h3 className="font-display font-semibold text-xl text-[#111111] mb-2">
        {feature} is a Pro feature
      </h3>
      <p className="text-[#a0a0a0] text-sm mb-6 max-w-xs leading-relaxed font-sans">
        Upgrade to LeadHandler Pro to unlock {feature}, plus weighted routing, escalation rules, and priority support.
      </p>
      <Link
        href="/app/billing"
        className="bg-[#111111] text-white font-semibold text-sm px-6 py-3 rounded-xl hover:opacity-90 transition font-sans"
      >
        Upgrade to Pro →
      </Link>
    </div>
  );
}
