# Core Style (LeadHandler.ai)

Always apply these rules unless explicitly overridden.

## UI & Styling
- Use **Tailwind + shadcn/ui** exclusively. No custom CSS frameworks.
- Spacing: 8–12px scale (gap-2, gap-3, gap-4, p-4, p-6).
- Typography: Sharp, readable. Use `TYPO` and layout tokens from `@/lib/ui`.
- Accents: indigo/violet/teal. Primary for CTAs; muted for secondary elements.
- Mobile-first: responsive tables → cards on small screens. Use shadcn Sheet for mobile nav.
- Empty states: Use `EmptyState` with icon, title, description, CTA. Never bare "No data" text.
- Skeletons: Use `<Skeleton>` for loading states. Wrap async content in `<Suspense>`.

## TypeScript
- Strict mode. No `any`. Prefer exhaustive checks.
- Use `@/lib/types` for shared types (Lead, Agent, Brokerage, Message, Insight, LeadStatus, Role).

## React & Next.js
- Server Components by default. Add `"use client"` only when needed (hooks, interactivity, browser APIs).
- Never pass React components (e.g. Lucide icons) as props from Server → Client. Use `iconName` string union and resolve inside the client component.
- Use `next/navigation` for redirects and `notFound()`.
- Use `sonner` for all toasts.

## File & Import Conventions
- `@/` alias for `src/`. Prefer absolute imports.
- Components: `src/components/ui/` (shadcn), `src/components/app/` (app-specific).
- Lib: `src/lib/` for config, types, utils, env, demo, integrations.
