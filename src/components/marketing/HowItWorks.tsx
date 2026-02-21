"use client";

const STEPS = [
  {
    num: "01 —",
    title: "Lead texts your number",
    body: "Someone sees your sign or ad and texts. That's the trigger.",
  },
  {
    num: "02 —",
    title: "Instant reply collects the details",
    body: "LeadHandler texts back in seconds — name, buying or selling, timeline, budget. No agent needed.",
  },
  {
    num: "03 —",
    title: "Routed to the right agent, tracked in one inbox",
    body: "The right agent gets the lead based on your routing rules. Every conversation is logged. You see everything.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-12 md:py-20 px-4 sm:px-8 bg-[var(--off)]">
      <div className="mx-auto max-w-[1100px]">
        <div className="text-center mb-12">
          <div className="mb-3.5 inline-block text-[11px] font-bold uppercase tracking-widest text-[var(--subtle)]">
            How it works
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold leading-[1.08] text-[var(--ink)] mb-3.5"
            style={{ letterSpacing: "-1.2px" }}
          >
            Lead texts. Handler replies.
            <br />
            Agent gets the deal.
          </h2>
          <p className="text-base text-gray-600 max-w-[420px] mx-auto leading-relaxed">
            No downloads. No manual forwarding. One number, your rules, done in minutes.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px rounded-[20px] overflow-hidden border border-[var(--border)] bg-[var(--border)]">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className="bg-[var(--white)] p-8 sm:p-9"
            >
              <div className="text-[11px] font-extrabold text-[var(--off2)] tracking-wider tabular-nums mb-5">
                {step.num}
              </div>
              <div className="text-[15.5px] font-extrabold text-[var(--ink)] mb-2.5 tracking-[-0.3px]">
                {step.title}
              </div>
              <div className="text-[13.5px] text-[var(--muted)] leading-[1.65]">
                {step.body}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
