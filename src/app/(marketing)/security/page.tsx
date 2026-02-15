import Link from "next/link";
import { Shield, Lock, Server } from "lucide-react";
import { MarketingHeader } from "@/components/app/MarketingHeader";
import { MarketingFooter } from "@/components/app/MarketingFooter";
import { CONTAINER_NARROW, PAGE_PADDING, TYPO } from "@/lib/ui";
import { cn } from "@/lib/utils";

const sections: Array<{
  icon: typeof Shield;
  title: string;
  body: string;
  list?: Array<{ name: string; desc: string }>;
}> = [
  {
    icon: Shield,
    title: "Data handling",
    body: "Lead and contact data are stored in secure, access-controlled systems. We use encryption in transit and at rest. Only your brokerage's authorized users can access your data. We do not sell or share your data with third parties for marketing.",
  },
  {
    icon: Lock,
    title: "Access control",
    body: "Session-based access with role-based views (Owner vs Agent). Credentials and API keys are never exposed in the UI; they are stored and used server-side only.",
  },
  {
    icon: Server,
    title: "Vendors we use",
    body: "We rely on established vendors to deliver messaging, payments, and data storage. These partners have their own security and compliance programs. We do not overclaim compliance; we encourage you to review their policies as needed.",
    list: [
      { name: "Twilio", desc: "Messaging and voice (SMS, calls)." },
      { name: "Stripe", desc: "Billing and subscription management." },
      { name: "Airtable", desc: "Optional base for leads and CRM-style data when you connect it." },
    ],
  },
];

export default function SecurityPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MarketingHeader />

      <main className={cn(CONTAINER_NARROW, PAGE_PADDING, "flex-1 py-12 md:py-16")}>
        <h1 className={cn(TYPO.h1, "text-3xl md:text-4xl")}>Security & data</h1>
        <p className={cn(TYPO.muted, "mt-2")}>
          How we handle your brokerage data and the vendors we use to run the service.
        </p>

        <section className="mt-8 md:mt-10 space-y-8">
          {sections.map(({ icon: Icon, title, body, list }) => (
            <div key={title} className="flex gap-4">
              <Icon className="size-8 shrink-0 text-primary" aria-hidden />
              <div>
                <h2 className={cn(TYPO.h3)}>{title}</h2>
                <p className={cn(TYPO.muted, "mt-2 text-sm")}>{body}</p>
                {list && (
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {list.map(({ name, desc }) => (
                      <li key={name}>
                        <strong className="text-foreground">{name}</strong> — {desc}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </section>

        <p className={cn(TYPO.muted, "mt-10 text-center text-sm")}>
          Questions?{" "}
          <Link href="/contact" className="font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
            Contact us
          </Link>
          .
        </p>
      </main>

      <MarketingFooter />
    </div>
  );
}
