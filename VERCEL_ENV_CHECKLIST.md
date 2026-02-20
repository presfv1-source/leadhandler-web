# Vercel Environment Variables Checklist

Use this checklist when deploying to Vercel. Add every variable in your project’s **Settings → Environment Variables**. This is the only manual step after code is deployed.

---

## Required (app won’t start without these)

- **NEXT_PUBLIC_APP_URL** — Your Vercel deployment URL (e.g. `https://leadhandler.vercel.app`)
- **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY** — From [clerk.com](https://clerk.com) dashboard
- **CLERK_SECRET_KEY** — From Clerk dashboard
- **SESSION_SECRET** — Generate with: `openssl rand -base64 32`

---

## Clerk Setup

In the Clerk dashboard, set **Redirect URLs** to include:

- `[your Vercel URL]/app/dashboard`
- `[your Vercel URL]/login/sso-callback`

---

## Airtable

- **AIRTABLE_API_KEY** — From [airtable.com/account](https://airtable.com/account) → Personal access tokens
- **AIRTABLE_BASE_ID** — From your base URL: `airtable.com/[BASE_ID]/...`

---

## Stripe

- **STRIPE_SECRET_KEY** — From [stripe.com/dashboard](https://stripe.com/dashboard) → Developers → API keys
- **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY** — Same location
- **STRIPE_WEBHOOK_SECRET** — From Stripe dashboard → Webhooks → add endpoint: `[your URL]/api/webhooks/stripe`
- **STRIPE_PRICE_ID_ESSENTIALS** — From Stripe Products → Essentials → Price ID
- **STRIPE_PRICE_ID_PRO** — From Stripe Products → Pro → Price ID

---

## Twilio

- **TWILIO_ACCOUNT_SID** — From [twilio.com/console](https://twilio.com/console)
- **TWILIO_AUTH_TOKEN** — From Twilio console
- **TWILIO_FROM_NUMBER** — Your purchased Twilio number (format: `+12815551234`)

In Twilio: set the webhook for your number to: `[your URL]/api/webhooks/twilio` (HTTP POST)

---

## Make.com

- **MAKE_WEBHOOK_URL** — From your Make scenario → Webhooks module → copy URL

---

## Optional

- **DEMO_MODE_DEFAULT=false** — Set to `false` in production
- **DEV_ADMIN_EMAIL** — Your email; gives owner role on first login (optional)
