# LeadHandler Product QA — Page-by-Page Audit

## Terminology (use everywhere)

| Term | Use |
|------|-----|
| Lead Status | New, Contacted, Qualified, Appointment, Closed, Lost |
| Routing mode | Round Robin (default), Weighted (coming soon), Performance (coming soon) |
| Demo | "Demo Mode" (never "fake data") |
| Owner / Agent | Role labels |
| Messages / Leads | Page labels |
| Brokerage | Consistently (not "workspace", not "tenant") |
| Make.com | Never in UI; use "Automations" if needed |

---

## A) Page-by-Page Audit Checklist

### MARKETING

#### `/` (Home)
| Item | Requirement |
|------|-------------|
| **Purpose** | Convert brokerage owners in first 3 seconds |
| **Who** | Anonymous / visitor |
| **Must have** | Hero with 1 clear sentence; 3 value bullets (speed-to-lead, routing, performance visibility); "How it works" (Lead in → AI qualifies → Routed → Tracked); Trust section (light); CTA "Get started" → /login |
| **Must NOT** | Webhooks, A2P, campaigns, APIs, dev jargon |
| **Main CTA** | Get started → /login |
| **Empty/Load/Error** | N/A (static) |

#### `/pricing`
| Item | Requirement |
|------|-------------|
| **Purpose** | Help buyer self-select plan |
| **Who** | Visitor |
| **Must have** | Starter / Growth / Enterprise cards; Feature matrix (no overpromising); FAQ: onboarding time, demo mode, cancel anytime; CTA "Start demo" → /login |
| **Must NOT** | Overpromise features |
| **Main CTA** | Start demo → /login |

#### `/security`
| Item | Requirement |
|------|-------------|
| **Purpose** | Trust |
| **Who** | Visitor |
| **Must have** | Data handling overview; vendor list (Twilio, Stripe, Airtable) as trust signals |
| **Must NOT** | Overclaim compliance |
| **Main CTA** | Optional link to Get started |

#### `/contact`
| Item | Requirement |
|------|-------------|
| **Purpose** | Capture lead |
| **Who** | Visitor |
| **Must have** | Form fields; success toast |
| **Must NOT** | Dev jargon |
| **Main CTA** | Submit form |

---

### AUTH

#### `/login`
| Item | Requirement |
|------|-------------|
| **Purpose** | Get in fast |
| **Who** | Visitor |
| **Must have** | Role picker (Owner / Agent); optional name; Continue |
| **Must NOT** | Technical auth jargon |
| **Main CTA** | Continue → /app/dashboard |

---

### APP SHELL

| Item | Requirement |
|------|-------------|
| **Sidebar** | Labels: Dashboard, Leads, Messages, Agents, Routing, Billing, Settings, Account |
| **Mobile nav** | Same labels; hamburger → Sheet |
| **Demo badge** | Visible when Demo Mode enabled; Owner-only toggle |
| **Banner** | When demo enabled: ONE generic "Backend not connected — running in Demo Mode" with link to Settings. Never "connect Twilio" etc. on Dashboard/Leads/Messages/Agents/Routing |

---

### APP PAGES

#### `/app/dashboard`
| Item | Requirement |
|------|-------------|
| **Purpose** | At-a-glance KPIs and recent activity |
| **Owner** | KPIs matching demo data; recent inbound messages; optional "Leads needing attention" |
| **Agent** | Their assigned leads + recent messages |
| **Must NOT** | Twilio, Stripe, Airtable |
| **States** | Loading skeleton; error boundary |
| **Main CTA** | Contextual (e.g. View leads, View messages) |

#### `/app/leads`
| Item | Requirement |
|------|-------------|
| **Purpose** | List and filter leads |
| **Who** | Owner, Agent |
| **Must have** | Filters by status; search; row click → detail |
| **Empty state** | "No leads yet" + short "How leads arrive" explanation when demo off and no data. Must NOT mention Twilio |
| **States** | Loading skeleton; error |
| **Main CTA** | (When empty) Add lead or go to Settings |

#### `/app/leads/[id]`
| Item | Requirement |
|------|-------------|
| **Purpose** | Lead profile, insight, conversation, next action |
| **Must have** | Profile summary; qualification insight; conversation timeline; next best action; composer (outbound in demo without breaking) |
| **Must NOT** | Twilio |
| **States** | Loading; error; not found |
| **Main CTA** | Send message / Schedule |

#### `/app/messages`
| Item | Requirement |
|------|-------------|
| **Purpose** | Inbox experience |
| **Who** | Owner, Agent |
| **Must have** | Conversation list; thread view; composer |
| **Empty state** | No conversations yet |
| **Must NOT** | Twilio |
| **Main CTA** | Send message |

#### `/app/agents` (Owner only)
| Item | Requirement |
|------|-------------|
| **Purpose** | List agents, performance, toggle active |
| **Must have** | Agent list; performance metrics; toggle active |
| **Empty state** | "Add your first agent" |
| **Must NOT** | Stripe seat limits in a scary way (show seats gently on Billing) |
| **Main CTA** | Add agent (stub) |

#### `/app/routing` (Owner only)
| Item | Requirement |
|------|-------------|
| **Purpose** | Lead distribution rules |
| **Must have** | Round Robin default; "Coming soon" for Weighted, Performance; escalation = business rules (not code) |
| **Must NOT** | Dev/code language |
| **Main CTA** | Save rules |

