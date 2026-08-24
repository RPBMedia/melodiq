import { test } from "node:test";
import assert from "node:assert/strict";
import { rankMatch, generateMatchSeed, clampMaxPlayers, type MatchPlayerView } from "./versus";

const p = (over: Partial<MatchPlayerView> & { userId: string }): MatchPlayerView => ({
  name: over.userId,
  image: null,
  score: 0,
  correctCount: 0,
  finished: true,
  isCreator: false,
  ...over,
});

test("clampMaxPlayers keeps size within 2..5", () => {
  assert.equal(clampMaxPlayers(1), 2);
  assert.equal(clampMaxPlayers(2), 2);
  assert.equal(clampMaxPlayers(5), 5);
  assert.equal(clampMaxPlayers(9), 5);
  assert.equal(clampMaxPlayers(3.4), 3);
  assert.equal(clampMaxPlayers(NaN), 2);
});

test("generateMatchSeed is unique and url-safe", () => {
  const a = generateMatchSeed();
  const b = generateMatchSeed();
  assert.notEqual(a, b);
  assert.match(a, /^m_[A-Za-z0-9_-]+$/);
});

test("ranks finished players by score, flags the winner", () => {
  const r = rankMatch([
    p({ userId: "a", score: 600, correctCount: 6 }),
    p({ userId: "b", score: 850, correctCount: 8, isCreator: true }),
  ]);
  assert.equal(r.players[0].userId, "b");
  assert.equal(r.players[0].rank, 1);
  assert.equal(r.players[0].isWinner, true);
  assert.equal(r.players[1].isWinner, false);
  assert.equal(r.complete, true);
  assert.deepEqual(r.winners, ["b"]);
});

test("a tie makes both winners", () => {
  const r = rankMatch([
    p({ userId: "a", score: 700, correctCount: 7 }),
    p({ userId: "b", score: 700, correctCount: 7 }),
  ]);
  assert.equal(r.winners.length, 2);
  assert.equal(r.players.every((x) => x.isWinner), true);
});

test("pending players are appended, match not complete", () => {
  const r = rankMatch([
    p({ userId: "a", score: 850, finished: true, isCreator: true }),
    p({ userId: "b", finished: false }),
  ]);
  assert.equal(r.complete, false);
  assert.equal(r.finishedCount, 1);
  assert.equal(r.players[0].userId, "a");
  assert.equal(r.players[1].rank, null);
});

test("a lone finished creator is not a complete match", () => {
  const r = rankMatch([p({ userId: "a", score: 500, isCreator: true })]);
  assert.equal(r.complete, false);
  assert.equal(r.totalPlayers, 1);
});
