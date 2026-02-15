# LEADHANDLER MASTER CONTEXT — EXPANDED DEEP VERSION

Last Updated: Feb 2026
Owner: Preston Male
Product: LeadHandler.ai

---

# 0. HOW AI SHOULD USE THIS FILE

This document provides **deep operational context** for any AI agent working in the LeadHandler codebase.

It exists to prevent:

* Wrong architectural decisions
* Premature optimization
* Feature creep during stabilization
* UI decisions that hurt perceived value
* Breaking Make.com assumptions
* Misunderstanding founder priorities

AI should treat this as **strategic ground truth**.

---

# 1. PRODUCT MISSION (DETAILED)

## Core Mission

LeadHandler exists to ensure that **every inbound real estate lead receives an immediate, intelligent response and is routed to the correct agent without human delay.**

In the real estate world:

* Speed-to-lead is everything
* Brokerages waste massive money on leads
* Agents respond inconsistently
* Follow-up is chaotic
* Visibility is poor

LeadHandler's job is to become the **automatic first responder layer**.

---

## What Success Looks Like

A brokerage installs LeadHandler and:

1. A Zillow/Realtor/etc lead comes in
2. LeadHandler texts instantly
3. AI qualifies the lead
4. Lead is routed via round robin
5. Conversation is logged
6. Broker can see performance metrics
7. No manual intervention required

If this works reliably, the product sells itself.

---

# 2. TARGET CUSTOMER PROFILE (CRITICAL)

## Primary ICP

* Mid-size real estate brokerages
* Team leaders with multiple agents
* High internet lead volume teams
* Broker-owners who care about ROI

---

## Customer Pain Points

LeadHandler must visibly solve:

* "My agents respond too slow"
* "We're wasting Zillow spend"
* "I can't track response time"
* "Leads fall through the cracks"
* "Routing is messy"
* "Follow-up is inconsistent"

Every UI and feature decision should reinforce solving these pains.

---

## Customer Sophistication Level

Important constraint:

Most broker-owners are **not technical**.

Therefore the product must feel:

* Obvious
* Simple
* Fast
* Trustworthy

Not:

* Developer-centric
* Over-configurable
* Complex

---

# 3. SYSTEM ARCHITECTURE (DEEP)

## High-Level Flow

Current real-world architecture:

User → Website UI → Make.com → Airtable → Twilio → Lead
↓
Stripe (billing)

---

## Role of Each Layer

### Frontend (React/Vite/Base44)

Purpose:

* Authentication
* Dashboard display
* Onboarding UI
* Settings
* Visibility into system

It is **NOT** the primary logic engine.

---

### Make.com (PRIMARY AUTOMATION BRAIN)

Make currently handles:

* Lead intake workflows
* AI message generation
* Routing logic
* Escalation logic
* Conversation handling
* Some business rules

⚠️ This is fragile but fast for MVP.

AI agents must NOT assume this logic is migrating immediately.

---

### Airtable (SYSTEM OF RECORD)

Airtable is currently the source of truth for:

* Brokerages
* Agents
* Leads
* Conversations
* Messages
* Routing state

Key risk:

Relational integrity must remain clean.

---

### Twilio (TRANSPORT LAYER)

Twilio handles:

* SMS send
* SMS receive
* Phone numbers
* A2P compliance

This is a **hard dependency** for product viability.

---

### Stripe (MONETIZATION GATE)

Stripe must eventually control:

* Who has access
* What tier they are on
* Billing lifecycle
* Subscription enforcement

Currently partially wired.

---

# 4. CURRENT MATURITY LEVEL (HONEST)

## What Is Strong

* Vision clarity
* Core routing concept
* UI direction improving
* Automation logic partially built
* Founder execution speed
* Technical stack is viable

---

## What Is Fragile

* End-to-end reliability
* Twilio campaign approval
* Stripe production wiring
* Role-based UI consistency
* Mobile responsiveness
* Demo realism
* Error handling

---

## What Is Unknown Risk

* Make scenario brittleness at scale
* Airtable performance at higher volume
* SMS deliverability under load
* Webhook race conditions
* Real customer onboarding friction

---

# 5. PHASE 0 — PRODUCT STABILIZATION (EXPANDED)

This is the **most important section**.

The founder has explicitly defined this phase.

---

## Objective

Make the system **boringly reliable** before scaling.

---

## Non-Negotiable Rules

During Phase 0:

* No major new features
* No architectural rewrites
* No premature scaling work
* No vanity UI work that doesn't improve clarity
* No experimental complexity

AI must actively resist feature creep.

---

## Phase 0 Success Checklist (Expanded)

### Onboarding

Must work cleanly:

User signup → Brokerage created → Agents added → Number assigned → First lead processed

Failure modes to watch:

* orphan brokerages
* missing agent links
* partial onboarding states
* silent failures

---

### Lead Intake

Must guarantee:

* Lead always stored
* Required fields present
* No duplicate chaos
* Proper brokerage association

---

### Round Robin

Must ensure:

