import { test } from "node:test";
import assert from "node:assert/strict";
import {
  pointsForElapsed,
  pointsForElapsedSpeed,
  roundSecondsForMode,
  scoreAnswerFor,
  ROUND_SECONDS,
  SPEED_ROUND_SECONDS,
} from "./scoring";

test("classic curve steps down over 30s", () => {
  assert.equal(pointsForElapsed(0), 100);
  assert.equal(pointsForElapsed(5), 100);
  assert.equal(pointsForElapsed(6), 80);
  assert.equal(pointsForElapsed(20), 50);
  assert.equal(pointsForElapsed(30), 25);
  assert.equal(pointsForElapsed(31), 0);
});

test("speed curve rewards the first seconds and is harsher after", () => {
  assert.equal(pointsForElapsedSpeed(1), 100);
  assert.equal(pointsForElapsedSpeed(1.5), 100);
  assert.equal(pointsForElapsedSpeed(2.9), 75);
  assert.equal(pointsForElapsedSpeed(5), 45);
  assert.equal(pointsForElapsedSpeed(12), 20);
  assert.equal(pointsForElapsedSpeed(12.1), 0);
});

test("roundSecondsForMode: only speed shortens the window", () => {
  assert.equal(roundSecondsForMode("speed"), SPEED_ROUND_SECONDS);
  assert.equal(roundSecondsForMode("survival"), ROUND_SECONDS);
  assert.equal(roundSecondsForMode("multiple"), ROUND_SECONDS);
  assert.equal(roundSecondsForMode("typing"), ROUND_SECONDS);
});

test("scoreAnswerFor dispatches the right curve and zeroes wrong answers", () => {
  // 2s in: classic still 100, speed already down to 75
  assert.equal(scoreAnswerFor("multiple", true, 2000), 100);
  assert.equal(scoreAnswerFor("speed", true, 2000), 75);
  assert.equal(scoreAnswerFor("survival", true, 2000), 100);
  // wrong is always 0 regardless of mode/time
  assert.equal(scoreAnswerFor("speed", false, 500), 0);
  assert.equal(scoreAnswerFor("multiple", false, 500), 0);
});
