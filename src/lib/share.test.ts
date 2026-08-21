import { test } from "node:test";
import assert from "node:assert/strict";
import { buildShareText, buildShareHeadline, baseUrl, shareUrl } from "./share";

test("buildShareText names the genre for a normal game", () => {
  const t = buildShareText({ score: 850, correctCount: 8, totalRounds: 10, genre: "Synthpop", isDaily: false });
  assert.match(t, /scored 850 on MelodIQ/);
  assert.match(t, /8\/10 correct \(Synthpop\)/);
  assert.match(t, /Can you beat me\?$/);
});

test("buildShareText uses the Daily wording and hides genre", () => {
  const t = buildShareText({ score: 1200, correctCount: 9, totalRounds: 10, genre: "Synthpop", isDaily: true });
  assert.match(t, /the MelodIQ Daily/);
  assert.doesNotMatch(t, /Synthpop/);
});

test("buildShareText omits genre when all-genres (null)", () => {
  const t = buildShareText({ score: 500, correctCount: 5, totalRounds: 10, genre: null, isDaily: false });
  assert.doesNotMatch(t, /\(/);
});

test("buildShareHeadline reflects daily vs normal", () => {
  assert.equal(buildShareHeadline({ score: 0, correctCount: 0, totalRounds: 10, genre: null, isDaily: true }), "MelodIQ Daily");
  assert.equal(buildShareHeadline({ score: 0, correctCount: 0, totalRounds: 10, genre: null, isDaily: false }), "MelodIQ");
});

test("baseUrl prefers explicit env and strips trailing slashes", () => {
  const prev = process.env.NEXT_PUBLIC_SITE_URL;
  process.env.NEXT_PUBLIC_SITE_URL = "https://melodiq.app///";
  assert.equal(baseUrl(), "https://melodiq.app");
  assert.equal(shareUrl("abc123"), "https://melodiq.app/s/abc123");
  if (prev === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
  else process.env.NEXT_PUBLIC_SITE_URL = prev;
});
