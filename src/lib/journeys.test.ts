import { test } from "node:test";
import assert from "node:assert/strict";
import {
  JOURNEYS,
  starsForCorrect,
  stageById,
  journeyById,
  stageUnlocked,
  journeyProgress,
  type StarsMap,
} from "./journeys";

test("catalog is well-formed: unique stage ids, known-shaped stages", () => {
  const ids = new Set<string>();
  for (const j of JOURNEYS) {
    assert.ok(j.stages.length >= 3, `${j.id} should have several stages`);
    for (const s of j.stages) {
      assert.ok(!ids.has(s.id), `duplicate stage id ${s.id}`);
      ids.add(s.id);
      assert.ok(s.genre.length > 0);
    }
  }
});

test("starsForCorrect thresholds (out of 10)", () => {
  assert.equal(starsForCorrect(4, 10), 0);
  assert.equal(starsForCorrect(5, 10), 1);
  assert.equal(starsForCorrect(6, 10), 1);
  assert.equal(starsForCorrect(7, 10), 2);
  assert.equal(starsForCorrect(8, 10), 2);
  assert.equal(starsForCorrect(9, 10), 3);
  assert.equal(starsForCorrect(10, 10), 3);
  assert.equal(starsForCorrect(0, 0), 0);
});

test("stageById resolves journey + index", () => {
  const found = stageById("metal-3");
  assert.ok(found);
  assert.equal(found!.journey.id, "rise-of-metal");
  assert.equal(found!.index, 2);
  assert.equal(stageById("nope"), undefined);
});

test("unlock gating: first open, next needs a star on the previous", () => {
  const j = journeyById("rise-of-metal")!;
  const none: StarsMap = {};
  assert.equal(stageUnlocked(j, 0, none), true);
  assert.equal(stageUnlocked(j, 1, none), false);
  const one: StarsMap = { "metal-1": 1 };
  assert.equal(stageUnlocked(j, 1, one), true);
  assert.equal(stageUnlocked(j, 2, one), false);
});

test("journeyProgress totals, next stage, and completion", () => {
  const j = journeyById("rise-of-metal")!;
  // cleared stage 1 with 2 stars, unlocked stage 2 (0 stars) -> next is stage 2
  const p = journeyProgress(j, { "metal-1": 2 });
  assert.equal(p.stagesCleared, 1);
  assert.equal(p.totalStars, 2);
  assert.equal(p.maxStars, 15);
  assert.equal(p.nextStageId, "metal-2");
  assert.equal(p.complete, false);

  // stage 1 mastered (3*) -> next skips to the unlocked stage 2
  const p2 = journeyProgress(j, { "metal-1": 3 });
  assert.equal(p2.nextStageId, "metal-2");

  const full: StarsMap = { "metal-1": 3, "metal-2": 3, "metal-3": 3, "metal-4": 3, "metal-5": 3 };
  const p3 = journeyProgress(j, full);
  assert.equal(p3.complete, true);
  assert.equal(p3.totalStars, 15);
  assert.equal(p3.nextStageId, null);
});