* Fair rotation
* No stuck agent
* No null assignment
* Works with agent availability
* Handles edge cases

---

### SMS Delivery

Must confirm:

* Twilio send success
* inbound parsing works
* no dropped conversations
* retries where needed
* delivery failures visible

---

### Conversation Logging

System must guarantee:

* every message stored
* correct direction
* correct timestamps
* linked to lead
* linked to agent

---

### Dashboard Accuracy

Owner dashboard must reflect:

* real counts
* correct attribution
* no stale data
* no obvious mismatches

Perceived accuracy is **sales critical**.

---

### Stripe Enforcement

Must ensure:

* unpaid users restricted
* plan tiers respected
* webhooks idempotent
* cancellations handled
* upgrades smooth

---

### Demo Environment

Must feel:

* realistic
* valuable
* believable
* clearly labeled demo
* but not obviously fake

This directly affects conversions.

---

### Console Errors

Goal:

**Zero critical console errors** in normal flows.

AI should aggressively eliminate:

* undefined access
* failed fetches
* routing errors
* hydration issues
* mobile layout breaks

---

# 6. UI / UX REQUIREMENTS (DEEP)

## Visual Tone

Target vibe:

* Premium SaaS
* Modern enterprise
* Clean white base
* Strong contrast
* Vibrant accents

Founder explicitly dislikes:

* pastel washed colors
* cheap template look
* clutter
* overly playful UI

---

## Psychological Positioning

Every screen should imply:

* speed
* automation
* money impact
* broker control
* operational visibility

---

## Navigation Requirements

Must be:

* obvious
* fast
* consistent
* mobile-safe
* role-aware

---

## Mobile Requirements (STRICT)

The product must be usable on:

* iPhone standard sizes
* small Android screens
* tablet portrait

Common failures to avoid:

* overflow tables
* cut-off cards
* broken sidebars
* tap targets too small
* horizontal scroll

---

# 7. ROLE MODEL (PERMISSIONS)

## Broker Owner

Has access to:

* full dashboard
* agent management
* routing visibility
* performance metrics
* billing
* settings

---

## Agent (Future / Partial)

Will have limited view.

Important constraint:

Owner features must **never accidentally disappear** due to role bugs.

---

# 8. DEMO MODE PHILOSOPHY

Founder insight:

Demo quality strongly affects perceived value.

---

## Demo Must:

* load instantly
* show meaningful data
* look realistic
* include multiple agents
* include believable activity
* clearly say demo somewhere
* but not feel fake

---

## Demo Must NOT:

* show obvious placeholders
* show empty dashboards
* show inconsistent names
* leak into real data
* feel like a toy

---

# 9. KNOWN RISK ZONES (WATCH CLOSELY)

AI should be cautious around:

---

## Twilio Risks

* A2P approval delays
* carrier filtering
* webhook misconfig
* number assignment edge cases
* delivery status drift

---

## Airtable Risks

* relational drift
* orphan records
* formula brittleness
* scaling limits
* view inconsistencies

---

## Make.com Risks

* scenario brittleness
* silent failures
* race conditions
* retry storms
* hidden complexity

---

## Stripe Risks

* webhook duplication
* out-of-order events
* subscription state drift
* failed payment edge cases

---

## Frontend Risks

* role rendering bugs
* mobile regressions
* stale cache
* environment misconfig
* auth edge cases

---

# 10. DEVELOPMENT PHILOSOPHY FOR AI

When making decisions, bias toward:

* reliability
* clarity
* incremental improvement
* sales credibility
* fast load times
* obvious UX

Avoid:

* clever but fragile code
* over-abstracted patterns
* heavy new dependencies
* premature microservices
* speculative optimizations

---

# 11. FOUNDER PROFILE (FOR AI AWARENESS)

Founder traits:

* highly driven
* fast-moving
* iterative
* learning while building
* cares deeply about perceived value
* willing to refactor later
* cost-sensitive early
* long-term empire mindset

AI should:

* provide practical solutions
* avoid academic overengineering
* prioritize shipping stability
* maintain clean upgrade paths

---

# 12. NEAR-TERM EXECUTION PRIORITIES

Ordered by real impact:

1. Twilio campaign stability
2. End-to-end onboarding proof
3. Stripe production wiring
4. Demo polish
5. Mobile responsiveness
6. Dashboard accuracy
7. Error elimination
8. Data integrity validation

---

# 13. LONG-TERM STRATEGIC DIRECTION (AWARENESS ONLY)

Not Phase 0 work.

Possible future:

* dedicated backend
* event queue
* AI scoring models
* multi-channel messaging
* enterprise analytics
* city-level data aggregation
* data partnerships

AI should not prematurely optimize for these.

---

# FINAL INSTRUCTION TO AI AGENTS

LeadHandler is at a **high-leverage but fragile stage**.

The fastest path to success is:

* make the core flow rock solid
* make the UI feel premium
* make onboarding frictionless
* eliminate silent failures
* prove real broker ROI

When uncertain:

> Choose the path that increases reliability, clarity, and sales credibility.

---

END OF EXPANDED CONTEXT
