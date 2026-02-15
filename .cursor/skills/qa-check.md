# QA Check (/test-this)

Use when the user asks to test, verify, or QA part of the app.

## Quick Checks

1. **Build**: `npm run build` – must pass with no errors.
2. **Dev**: `npm run dev` – app runs at http://localhost:3000.

## Suggested Vitest Setup (if not present)

```bash
npm install -D vitest @vitejs/plugin-react
```

Create `vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
```

## Edge Cases to Test

- **Demo mode ON**: Dashboard, leads, messages use demo data. No API calls for Airtable/Twilio/Stripe/Make.
- **Demo mode OFF**: Empty states when env vars missing. "Connect in Settings" banner.
- **Auth**: `/app/*` redirects to `/login` without valid `lh_session`. Role-based nav (Owner vs Agent).
- **Server → Client props**: No Lucide icons or React components passed as props from server pages. Use `iconName` string union.
- **API routes**: All return `{ success, data?, error? }`. Zod validation on POST bodies.
- **Mobile**: Tables collapse to cards; sidebar becomes Sheet drawer.
