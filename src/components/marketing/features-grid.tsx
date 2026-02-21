"use client";

const FEATURE_CARDS = [
  {
    title: "Instant text-back",
    body: "Every lead gets a reply in seconds. 24/7, no exceptions.",
  },
  {
    title: "Smart routing",
    body: "Round-robin or rules-based. The right agent gets the right lead.",
  },
  {
    title: "Shared inbox",
    body: "Every SMS conversation in one place. No dropped threads.",
  },
  {
    title: "Owner visibility",
    body: "See every lead, every response time, every agent. Full accountability.",
  },
  {
    title: "Missed-lead prevention",
    body: "If no agent responds, it escalates. No lead sits unanswered.",
  },
  {
    title: "Setup in minutes",
    body: "One phone number. A few routing rules. You're live.",
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="py-12 md:py-20 px-4 sm:px-8 bg-[var(--white)]">
      <div className="mx-auto max-w-[1100px]">
        <div className="text-center mb-12">
          <div className="mb-3.5 inline-block text-[11px] font-bold uppercase tracking-widest text-[var(--subtle)]">
            Features
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold leading-[1.08] text-[var(--ink)] mb-3.5"
            style={{ letterSpacing: "-1.2px" }}
          >
            Built so no lead goes cold.
          </h2>
          <p className="text-base text-gray-600 max-w-[420px] mx-auto leading-relaxed">
            Every feature answers one question: did the lead get a response?
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURE_CARDS.map((card, i) => (
            <div
              key={i}
              className="rounded-[20px] border border-[var(--border)] bg-[var(--off)] p-8"
            >
              <div className="text-[17px] font-extrabold text-[var(--ink)] tracking-[-0.4px] mb-2">
                {card.title}
              </div>
              <div className="text-[13px] text-[var(--muted)] leading-[1.6]">
                {card.body}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
