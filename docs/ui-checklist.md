# LeadHandler.ai — UI consistency checklist

This document records what was checked and any remaining items for the design system and UI consistency pass.

---

## 1. Design system (`src/lib/ui.ts`)

- **Done:** App container widths (`CONTAINER`, `CONTAINER_NARROW`, `CONTAINER_WIDE`)
- **Done:** Page header pattern (wrapper, title, subtitle, actions)
- **Done:** Spacing tokens (`SPACE`, `PADDING`)
- **Done:** Typography classes (`TYPO`: h1, h2, h3, body, muted)
- **Done:** Primary accent usage rules (documented in file; use `primary` / `primary-foreground`, no new accent colors)
- **Done:** Section card and metric card class sets
- **Done:** Empty state and responsive list breakpoint

---

## 2. Reusable components (`src/components/app`)

| Component | Status | Notes |
|-----------|--------|--------|
| **PageHeader** | ✅ | Title, subtitle, optional right actions |
| **SectionCard** | ✅ | Standard padding, optional title and header right |
| **MetricCard** | ✅ | KPI card (label, value, optional icon, trend) |
| **StatCard** | ✅ | Wraps MetricCard for backward compatibility |
| **ResponsiveDataList** | ✅ | Table on `md+`, stacked cards below; uses design system breakpoint |
| **EmptyState** | ✅ | Uses design system tokens; `role="status"`, focus rings on action |
| **MarketingHeader** | ✅ | Shared header for marketing pages; semantic colors, focus rings |
| **MarketingFooter** | ✅ | Shared footer with design system typography |

---

## 3. Consistency across pages

### Marketing

- **Home (`(marketing)/page.tsx`):** Uses `MarketingHeader`, `MarketingFooter`, `CONTAINER_WIDE`, `PAGE_PADDING`, `TYPO`; CTAs use `bg-primary` / `text-primary`; feature cards use `border-border`, `bg-card`, `text-primary` for icons
- **Pricing:** Same header/footer; `CONTAINER`, design tokens; primary CTA on recommended plan
- **Security:** Same header/footer; `CONTAINER_NARROW`; section icons use `text-primary`
- **Contact:** Same header/footer; `CONTAINER_NARROW`; form uses shadcn `Button`, `Input`, `Label`, `Textarea`

### Login

- Uses `CONTAINER_NARROW`, `TYPO`, semantic tokens (`primary`, `border`, `muted`, `card`, `destructive`); shadcn `Button` and `Input`; focus rings and accessible error message

### App

- **AppShell:** Main content wrapped in `CONTAINER`, `PAGE_PADDING`, `PAGE_SECTION_GAP`; `overflow-x-hidden` on main; `min-w-0` on flex children to avoid overflow
- **Dashboard:** `PageHeader`, `SectionCard`, `StatCard`, `ResponsiveDataList`; chart uses `--chart-1`; skeleton fallback aligned with design system
- **Leads:** `PageHeader`, `ResponsiveDataList`, `EmptyState`; mobile cards use `border-border`, `bg-card`, focus rings on link

---

## 4. Mobile

- **No horizontal scroll:** Main has `overflow-x-hidden`; content in `CONTAINER`; tables hidden below `md`, cards shown instead
- **Sidebar on mobile:** Navigation in `MobileNav` via Sheet (left); trigger only on `md:hidden`; Sheet content `max-w-[calc(100vw-2rem)]`, `overflow-y-auto`
- **Tables → cards:** `ResponsiveDataList` and existing `DataTable` use `md` breakpoint; mobile renders cards with optional `mobileCard` render prop
- **Marketing header:** Nav uses `flex-wrap` and responsive gap; no horizontal overflow
- **Touch targets:** Buttons and links use adequate padding; focus rings for keyboard

---

## 5. Accessibility

- Focus rings: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` on interactive elements where applied
- Contrast: Semantic tokens (`foreground`, `muted-foreground`, `primary`) used; destructive for errors
- EmptyState: `role="status"`, `aria-label={title}`, icon `aria-hidden`
- Mobile nav: `aria-label="App navigation"` on nav; icon `aria-hidden`
- Login error: `role="alert"` on error message

---

## 6. Dependencies

- No new dependencies added (shadcn, Tailwind, lucide, recharts, sonner only)

---

## 7. Remaining / optional

- **DataTable:** Still used in codebase; new usage should prefer `ResponsiveDataList` for design-system breakpoint and empty message. Migration of any remaining `DataTable` usages is optional.
- **Marketing mobile nav:** Header uses wrapped links; no hamburger menu. If marketing grows, consider a Sheet-based mobile nav for small screens.
- **Dark mode:** All tokens use CSS variables; dark theme in `globals.css` is unchanged and should work with current components.

---

## 8. Build

- **UI changes:** No new errors introduced; all modified and new UI files type-check.
- **Pre-existing:** Build may fail on `src/app/api/auth/session/route.ts` (jose `SignJWT` / `JWTPayload` type). That is outside the design-system scope; fix separately if needed.
- Run `pnpm build` (or `npm run build`) after resolving any existing API/layout type issues to confirm a full production build.
