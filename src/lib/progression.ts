// MelodIQ progression: XP, levels, DJ-rank titles, daily-streak math, and the
// seeded RNG behind the Daily Challenge. Pure and IO-free so it can be shared by
// client (display) and server (authoritative award) and unit-tested in isolation.

/** Each level costs this much more XP than the one before it (triangular curve). */
export const XP_LEVEL_STEP = 500;

/** Daily Challenge is worth more XP than a normal game — it's the habit reward. */
export const DAILY_XP_MULTIPLIER = 1.5;

/**
 * XP earned from a finished game. The server is the source of truth; this is the
 * only place the amount is decided. Base = the game's points, plus a small
 * per-correct bonus and a perfect-game bonus; the Daily Challenge scales it up.
 */
export function xpForGame(opts: {
  score: number;
  correctCount: number;
  totalRounds: number;
  isDaily?: boolean;
}): number {
  const { score, correctCount, totalRounds, isDaily } = opts;
  const perfect = totalRounds > 0 && correctCount === totalRounds;
  let xp = Math.round(Math.max(0, score)) + Math.max(0, correctCount) * 10 + (perfect ? 100 : 0);
  if (isDaily) xp = Math.round(xp * DAILY_XP_MULTIPLIER);
  return Math.max(0, xp);
}

/** Cumulative XP required to sit AT `level` (level 1 = 0 XP). Triangular. */
export function xpForLevel(level: number): number {
  const l = Math.max(1, Math.floor(level));
  return (XP_LEVEL_STEP * (l - 1) * l) / 2;
}

export type LevelInfo = {
  level: number;
  totalXp: number;
  xpIntoLevel: number; // XP earned since reaching the current level
  xpForNextLevel: number; // total XP span of the current level
  xpToNextLevel: number; // remaining XP to the next level
  progressPct: number; // 0..100 through the current level
};

/** Resolve a total XP amount into level + within-level progress. */
export function levelForXp(totalXp: number): LevelInfo {
  const xp = Math.max(0, Math.floor(totalXp));
  let level = 1;
  while (xpForLevel(level + 1) <= xp) level++;
  const base = xpForLevel(level);
  const next = xpForLevel(level + 1);
  const span = next - base;
  const into = xp - base;
  return {
    level,
    totalXp: xp,
    xpIntoLevel: into,
    xpForNextLevel: span,
    xpToNextLevel: Math.max(0, span - into),
    progressPct: span > 0 ? Math.round((into / span) * 100) : 0,
  };
}

/** DJ-rank titles, unlocked by level band. */
const RANKS: { min: number; title: string }[] = [
  { min: 1, title: "Bedroom DJ" },
  { min: 5, title: "Crate Digger" },
  { min: 10, title: "Selector" },
  { min: 20, title: "Resident" },
  { min: 35, title: "Headliner" },
  { min: 55, title: "Legend" },
];

export type RankInfo = { title: string; nextTitle: string | null; levelsToNext: number | null };

export function rankForLevel(level: number): RankInfo {
  const l = Math.max(1, Math.floor(level));
  let idx = 0;
  for (let i = 0; i < RANKS.length; i++) if (l >= RANKS[i].min) idx = i;
  const next = RANKS[idx + 1] ?? null;
  return {
    title: RANKS[idx].title,
    nextTitle: next?.title ?? null,
    levelsToNext: next ? next.min - l : null,
  };
}

// ---------------------------------------------------------------------------
// Daily Challenge date + streak helpers (all UTC, so "today" is the same clip
// set worldwide and streaks don't drift with timezones).
// ---------------------------------------------------------------------------

/** Today's UTC date as an "YYYY-MM-DD" key. */
export function todayUTC(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

/** Shift an "YYYY-MM-DD" key by whole days (UTC). */
export function addDaysUTC(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/**
 * The daily streak AFTER completing `today`'s challenge, given the last day the
 * user played and their streak at that point. Same-day replay is a no-op;
 * consecutive day extends; any gap resets to 1.
 */
export function nextStreak(lastDailyDate: string | null, dailyStreak: number, today: string): number {
  if (lastDailyDate === today) return Math.max(1, dailyStreak); // already counted today
  if (lastDailyDate && addDaysUTC(lastDailyDate, 1) === today) return dailyStreak + 1;
  return 1;
}

/**
 * Whether a stored streak is still "live" today — i.e. the user played today or
 * yesterday. Used to grey out / reset a stale streak in the UI without a write.
 */
export function streakIsAlive(lastDailyDate: string | null, today: string): boolean {
  if (!lastDailyDate) return false;
  return lastDailyDate === today || addDaysUTC(lastDailyDate, 1) === today;
}

// ---------------------------------------------------------------------------
// Deterministic RNG so the Daily Challenge is the identical clip set (and option
// order) for everyone on a given date.
// ---------------------------------------------------------------------------

/** FNV-1a string hash → 32-bit seed. */
export function hashSeed(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** mulberry32 PRNG: tiny, fast, deterministic; returns () => [0,1). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A seeded Fisher–Yates shuffle (does not mutate the input). */
export function seededShuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
