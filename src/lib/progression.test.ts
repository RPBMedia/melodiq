import { test } from "node:test";
import assert from "node:assert/strict";
import {
  xpForGame,
  xpForLevel,
  levelForXp,
  rankForLevel,
  todayUTC,
  addDaysUTC,
  nextStreak,
  streakIsAlive,
  hashSeed,
  mulberry32,
  seededShuffle,
  XP_LEVEL_STEP,
} from "./progression";

test("xpForGame: score + per-correct + perfect bonus", () => {
  // 8 correct, score 620, not perfect: 620 + 80 = 700
  assert.equal(xpForGame({ score: 620, correctCount: 8, totalRounds: 10 }), 700);
  // perfect 10/10, score 1000: 1000 + 100 + 100 = 1200
  assert.equal(xpForGame({ score: 1000, correctCount: 10, totalRounds: 10 }), 1200);
  // zero game
  assert.equal(xpForGame({ score: 0, correctCount: 0, totalRounds: 10 }), 0);
});

test("xpForGame: daily multiplier applies", () => {
  const normal = xpForGame({ score: 500, correctCount: 6, totalRounds: 10 }); // 560
  const daily = xpForGame({ score: 500, correctCount: 6, totalRounds: 10, isDaily: true });
  assert.equal(normal, 560);
  assert.equal(daily, Math.round(560 * 1.5)); // 840
});

test("xpForLevel: triangular curve", () => {
  assert.equal(xpForLevel(1), 0);
  assert.equal(xpForLevel(2), XP_LEVEL_STEP); // 500
  assert.equal(xpForLevel(3), XP_LEVEL_STEP * 3); // 1500
  assert.equal(xpForLevel(4), XP_LEVEL_STEP * 6); // 3000
});

test("levelForXp: resolves level + within-level progress", () => {
  assert.equal(levelForXp(0).level, 1);
  assert.equal(levelForXp(499).level, 1);
  assert.equal(levelForXp(500).level, 2);
  assert.equal(levelForXp(1499).level, 2);
  assert.equal(levelForXp(1500).level, 3);
  const mid = levelForXp(1000); // level 2 (base 500, next 1500, span 1000, into 500)
  assert.equal(mid.level, 2);
  assert.equal(mid.xpIntoLevel, 500);
  assert.equal(mid.xpForNextLevel, 1000);
  assert.equal(mid.xpToNextLevel, 500);
  assert.equal(mid.progressPct, 50);
});

test("rankForLevel: DJ-rank bands", () => {
  assert.equal(rankForLevel(1).title, "Bedroom DJ");
  assert.equal(rankForLevel(4).title, "Bedroom DJ");
  assert.equal(rankForLevel(5).title, "Crate Digger");
  assert.equal(rankForLevel(10).title, "Selector");
  assert.equal(rankForLevel(20).title, "Resident");
  assert.equal(rankForLevel(35).title, "Headliner");
  assert.equal(rankForLevel(55).title, "Legend");
  assert.equal(rankForLevel(200).title, "Legend");
  assert.equal(rankForLevel(1).nextTitle, "Crate Digger");
  assert.equal(rankForLevel(1).levelsToNext, 4);
  assert.equal(rankForLevel(55).nextTitle, null);
});

test("date helpers: UTC keys + arithmetic", () => {
  assert.equal(todayUTC(new Date("2026-08-21T09:30:00Z")), "2026-08-21");
  assert.equal(addDaysUTC("2026-08-21", 1), "2026-08-22");
  assert.equal(addDaysUTC("2026-08-01", -1), "2026-07-31");
  assert.equal(addDaysUTC("2026-12-31", 1), "2027-01-01");
});

test("nextStreak: extend / reset / same-day", () => {
  assert.equal(nextStreak(null, 0, "2026-08-21"), 1); // first ever
  assert.equal(nextStreak("2026-08-20", 3, "2026-08-21"), 4); // consecutive
  assert.equal(nextStreak("2026-08-21", 3, "2026-08-21"), 3); // same day, no-op
  assert.equal(nextStreak("2026-08-18", 5, "2026-08-21"), 1); // gap → reset
});

test("streakIsAlive: today or yesterday keeps it live", () => {
  assert.equal(streakIsAlive("2026-08-21", "2026-08-21"), true);
  assert.equal(streakIsAlive("2026-08-20", "2026-08-21"), true);
  assert.equal(streakIsAlive("2026-08-19", "2026-08-21"), false);
  assert.equal(streakIsAlive(null, "2026-08-21"), false);
});

test("seeded RNG: deterministic per date, differs across dates", () => {
  const items = Array.from({ length: 50 }, (_, i) => i);
  const a1 = seededShuffle(items, mulberry32(hashSeed("2026-08-21")));
  const a2 = seededShuffle(items, mulberry32(hashSeed("2026-08-21")));
  const b = seededShuffle(items, mulberry32(hashSeed("2026-08-22")));
  assert.deepEqual(a1, a2, "same seed → identical order");
  assert.notDeepEqual(a1, b, "different seed → different order");
  assert.deepEqual([...a1].sort((x, y) => x - y), items, "shuffle preserves membership");
});
