import Link from "next/link";
import { Shield, Lock, Server } from "lucide-react";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { FadeUp } from "@/components/marketing/FadeUp";
import { SectionLabel } from "@/components/marketing/SectionLabel";
import { CONTAINER, PAGE_PADDING } from "@/lib/ui";
import { cn } from "@/lib/utils";

const sections: Array<{
  icon: typeof Shield;
  title: string;
  body: string;
}> = [
  {
    icon: Shield,
    title: "Data handling",
    body: "Lead and contact data are stored in secure, access-controlled systems. We use encryption in transit and at rest. Only your brokerage's authorized users can access your data. We do not sell or share your data with third parties for marketing.",
  },
  {
    icon: Lock,
    title: "Access control",
    body: "Session-based access with role-based views (Broker vs Agent). Credentials and API keys are never exposed in the UI; they are stored and used server-side only.",
  },
  {
    icon: Server,
    title: "Vendors we use",
    body: "We use industry-standard providers for SMS, payments, and data sync. These partners have their own security and compliance programs. We do not overclaim compliance; we encourage you to review their policies as needed.",
  },
];

export const metadata = {
  title: "LeadHandler.ai — Security & data",
  description: "How we handle your brokerage data and the vendors we use.",
};

export default function SecurityPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--white)]">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 md:py-20 bg-[var(--off)]">
          <div className={cn(CONTAINER, PAGE_PADDING, "text-center max-w-2xl mx-auto")}>
            <SectionLabel className="mb-3">Security</SectionLabel>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-[-0.5px] text-[var(--ink)]">
              Security & data
            </h1>
            <p className="mt-4 text-[var(--muted)] text-base sm:text-lg leading-relaxed">
              How we handle your brokerage data and the vendors we use to run the service.
            </p>
          </div>
        </section>

        <FadeUp>
          <section className="py-16 md:py-24 bg-[var(--white)]">
            <div className={cn(CONTAINER, PAGE_PADDING)}>
              <div className="max-w-2xl mx-auto space-y-10">
                {sections.map(({ icon: Icon, title, body }) => (
                  <div key={title} className="flex gap-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--off)] border border-[var(--border)]">
                      <Icon className="h-5 w-5 text-[var(--ink)]" aria-hidden />
                    </div>
                    <div>
                      <h2 className="font-display font-semibold text-[var(--ink)] text-lg">{title}</h2>
                      <p className="text-[var(--muted)] text-sm leading-relaxed mt-2">{body}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[var(--muted)] mt-14 text-center text-sm">
                Questions?{" "}
                <Link href="/contact" className="text-[var(--ink)] font-medium hover:underline">
                  Contact us
                </Link>
              </p>
            </div>
          </section>
        </FadeUp>
      </main>

      <Footer />
    </div>
  );
}
