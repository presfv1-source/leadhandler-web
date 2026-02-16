# LeadHandler.ai Pricing Accuracy & Conversion Audit Summary

## SESSION SUMMARY

### Plans reviewed

- **Marketing pricing page** — `src/app/(marketing)/pricing/page.tsx` (Starter $49, Growth $99, Enterprise Custom)
- **In-app Billing page** — `src/app/app/billing/page.tsx` (Starter $29, Growth $79, Enterprise $199)
- **Homepage** — trial CTA and bottom section (`src/app/(marketing)/page.tsx`)
- **Marketing header** — CTA to `/login` (`src/components/app/MarketingHeader.tsx`)
- **Pricing FAQ** — onboarding, try first, cancel (on pricing page)

### Inaccuracies fixed

- **Starter — "Shared inbox"** → **"SMS inbox"**  
  Product is SMS-first (Twilio); no email messaging. "SMS inbox" matches the Messages experience.
- **Growth — "Performance reports"** → **"Performance visibility"**  
  Dashboard provides basic stats and agent leaderboard, not a full reports suite. "Visibility" is accurate.
- **Enterprise — "Dedicated support"** → **"Priority support"** (marketing and in-app billing)  
  "Dedicated" implies enterprise-grade guarantees. "Priority support" is credible for early-stage.
- **Enterprise (billing) — "Custom integrations"** → **"Custom options"**  
  Softer; avoids promising integration work that may not be scoped.
- **Homepage — "No credit card required"** removed from trial CTA section.  
  Trial flow not verified; copy limited to "Start your free trial."

### Claims softened

- Marketing pricing: plan feature bullets aligned with product (SMS inbox, performance visibility, priority support).
- In-app billing: Enterprise features softened (priority support, custom options).
- No change to plan names, prices, or agent limits; pricing page and billing page still show different price points (see Risk flags).

### CTA fixes made

- **Marketing pricing:** Starter and Growth already used "Start free trial" → `/login`; Enterprise "Contact sales" → `/contact`. Verified and left as-is.
- **Header:** "Start free trial" → `/login` already correct.
- **Pricing page bottom CTA:** "Start free trial" → `/login` already correct.
- **Homepage:** Primary "Start free trial", secondary "View pricing" already correct. Only trial subcopy changed (removed "No credit card required").

---

## RISK FLAGS

### Plan promises that may still be risky

- **"Unlimited agents" / "Unlimited leads" (Enterprise)**  
  Technically may have limits (Airtable/Twilio/ops). Flag for founder: confirm caps or keep as aspirational and support with process.
- **"Up to 15 agents" / "Up to 3 agents"**  
  Assumes product enforces these limits. If limits are not enforced in code or Stripe, consider clarifying or implementing before scaling sales.
- **"500 leads/month" and "2,000 leads/month" (in-app Billing only)**  
  Only on billing page; not on marketing pricing. Confirm these are real product/Stripe limits before relying in sales conversations.

### Needing founder confirmation

1. **Pricing alignment (marketing vs. in-app)**  
   - Marketing: Starter $49, Growth $99, Enterprise Custom.  
   - In-app Billing: Starter $29, Growth $79, Enterprise $199.  
   Decide one source of truth and align copy (and Stripe products if applicable).
2. **Trial experience**  
   If trial is not fully automated (e.g. no signup, demo-only today), current "Start free trial" is acceptable; add trial length or signup flow in copy once defined.
3. **Enterprise "Custom" vs. fixed $199**  
   Marketing says "Custom"; billing shows $199. Align so customers see one story.
4. **Lead/month limits**  
   If 500/2000 are not enforced or planned, remove or soften on billing page.

---

## PRICING ALIGNMENT

### Match to current product reality

- **Starter:** Small teams, lead routing, SMS inbox — matches round-robin routing and Messages/SMS. Aligned.
- **Growth:** More agents, performance visibility — matches dashboard stats and agent leaderboard. "Performance visibility" is accurate; no heavy analytics implied.
- **Enterprise:** Large teams, priority support, custom options — positioning is credible; no enterprise-scale or compliance promises.

### Recommended plan adjustments (optional)

- Align marketing and in-app prices and feature lists so one set of numbers is the source of truth.
- If lead/month caps are real, add them to marketing pricing for consistency; if not, remove from billing or label as "typical usage" once defined.
- When Stripe products/limits are final, add a one-line trial mention (e.g. "Start your free trial" with optional "X-day trial" when automated).

---

## CONVERSION IMPROVEMENTS

### Highest-impact copy upgrades

1. **Pricing page subhead**  
   Added: "SMS-first lead response for real estate teams." Reinforces product and audience without changing layout.
2. **Feature accuracy**  
   "SMS inbox" and "Performance visibility" set correct expectations; reduces risk of post-signup disappointment.
3. **Support wording**  
   "Priority support" instead of "Dedicated support" keeps Enterprise credible without overpromising.
4. **Trial CTA**  
   Homepage trial section now only "Start your free trial." (removed "No credit card required"); keeps trust and avoids unverified claims.

### Clarity improvements

- Plan descriptions unchanged but already clear (small teams, growing brokerages, large teams/custom).
- FAQ unchanged: onboarding, Demo Mode, cancel — all consistent with product and Stripe.
- Enterprise CTA "Contact sales" and link to `/contact` are clear and consistent.

---

## NEXT RECOMMENDATIONS

### When product matures

- **Trial:** Once trial is automated (signup, duration, Stripe), add trial length to pricing and CTAs (e.g. "14-day free trial") and optionally reintroduce "No credit card required" if true.
- **Proof points:** Add one line of social proof or outcome (e.g. "Built for speed-to-lead") when you have customer permission or public references.
- **Reporting:** If you ship a real reports/export feature, consider upgrading "Performance visibility" to "Performance reports" or "Basic reports" on Growth.
- **Enterprise:** If you add SLAs or dedicated success, you can reintroduce "Dedicated support" or "Success manager" with clear scope.

### Future pricing proof points to add

- Clear trial length and what happens at trial end.
- One source of truth for prices and limits (marketing + in-app + Stripe).
- Optional "Most popular" or "Best for growing teams" microcopy when you have usage data.
- Any lead/month or agent limits that are enforced in product or billing, stated consistently.

---

## SUCCESS CRITERIA (CHECKLIST)

- [x] Pricing page feels credible to a skeptical broker.
- [x] Each plan’s copy clearly reflects what the product does today.
- [x] No overclaims (reports → visibility; dedicated → priority; shared inbox → SMS inbox).
- [x] CTAs standardized: Starter & Growth = "Start free trial"; Enterprise = "Contact sales"; header = "Start free trial."
- [x] Trial language honest (no unverified "No credit card required").
- [ ] **Founder:** Align marketing vs. in-app pricing and Stripe when ready.
