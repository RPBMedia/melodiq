import { test } from "node:test";
import assert from "node:assert/strict";
import {
  HINT_LADDER,
  MAX_HINTS,
  availableHintLevels,
  hintsCost,
  decadeOf,
  initialsOf,
  hintContent,
  pickOptionToRemove,
} from "./hints";

test("ladder is 5 ordered steps ending in removeOption", () => {
  assert.equal(MAX_HINTS, 5);
  assert.deepEqual(HINT_LADDER.map((h) => h.level), [1, 2, 3, 4, 5]);
  assert.equal(HINT_LADDER[4].kind, "removeOption");
});

test("availableHintLevels by mode", () => {
  assert.equal(availableHintLevels("multiple"), 5);
  assert.equal(availableHintLevels("typing"), 4);
  assert.equal(availableHintLevels("survival"), 0);
  assert.equal(availableHintLevels("speed"), 0);
  assert.equal(availableHintLevels("year"), 0);
});

test("hintsCost accumulates in order", () => {
  assert.equal(hintsCost(0), 0);
  assert.equal(hintsCost(1), 15);
  assert.equal(hintsCost(2), 30);
  assert.equal(hintsCost(5), 95);
});

test("decadeOf / initialsOf", () => {
  assert.equal(decadeOf(1994), "1990s");
  assert.equal(decadeOf(2001), "2000s");
  assert.equal(decadeOf(null), "Unknown");
  assert.equal(initialsOf("Dream Theater"), "D.T.");
  assert.equal(initialsOf("Tool"), "T.");
});

test("hintContent reveals the right slice", () => {
  const song = { genre: "progressive metal", year: 1992, artist: "Dream Theater", title: "Pull Me Under" };
  assert.equal(hintContent("decade", song), "1990s");
  assert.equal(hintContent("initials", song), "D.T.");
  assert.equal(hintContent("firstLetter", song), "P…");
  // genre resolves through the taxonomy to its label
  assert.equal(hintContent("genre", song), "Progressive Metal");
});

test("pickOptionToRemove avoids the answer and already-removed", () => {
  const opts = ["A", "B", "C", "D"];
  const first = pickOptionToRemove(opts, "C");
  assert.ok(first && first !== "C");
  const second = pickOptionToRemove(opts, "C", [first!]);
  assert.ok(second && second !== "C" && second !== first);
  // only the answer left -> nothing to remove
  assert.equal(pickOptionToRemove(["C"], "C"), null);
});
