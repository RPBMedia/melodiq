import { test } from "node:test";
import assert from "node:assert/strict";
import { ACHIEVEMENTS, achievementById, evaluateAchievements } from "./achievements";

const ctx = (over = {}) => ({
  score: 0,
  correctCount: 0,
  totalRounds: 10,
  isDaily: false,
  subFiveCount: 0,
  gamesPlayed: 1,
  dailyStreak: 0,
  level: 1,
  ...over,
});

test("catalog is well-formed and unique", () => {
  assert.ok(ACHIEVEMENTS.length >= 8);
  const ids = new Set(ACHIEVEMENTS.map((a) => a.id));
  assert.equal(ids.size, ACHIEVEMENTS.length, "ids unique");
  for (const a of ACHIEVEMENTS) {
    assert.ok(a.name && a.description && a.icon);
    assert.equal(achievementById(a.id)?.id, a.id);
  }
});

test("first game unlocks First Spin", () => {
  const got = evaluateAchievements(ctx(), new Set());
  assert.ok(got.some((a) => a.id === "first_game"));
});

test("perfect game unlocks Perfect Ear (and Daily Dominator when daily)", () => {
  const normal = evaluateAchievements(ctx({ correctCount: 10, totalRounds: 10 }), new Set());
  assert.ok(normal.some((a) => a.id === "perfect_game"));
  assert.ok(!normal.some((a) => a.id === "daily_perfect"));
  const daily = evaluateAchievements(ctx({ correctCount: 10, totalRounds: 10, isDaily: true }), new Set());
  assert.ok(daily.some((a) => a.id === "daily_perfect"));
});

test("speed + score + streak + level thresholds", () => {
  assert.ok(evaluateAchievements(ctx({ subFiveCount: 1 }), new Set()).some((a) => a.id === "speed_5s"));
  assert.ok(evaluateAchievements(ctx({ subFiveCount: 5 }), new Set()).some((a) => a.id === "triple_speed"));
  assert.ok(evaluateAchievements(ctx({ score: 850 }), new Set()).some((a) => a.id === "high_score"));
  assert.ok(evaluateAchievements(ctx({ dailyStreak: 7 }), new Set()).some((a) => a.id === "streak_7"));
  assert.ok(evaluateAchievements(ctx({ level: 5 }), new Set()).some((a) => a.id === "level_5"));
  assert.ok(evaluateAchievements(ctx({ gamesPlayed: 50 }), new Set()).some((a) => a.id === "games_50"));
});

test("already-unlocked achievements are not re-emitted", () => {
  const already = new Set(["first_game"]);
  const got = evaluateAchievements(ctx(), already);
  assert.ok(!got.some((a) => a.id === "first_game"));
});
