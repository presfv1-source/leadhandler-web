# LeadHandler.ai Launch Readiness & Trust Pass

## Summary

Trust and conversion fixes were applied across marketing and app pages. No new features or layout redesigns. No fake testimonials, logos, metrics, urgency, or discounts.

---

## What changed (by file)

### 1. Demo mode banner

**File:** `src/components/app/AppShell.tsx`  
- **Before:** Loud amber banner: "Backend not connected — running in Demo Mode. Connect in Settings"  
- **After:** Banner removed from AppShell; replaced by new client component.

**File:** `src/components/app/DemoModeBanner.tsx` (new)  
- **After:** Subtle, muted bar: "Demo mode: sample data. Connect Airtable in Settings to go live." (with link for owners).  
- **Behavior:** Shown only when `demoEnabled=true`. Dismissible for the session via sessionStorage; dismiss button (X). No red/error styling; uses `bg-muted/40` and `text-muted-foreground`.

### 2. Demo labels

**File:** `src/components/app/Topbar.tsx`  
- **Before:** Dropdown showed "Owner" or "Agent" only.  
- **After:** When `demoEnabled`, role line shows "Owner (Demo)" or "Agent (Demo)" in the same muted line.

**File:** `src/components/app/DemoBadge.tsx`  
- **Before:** Badge text "Demo Mode".  
- **After:** Badge text "Demo" (smaller, less toy-like). `text-xs` applied.

### 3. Settings → integrations

**File:** `src/app/app/settings/page.tsx`  
- **Before:** "Not connected" for each integration; no next step.  
- **After:** When not connected, badge text is "Not configured" (clearer than "Not connected"). Helper text added for each integration when not configured:  
  - Airtable: "Set AIRTABLE_BASE_ID and AIRTABLE_API_KEY in .env (see README)."  
  - Stripe: "Set STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env."  
  - Twilio: "Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_FROM_NUMBER in .env."  
  - Automations: "Set MAKE_WEBHOOK_URL in .env."  
- **Note:** "Connected" still shown only when env keys are present (getEnvSummary). No claims without verification.

### 4. Pricing (Option A — early traction)

**File:** `src/app/(marketing)/pricing/page.tsx`  
- **Before:** Starter $149/mo, Growth $349/mo.  
- **After:** Starter **$99/mo**, Growth **$249/mo**. Enterprise unchanged (Custom, Contact sales).  
- **CTAs:** Unchanged — "Start free trial" (Starter/Growth), "Contact sales" (Enterprise). Links verified: trial → /login, Enterprise → /contact.

### 5. CTA consistency

- **Checked:** All marketing CTAs use "Start free trial" (homepage, pricing page, header). No "Start demo" or "Get started" on primary buttons. Enterprise remains "Contact sales".  
- **No code changes** — already consistent.

### 6. Demo data believability

**File:** `src/lib/demo/data.ts` (buildMessagesForLead)  
- **Before:** Message timestamps were `Date.now() - (count - i) * 3600000` (1h apart, most recent at "now"), so activity feed showed many "Just now" / similar times.  
- **After:** Each message gets a seeded offset (2 min to 36 hours ago): `createdAt = now - offsetMs` with `offsetMs` from `seededRandom(leadId + "msgT" + i)`. Activity feed now shows staggered relative times (e.g. 2m ago, 18m ago, 1h ago, yesterday).  
- **Leads:** Already use `randomSource` (Website, Zillow, Realtor.com, HAR, Referral, Open house) and `randomLeadStatus`; agent names from seed; no change.

### 7. Trust footer and legal pages

**File:** `src/components/app/MarketingFooter.tsx`  
- **Before:** Links: LeadHandler.ai · Pricing · Security · Contact.  
- **After:** Links: LeadHandler.ai · Pricing · Security · **Privacy** · **Terms** · Contact. New line: **© 2026 LeadHandler.ai · Houston, TX**.

**File:** `src/app/(marketing)/privacy/page.tsx` (new)  
- Minimal, honest privacy page: what we process, no sell to third parties, vendors, link to Security page, contact for access/deletion, "Last updated: 2026."

**File:** `src/app/(marketing)/terms/page.tsx` (new)  
- Minimal terms page: acceptable use, as-is service, Stripe billing, contact, "Last updated: 2026."

---

## Before/after copy (banners and pricing)

| Location | Before | After |
|----------|--------|--------|
| App demo banner | Backend not connected — running in Demo Mode. Connect in Settings | Demo mode: sample data. Connect Airtable in Settings to go live. [Dismissible] |
| Topbar role (demo) | Owner / Agent | Owner (Demo) / Agent (Demo) |
| Demo badge | Demo Mode | Demo |
| Settings not connected | Not connected | Not configured + 1-line env helper |
| Pricing Starter | $149/mo | $99/mo |
| Pricing Growth | $349/mo | $249/mo |
| Footer | LeadHandler · Pricing · Security · Contact | + Privacy · Terms; + © 2026 LeadHandler.ai · Houston, TX |

---

## Remaining blockers

- None that block launch. In-app Billing page still shows different prices ($29 / $79 / $199); align with marketing ($99 / $249) and Stripe when ready (see Founder confirmation).

---

## Founder confirmation

1. **Pricing Option A vs B**  
   - **Option A (implemented):** Starter $99, Growth $249 for early traction.  
   - **Option B (not done):** Keep $349 / $799 and add ROI framing + "Built for brokerages" bullets.  
   - **Confirm:** Proceed with $99 / $249 or switch to Option B and revert pricing + add framing.

2. **Stripe and in-app billing**  
   - Marketing shows $99 / $249. In-app Billing and Stripe products may still be at other price points. Confirm when to align Stripe and in-app display with $99 / $249.

3. **Footer contact**  
   - Footer has Contact link to /contact (form). No email in footer; add one (e.g. support@…) if desired.

4. **Privacy/Terms**  
   - Placeholder pages are live and honest. Have legal review before heavy promotion.

---

## Success criteria

- [x] Demo banner subtle and dismissible; not error-like.  
- [x] Demo labels: "(Demo)" when demo; badge "Demo".  
- [x] Settings integrations: "Not configured" + env helper; "Connected" only when verified.  
- [x] Pricing: $99 / $249 on marketing; CTAs consistent.  
- [x] Demo activity: staggered timestamps; sources/statuses/agents already varied.  
- [x] Footer: Privacy, Terms, Contact, © 2026 LeadHandler.ai · Houston, TX.  
- [x] No fake claims; no layout redesign.
