/**
 * LeadHandler.ai design system
 * Use these constants and class names for consistent UI across marketing and app.
 * No new dependencies — Tailwind + shadcn tokens only.
 */

// ---- Container widths ----
/** Max width for app content (pages, forms). Use with mx-auto and w-full. */
export const CONTAINER = "w-full max-w-6xl mx-auto";

/** Tighter max width for reading (marketing copy, narrow forms). */
export const CONTAINER_NARROW = "w-full max-w-2xl mx-auto";

/** Widest layout (e.g. marketing hero). */
export const CONTAINER_WIDE = "w-full max-w-7xl mx-auto";

// ---- Page layout ----
/** Standard horizontal padding for app page content. */
export const PAGE_PADDING = "px-4 sm:px-6 lg:px-8";

/** Vertical spacing between page sections. */
export const PAGE_SECTION_GAP = "space-y-6 sm:space-y-8";

// ---- Page header pattern ----
/** Wrapper for page title + subtitle + optional actions. */
export const PAGE_HEADER =
  "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4";

/** Main page title (h1). */
export const PAGE_TITLE = "text-2xl font-semibold tracking-tight text-foreground sm:text-3xl";

/** Page subtitle (muted, below title). */
export const PAGE_SUBTITLE = "text-sm text-muted-foreground sm:text-base";

/** Right-side actions in page header (buttons, etc.). */
export const PAGE_HEADER_ACTIONS = "flex flex-wrap items-center gap-2 shrink-0";

// ---- Spacing tokens (Tailwind classes) ----
export const SPACE = {
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
} as const;

export const PADDING = {
  card: "p-4 sm:p-6",
  cardHeader: "px-4 sm:px-6 pt-4 sm:pt-6",
  cardContent: "px-4 sm:px-6 pb-4 sm:pb-6",
  section: "p-4 sm:p-6 lg:p-8",
} as const;

// ---- Typography ----
export const TYPO = {
  h1: "text-2xl font-semibold tracking-tight text-foreground sm:text-3xl",
  h2: "text-xl font-semibold tracking-tight text-foreground sm:text-2xl",
  h3: "text-lg font-semibold text-foreground",
  body: "text-sm sm:text-base text-foreground",
  bodySmall: "text-sm text-foreground",
  muted: "text-sm text-muted-foreground",
  mutedSmall: "text-xs text-muted-foreground",
} as const;

// ---- Primary accent usage ----
/**
 * Use semantic tokens for CTAs and emphasis:
 * - Primary actions: bg-primary text-primary-foreground (buttons, nav active state).
 * - Links / secondary emphasis: text-primary hover:underline or button variant "link".
 * - Do not introduce new accent colors; use primary for brand consistency.
 */

// ---- Section card ----
/** Outer section card (border, rounded, standard padding). */
export const SECTION_CARD = "rounded-xl border bg-card text-card-foreground shadow-sm";

/** Section card header (title + optional action). */
export const SECTION_CARD_HEADER =
  "flex flex-row flex-wrap items-center justify-between gap-2 border-b px-4 py-3 sm:px-6 sm:py-4";

/** Section card body. */
export const SECTION_CARD_BODY = "p-4 sm:p-6";

// ---- Metric / KPI card ----
/** Metric card (value + label + optional trend). */
export const METRIC_CARD =
  "rounded-xl border bg-card text-card-foreground p-4 sm:p-5 shadow-sm";

export const METRIC_LABEL = "text-sm font-medium text-muted-foreground";
export const METRIC_VALUE = "text-2xl font-bold text-foreground mt-1";
export const METRIC_TREND_POSITIVE = "text-xs text-emerald-600 dark:text-emerald-400 mt-1";
export const METRIC_TREND_NEGATIVE = "text-xs text-red-600 dark:text-red-400 mt-1";

// ---- Empty state ----
export const EMPTY_STATE =
  "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 p-8 sm:p-12 text-center";
export const EMPTY_STATE_ICON = "size-12 text-muted-foreground/60 mb-4";
export const EMPTY_STATE_TITLE = "text-lg font-medium text-foreground";
export const EMPTY_STATE_DESCRIPTION = "mt-2 text-sm text-muted-foreground max-w-sm";

// ---- Responsive list (table → cards) ----
/** Breakpoint at which tables become stacked cards. */
export const RESPONSIVE_LIST_BREAKPOINT = "md";
