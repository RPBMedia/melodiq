// MelodIQ achievements (M3). The catalog is code-defined and version-controlled;
// only which ones a user has UNLOCKED is persisted (UserAchievement). The rules
// engine is pure so it can be unit-tested and evaluated server-side on finish.

export type AchievementDef = {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji
};

/** Everything the rules can look at when a game finishes. */
export type AchievementContext = {
  score: number;
  correctCount: number;
  totalRounds: number;
  isDaily: boolean;
  subFiveCount: number; // correct rounds answered in under 5 seconds
  gamesPlayed: number; // total finished games, INCLUDING the one just finished
  dailyStreak: number;
  level: number;
};

type Rule = AchievementDef & { check: (c: AchievementContext) => boolean };

const RULES: Rule[] = [
  { id: "first_game", name: "First Spin", icon: "🎧", description: "Finish your first game.", check: (c) => c.gamesPlayed >= 1 },
  { id: "perfect_game", name: "Perfect Ear", icon: "💯", description: "Get every track right in a single game.", check: (c) => c.totalRounds > 0 && c.correctCount === c.totalRounds },
  { id: "speed_5s", name: "Quick Draw", icon: "⚡", description: "Name a track in under 5 seconds.", check: (c) => c.subFiveCount >= 1 },
  { id: "triple_speed", name: "Trigger Finger", icon: "🔥", description: "Land 5 sub-5-second IDs in one game.", check: (c) => c.subFiveCount >= 5 },
  { id: "high_score", name: "Chart Topper", icon: "📈", description: "Score 800 or more in a game.", check: (c) => c.score >= 800 },
  { id: "daily_perfect", name: "Daily Dominator", icon: "🏆", description: "Ace a Daily Challenge with a perfect score.", check: (c) => c.isDaily && c.totalRounds > 0 && c.correctCount === c.totalRounds },
  { id: "streak_7", name: "Week Warrior", icon: "📅", description: "Keep a 7-day Daily Challenge streak.", check: (c) => c.dailyStreak >= 7 },
  { id: "games_10", name: "Regular", icon: "🎶", description: "Play 10 games.", check: (c) => c.gamesPlayed >= 10 },
  { id: "games_50", name: "Vinyl Veteran", icon: "💿", description: "Play 50 games.", check: (c) => c.gamesPlayed >= 50 },
  { id: "level_5", name: "Crate Digger", icon: "🧑‍🎤", description: "Reach level 5.", check: (c) => c.level >= 5 },
];

/** Public catalog (no check functions). */
export const ACHIEVEMENTS: AchievementDef[] = RULES.map(({ check: _check, ...def }) => def);

export function achievementById(id: string): AchievementDef | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}

/**
 * Achievements newly unlocked by this game — those whose rule now passes and
 * that the user hasn't already earned. Pure: no IO.
 */
export function evaluateAchievements(
  ctx: AchievementContext,
  alreadyUnlocked: Set<string>,
): AchievementDef[] {
  const out: AchievementDef[] = [];
  for (const r of RULES) {
    if (alreadyUnlocked.has(r.id)) continue;
    if (r.check(ctx)) {
      const { check: _check, ...def } = r;
      out.push(def);
    }
  }
  return out;
}
