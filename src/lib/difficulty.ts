/** Difficulty tiers for the guessing pool (PRD M2).
 *
 * Every Song carries a `difficulty` (1–3). Tiers let content curation label how
 * recognisable a clip is, and let modes/journeys later scale the challenge.
 * This is the typed source of truth for tier labels and colours.
 */

export type DifficultyTier = 1 | 2 | 3;

export interface DifficultyMeta {
  tier: DifficultyTier;
  label: string;
  emoji: string;
  /** Neon-palette accent. */
  accent: string;
  hint: string;
}

export const DIFFICULTY_TIERS: DifficultyMeta[] = [
  { tier: 1, label: "Easy", emoji: "🟢", accent: "#34D399", hint: "Big, familiar hits" },
  { tier: 2, label: "Medium", emoji: "🟡", accent: "#FBBF24", hint: "Well-known tracks" },
  { tier: 3, label: "Hard", emoji: "🔴", accent: "#FB7185", hint: "Deep cuts & obscurities" },
];

export const DIFFICULTY_TIER_VALUES: DifficultyTier[] = [1, 2, 3];

/** Resolve a stored difficulty int to its tier metadata (defaults to Medium). */
export function difficultyMeta(tier: number): DifficultyMeta {
  return DIFFICULTY_TIERS.find((d) => d.tier === tier) ?? DIFFICULTY_TIERS[1];
}

/** Clamp any number to a valid tier (1–3). */
export function clampTier(n: number): DifficultyTier {
  if (n <= 1) return 1;
  if (n >= 3) return 3;
  return 2;
}
