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

const SOURCES = ["website", "zillow", "referral", "open-house", "facebook", "google"];

const AGENT_NAMES = [
  "Marcus Johnson",
  "Sandra Williams",
  "David Chen",
  "Amanda Rodriguez",
  "Kevin Martinez",
  "Rachel Thompson",
  "James Wilson",
  "Michelle Brown",
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
  const area = 200 + Math.floor(seededRandom(seedKey + "a") * 800);
  const mid = Math.floor(seededRandom(seedKey + "b") * 1000);
  const last = Math.floor(seededRandom(seedKey + "c") * 10000);
  return `+1${area}${String(mid).padStart(3, "0")}${String(last).padStart(4, "0")}`;
}

export function randomLeadStatus(seedKey: string): (typeof LEAD_STATUSES)[number] {
  return pick(LEAD_STATUSES, seedKey);
}

export function randomSource(seedKey: string): string {
  return pick(SOURCES, seedKey);
}

export function getAgentNames(): string[] {
  return [...AGENT_NAMES];
}
