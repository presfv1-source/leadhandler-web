# API Safety

All route handlers must follow these rules.

## Response Shape
```ts
{ success: boolean; data?: T; error?: { code: string; message: string } }
```

## Request Validation
- Use **Zod** `.safeParse()` on all POST/PUT bodies.
- Return `400` with `{ success: false, error: { code: "VALIDATION_ERROR", message } }` on parse failure.
- Never trust raw `request.json()` without validation.

## Environment Checks
- Use `hasAirtable`, `hasStripe`, `hasTwilio`, `hasMake` from `@/lib/config`.
- Never expose secrets. Only `NEXT_PUBLIC_*` vars are client-safe.
- `getEnvSummary()` returns client-safe integration flags.

## Stubs When Keys Missing
- Airtable routes: return demo data or `[]` if `!hasAirtable`.
- Twilio: return `{ queued: true, provider: "stub" }` if `!hasTwilio`.
- Stripe: return stub URLs (e.g. `https://example.com/checkout-stub`).
- Make: return stub success if `!hasMake`.
- Webhooks: log payload, always return `200`.

## Status Codes
- `200` – success
- `400` – validation error
- `401` – unauthorized (no session)
- `404` – not found
- `500` – server error (log, return generic message)
