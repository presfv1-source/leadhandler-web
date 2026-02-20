const SEED = "leadhandler-demo-2026";

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    h = (h << 5) - h + c;
    h = h & h;
  }
  return Math.abs(h);
}

export function seededRandom(seedKey: string): number {
  const h = hash(SEED + seedKey);
  return (h % 10000) / 10000;
}

const FIRST_NAMES = [
  "James",
  "Maria",
  "Robert",
  "Jennifer",
  "Michael",
  "Linda",
  "David",
  "Patricia",
  "Christopher",
  "Sarah",
  "Daniel",
  "Jessica",
  "Matthew",
  "Ashley",
  "Joseph",
  "Emily",
  "Charles",
  "Amanda",
  "William",
  "Elizabeth",
];

const LAST_NAMES = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Wilson",
  "Anderson",
  "Taylor",
  "Thomas",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Perez",
  "Thompson",
];

const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "appointment",
  "closed",
  "lost",
] as const;

/** Houston-area lead sources (channels). Only real sources. */
const SOURCES = [
  "Zillow",
  "Realtor.com",
  "HAR.com",
  "Referral",
  "Website",
  "Open House",
] as const;

/** Houston neighborhoods/areas for property interest (used in messages/context). */
export const HOUSTON_NEIGHBORHOODS = [
  "The Heights",
  "Montrose",
  "Memorial",
  "Sugar Land",
  "The Woodlands",
  "Katy",
  "Galleria area",
  "Midtown",
  "River Oaks",
  "Rice Village",
] as const;

/** Texas area codes (Houston region). */
const TEXAS_AREA_CODES = [713, 281, 832, 346];

/** Realistic Texas / Houston-area agent names (4–6 used in demo). */
const AGENT_NAMES = [
  "Marcus Webb",
  "Diana Salinas",
  "Kyle Patterson",
  "Sarah Mitchell",
  "Ashley Chen",
  "Tyler Brooks",
];

export function pick<T>(arr: readonly T[], seedKey: string): T {
  const idx = Math.floor(seededRandom(seedKey) * arr.length);
  return arr[idx];
}

export function pickN<T>(arr: readonly T[], n: number, seedKey: string): T[] {
  const shuffled = [...arr].sort(() => seededRandom(seedKey + n) - 0.5);
  return shuffled.slice(0, n);
}

export function randomName(seedKey: string): string {
  const first = pick(FIRST_NAMES, seedKey + "-first");
  const last = pick(LAST_NAMES, seedKey + "-last");
  return `${first} ${last}`;
}

export function randomEmail(name: string, seedKey: string): string {
  const base = name.toLowerCase().replace(/\s/g, ".");
  const domains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"];
  const domain = pick(domains, seedKey);
  return `${base}@${domain}`;
}

export function randomPhone(seedKey: string): string {
  const area = pick(TEXAS_AREA_CODES, seedKey + "area");
  const mid = Math.floor(seededRandom(seedKey + "b") * 1000);
  const last = Math.floor(seededRandom(seedKey + "c") * 10000);
  return `+1${area}${String(mid).padStart(3, "0")}${String(last).padStart(4, "0")}`;
}

export function randomLeadStatus(seedKey: string): (typeof LEAD_STATUSES)[number] {
  return pick(LEAD_STATUSES, seedKey);
}

export function randomSource(seedKey: string): string {
  return pick([...SOURCES], seedKey);
}

export function randomHoustonNeighborhood(seedKey: string): string {
  return pick([...HOUSTON_NEIGHBORHOODS], seedKey);
}

export function getAgentNames(): string[] {
  return [...AGENT_NAMES];
}

/**
 * Returns a date string (YYYY-MM-DD) in the last N days, with weighted chance for "today".
 * seedKey makes it deterministic. About 15% today, rest spread over last 30 days.
 */
export function randomRecentDate(seedKey: string, options?: { daysBack?: number; todayWeight?: number }): string {
  const daysBack = options?.daysBack ?? 30;
  const todayWeight = options?.todayWeight ?? 0.15;
  const r = seededRandom(seedKey);
  const isToday = r < todayWeight;
  if (isToday) {
    return new Date().toISOString().slice(0, 10);
  }
  const dayOffset = Math.floor(seededRandom(seedKey + "d") * daysBack);
  const d = new Date();
  d.setDate(d.getDate() - dayOffset);
  return d.toISOString().slice(0, 10);
}

/** Returns a time string HH:MM for demo (business hours bias). */
export function randomTimeOfDay(seedKey: string): string {
  const hour = 8 + Math.floor(seededRandom(seedKey + "h") * 10);
  const min = Math.floor(seededRandom(seedKey + "m") * 60);
  return `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}
