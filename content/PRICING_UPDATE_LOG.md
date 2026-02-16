# LeadHandler.ai Pricing Update Log

## Summary

Display pricing on the **marketing site** was updated to the new structure. This was a display + metadata update only. No Stripe IDs, billing logic, or plan logic was changed.

---

## Files changed

| File | Change |
|------|--------|
| `src/app/(marketing)/pricing/page.tsx` | Starter price `$49` → `$349`; Growth price `$99` → `$799`. Enterprise left as `Custom`. |

---

## Old → new values

| Plan | Old (marketing) | New (marketing) |
|------|-----------------|-----------------|
| Starter | $49/mo | **$349/mo** |
| Growth | $99/mo | **$799/mo** |
| Enterprise | Custom | Custom (unchanged) |

---

## Hardcoded prices still present (unchanged on purpose)

- **`src/app/app/billing/page.tsx`** (in-app Billing): Plans show `$29`, `$79`, `$199` with `/mo`. These were **not** modified per instructions (no Stripe/billing logic changes). If in-app billing should reflect the new marketing prices, that requires a separate decision and possible Stripe product/price updates.

---

## Stripe / in-app mismatches noticed

- **Marketing pricing page:** Starter $349/mo, Growth $799/mo, Enterprise Custom.
- **In-app Billing page:** Starter $29/mo, Growth $79/mo, Enterprise $199/mo.

The two surfaces currently show different price sets. Stripe price IDs and checkout/portal logic were not modified. When aligning pricing with Stripe:

1. Create or map Stripe products/prices to $349 and $799 (and keep Enterprise as custom/contact).
2. Update in-app billing page display (and any checkout parameters) to use the same source of truth.

---

## Verification

- [x] No old marketing prices ($49, $99) remain on the pricing page.
- [x] Formatting unchanged: `price` + `period` ("/mo") rendered as before.
- [x] Layout and CTAs unchanged (Start free trial, Contact sales; links to /login, /contact).
- [x] No edits to Stripe IDs, webhooks, or subscription code.

---

## Date

Pricing display updated: marketing pricing page only.
