# Update Demo Data (/refresh-demo)

Use when the user wants to regenerate, refresh, or modify demo seed data.

## Structure

- **Seed**: `src/lib/demo/seed.ts` – fixed seed `"leadhandler-demo-2026"`, deterministic helpers (`seededRandom`, `randomName`, `randomPhone`, etc.).
- **Data**: `src/lib/demo/data.ts` – `getDemoBrokerage`, `getDemoAgents`, `getDemoLeads`, `getDemoMessages`, `getDemoInsights`, `getDashboardStats`, `appendMessage`, `addLead`.

## Regenerating

1. **Clear caches** – In `data.ts`, the caches are module-level (`agentsCache`, `leadsCache`, `messagesCache`, `insightsCache`). To regenerate:
   - Set caches to `null` / empty, or
   - Add a `resetDemoCache()` export that clears them (for dev only).

2. **Change seed** – Editing `SEED` in `seed.ts` changes all generated data. Keep it deterministic.

3. **Add entities** – Extend `buildLeads()` (loop count), `buildAgents()` (names array), or `buildMessagesForLead()` to add more records.

4. **Adjust distributions** – Tweak `seededRandom` usage in `randomLeadStatus`, `randomSource`, etc.

## After Changes

- Ensure `getDemoLeads()` returns 60+ leads.
- Ensure message threads exist for ≥12 leads.
- Ensure insights have `urgency` 0–100, `summary`, `nextAction`.
- Run `npm run build` to verify.
