# Demo Mode

Demo mode makes the app feel real without external APIs. Follow this logic everywhere.

## When Demo Is On
- **Always** use in-memory demo data from `@/lib/demo/data`.
- No network calls to Airtable/Twilio/Stripe/Make.
- Fast, deterministic, seeded with `"leadhandler-demo-2026"`.
- Show floating "Demo Mode" badge (Owner only). Toggle in topbar.

## When Demo Is Off
- Call API routes; routes fetch from real integrations if env vars are set.
- If env vars missing → return empty arrays / stub responses.
- Pages show empty state + "Connect in Settings" banner.

## Demo Data Sources
- `getDemoBrokerage()` – 1 Houston-based brokerage
- `getDemoAgents()` – 8 agents with metrics
- `getDemoLeads()` – 60+ leads across statuses
- `getDemoMessages(leadId?)` – message threads for ≥12 leads
- `getDemoInsights(leadId)` – summary, next action, urgency
- `getDashboardStats(role)` – KPIs by role
- `appendMessage(leadId, body, direction)`, `addLead(lead)` – mutating helpers

## Demo Toggle
- Cookie `lh_demo`: `"true"` | `"false"`
- Default from `DEMO_MODE_DEFAULT` env var (typically `true`)
- GET/POST `/api/demo/state` – read/set toggle (cookie-aware)
- Only Owner can toggle; Agent sees badge but no switch.
