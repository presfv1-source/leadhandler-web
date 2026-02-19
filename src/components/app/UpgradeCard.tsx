"use client";

import Link from "next/link";
import { Lock } from "lucide-react";

export function UpgradeCard({ feature }: { feature: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50 p-12 text-center">
      <div className="mb-4 rounded-full bg-blue-100 p-4">
        <Lock className="h-8 w-8 text-blue-600" />
      </div>
      <h3 className="font-display font-semibold text-lg text-slate-900 mb-2">
        {feature} is a Pro feature
      </h3>
      <p className="text-slate-500 text-sm mb-6 max-w-xs font-sans">
        Upgrade to LeadHandler Pro to unlock {feature} and get full brokerage analytics, weighted routing, and priority support.
      </p>
      <Link
        href="/app/billing"
        className="bg-blue-600 text-white font-semibold text-sm px-6 py-3 rounded-xl hover:opacity-90 transition font-sans"
      >
        Upgrade to Pro →
      </Link>
    </div>
  );
}
