# Add Shadcn Component

Use when the user asks to add a shadcn/ui component (e.g. `/add-component button`).

## Steps

1. **Check components.json** – shadcn is configured at project root. Style: `new-york`, alias: `@/components/ui`.

2. **Install the component:**
   ```bash
   npx shadcn@latest add <component-name> -y
   ```
   Examples: `button`, `input`, `card`, `dialog`, `select`, `table`, `tabs`, `sheet`, etc.

3. **Use the component** – Import from `@/components/ui/<component>`:
   ```tsx
   import { Button } from "@/components/ui/button";
   ```

4. **Styling** – Use Tailwind classes and shadcn variants. Do not override CSS variables unless necessary. Prefer `cn()` from `@/lib/utils` for conditional classes.

5. **Server vs Client** – If the component uses `useState`/`onClick`/hooks, wrap usage in a client component with `"use client"`. Do not pass React components (e.g. Lucide icons) as props from Server → Client; use `iconName` string union and resolve inside the client component.
