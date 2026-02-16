# LeadHandler.ai Pricing Launch Update

## Summary

Marketing site pricing display was updated to launch pricing. Display-only change; no Stripe price IDs, billing logic, or pricing card layout was modified.

---

## Files changed

| File | Change |
|------|--------|
| `src/app/(marketing)/pricing/page.tsx` | Starter `$349` → `$149`; Growth `$799` → `$349`. Enterprise left as `Custom`. |

---

## Old → new values

| Plan | Previous (marketing) | New (launch) |
|------|----------------------|--------------|
| Starter | $349/mo | **$149/mo** |
| Growth | $799/mo | **$349/mo** |
| Enterprise | Custom | Custom (unchanged) |

---

## Stale price check

Searched `src` for legacy marketing prices: **49, 99, 249, 799** (as `$49`, `$99`, `$249`, `$799` or string literals). **No matches found.** No leftover legacy pricing on marketing pages.

---

## Hardcoded prices still present (unchanged)

- **`src/app/app/billing/page.tsx`** (in-app Billing): Shows `$29`, `$79`, `$199` /mo. Intentionally not modified; Stripe/billing logic untouched per instructions.

---

## Stripe / in-app mismatches

- **Marketing (after this update):** Starter $149/mo, Growth $349/mo, Enterprise Custom.
- **In-app Billing:** Starter $29/mo, Growth $79/mo, Enterprise $199/mo.

Marketing and in-app billing still use different price sets. No Stripe code, price IDs, or checkout/portal logic was changed. Align Stripe products and in-app display when you are ready to enforce these prices in billing.

---

## CTAs verified

- Starter: "Start free trial" → `/login`
- Growth: "Start free trial" → `/login`
- Enterprise: "Contact sales" → `/contact`

Unchanged and correct.

---

## Mobile layout

- Pricing cards use the same structure: `plan.price` + `plan.period` with existing typography and spacing. No layout or styling changes. Mobile pricing cards render cleanly (same responsive grid and card layout as before).

---

## Success criteria

- [x] Pricing page shows $149 (Starter) and $349 (Growth)
- [x] No visual regressions; layout and CTAs unchanged
- [x] No legacy pricing (49, 99, 249, 799) in marketing source
- [x] Stripe wiring untouched

---

## Date

Launch pricing display update applied to marketing pricing page.
