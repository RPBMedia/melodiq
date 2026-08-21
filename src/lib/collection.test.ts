import { test } from "node:test";
import assert from "node:assert/strict";
import { buildCollection, formatTime, type SongMeta, type GenreTotal } from "./collection";

const songs: SongMeta[] = [
  { id: "a", title: "Bark", artist: "X", genre: "Black Metal", year: 1999, coverColor: "#111" },
  { id: "b", title: "Aria", artist: "Y", genre: "Black Metal", year: 2001, coverColor: "#222" },
  { id: "c", title: "Cyan", artist: "Z", genre: "Synthpop", year: 1985, coverColor: "#333" },
];
const genreTotals: GenreTotal[] = [
  { genre: "Black Metal", total: 50 },
  { genre: "Synthpop", total: 60 },
];

test("formatTime drops the decimal for whole seconds only", () => {
  assert.equal(formatTime(2431), "2.4s");
  assert.equal(formatTime(3000), "3s");
  assert.equal(formatTime(500), "0.5s");
});

test("buildCollection groups by genre with completion % and totals", () => {
  const view = buildCollection(
    [
      { songId: "a", bestTimeMs: 2431, timesCorrect: 3 },
      { songId: "c", bestTimeMs: 900, timesCorrect: 1 },
    ],
    songs,
    genreTotals,
  );
  assert.equal(view.totalCollected, 2);
  assert.equal(view.totalSongs, 110);
  assert.equal(view.pct, 2); // 2/110 ≈ 1.8 → 2

  // Synthpop (1/60 ≈ 2%) sorts before Black Metal (1/50 = 2%)? both round to 2 →
  // tie broken by name, so Black Metal first.
  const bm = view.genres.find((g) => g.genre === "Black Metal")!;
  assert.equal(bm.collected, 1);
  assert.equal(bm.total, 50);
  assert.equal(bm.pct, 2);
  assert.equal(bm.cards[0].bestTimeLabel, "2.4s");
  assert.equal(bm.cards[0].timesCorrect, 3);
});

test("cards within a genre are fastest-first", () => {
  const view = buildCollection(
    [
      { songId: "b", bestTimeMs: 4000, timesCorrect: 1 },
      { songId: "a", bestTimeMs: 1200, timesCorrect: 1 },
    ],
    songs,
    genreTotals,
  );
  const bm = view.genres.find((g) => g.genre === "Black Metal")!;
  assert.deepEqual(bm.cards.map((c) => c.id), ["a", "b"]);
});

test("unknown song ids are skipped", () => {
  const view = buildCollection([{ songId: "ghost", bestTimeMs: 1000, timesCorrect: 1 }], songs, genreTotals);
  assert.equal(view.totalCollected, 0);
  assert.equal(view.genres.length, 0);
});

test("empty collection yields 0% and no genres", () => {
  const view = buildCollection([], songs, genreTotals);
  assert.equal(view.totalCollected, 0);
  assert.equal(view.pct, 0);
  assert.deepEqual(view.genres, []);
});