#### `/app/billing` (Owner only)
| Item | Requirement |
|------|-------------|
| **Purpose** | Plan, seats, subscription |
| **Must have** | Plan card; seats used; manage subscription. May mention Stripe only in plan/subscription context |
| **Must NOT** | API keys |
| **Main CTA** | Upgrade / Manage subscription |

#### `/app/settings` (Owner only)
| Item | Requirement |
|------|-------------|
| **Purpose** | Brokerage profile + integrations. **Only place that can name integrations.** |
| **Must have** | Brokerage profile (name, timezone); Integration cards: Airtable, Twilio, Stripe, Automations. Each: Connected / Not connected; what it unlocks (1 sentence); "How to connect" |
| **Must NOT** | N/A (this is the integration page) |
| **Main CTA** | Save profile; Connect (per integration) |

#### `/app/account`
| Item | Requirement |
|------|-------------|
| **Purpose** | Profile, role switch (demo), logout |
| **Who** | Owner, Agent |
| **Must have** | Profile; role switcher (demo only); logout |
| **Main CTA** | Log out |

---

## B) Fix List (Priority Order)

### P0 — Blocking
- [ ] **Root `/`** — Replace default Next.js page with marketing home (hero, value bullets, how it works, trust, CTA Get started).
- [ ] **App routes** — Add all `/app/*` pages so routes do not 404: dashboard, leads, leads/[id], messages, agents, routing, billing, settings, account.
- [ ] **Demo banner** — When Demo Mode on, show single banner: "Backend not connected — running in Demo Mode" with link to Settings (no Twilio/Stripe/Airtable on Dashboard/Leads/Messages/Agents/Routing).
- [ ] **Settings** — Only page that names Airtable, Twilio, Stripe, Automations; include brokerage profile + integration cards.

### P1 — Important
- [ ] **Layout** — Add Toaster (sonner); set metadata (title/description) for LeadHandler.
- [ ] **error.tsx / not-found.tsx** — Global error boundary and 404 with reset / home link.
- [ ] **Marketing** — Add /pricing, /security, /contact with correct copy and CTAs.
- [ ] **Empty states** — Leads: "No leads yet" + how leads arrive (no Twilio). Messages: "No conversations yet". Agents: "Add your first agent".
- [ ] **Role label** — Topbar/dropdown show "Owner" / "Agent" (capitalize), not "owner" / "agent".
- [ ] **LeadStatusPill** — Use exact labels: New, Contacted, Qualified, Appointment, Closed, Lost.

### P2 — Polish
- [ ] **DataTable** — Empty copy consistent with page (e.g. "No leads" vs "No results").
- [ ] **Routing page** — Round Robin default; "Coming soon" for Weighted, Performance; escalation as business rules.
- [ ] **Billing** — Mention Stripe only for plan/subscription; seats shown gently.
- [ ] **Login** — Copy already broker-friendly; ensure "Demo Mode" (not "demo mode" if we want title case) and "Continue" as CTA.

---

## C) Applied Fixes Summary

(Updated as fixes are applied in code.)

- **Marketing**: Home at `/` with hero, value bullets, how it works, trust, CTA Get started. Pages: `/pricing`, `/security`, `/contact`. Contact form POSTs to `/api/contact` stub; success toast.
- **Layout**: Toaster (sonner) and LeadHandler metadata in root layout. Global `error.tsx` and `not-found.tsx`.
- **App shell**: Demo banner when Demo Mode on: "Backend not connected — running in Demo Mode" with link to Settings (Owner only). Sidebar/MobileNav labels consistent.
- **Leads**: Empty state copy generic (no Airtable); "Go to Settings" CTA.
- **Agents**: Empty state "Add your first agent" with generic description (no Airtable).
- **Messages**: Empty copy "No conversations yet".
- **Routing**: Round Robin default; Weighted (coming soon), Performance (coming soon). Escalation copy business-friendly.
- **Settings**: Only page naming integrations (Airtable, Twilio, Stripe, Automations). "Make" renamed to "Automations" with description "Trigger workflows from lead events". Brokerage + integration cards.
- **Billing**: Stripe mentioned only in subscription context ("Subscription management is handled securely via Stripe").
- **Account**: Role display "Owner" / "Agent" (not lowercase). Role switcher (demo), logout.
- **Terminology**: LeadStatusPill uses exact labels (New, Contacted, Qualified, Appointment, Closed, Lost). Topbar dropdown shows Owner/Agent.
- **Dashboard**: Agent recent leads use LeadStatusPill for status.

---

## Build / Lint

- **Lint**: Fixed `prefer-const` in `lib/demo/data.ts` (messagesCache, insightsCache); session route JWT payload type; security page `sections` type (optional `list`); StatCard icon type (LucideIcon); `pick()` in demo data (String(c)); removed unused imports where applicable. Remaining lint: warnings only (unused vars in other files, react-hooks/exhaustive-deps, TanStack Table memoization warning).
- **Build**: TypeScript compiles. Build fails at "Collecting page data" for `/app/dashboard` with `createContext is not a function`—likely an existing SSR/client boundary issue (e.g. recharts or a dependency using React context in a server component). Needs follow-up: ensure dashboard (or its dependencies) are client-safe or correctly split.
