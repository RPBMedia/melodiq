import { test } from "node:test";
import assert from "node:assert/strict";
import { stratifiedPick } from "./pool";

const identity = <X>(a: X[]) => a; // deterministic "shuffle" for assertions
const tally = (picks: { f: string }[]) =>
  picks.reduce<Record<string, number>>((m, p) => ((m[p.f] = (m[p.f] || 0) + 1), m), {});

test("spreads picks evenly across families despite skew", () => {
  // 8 metal, 2 pop, 2 rock — a uniform draw would lean metal.
  const items = [
    ...Array(8).fill("metal"),
    ...Array(2).fill("pop"),
    ...Array(2).fill("rock"),
  ].map((f, i) => ({ f, i }));
  const picks = stratifiedPick(items, (x) => x.f, 6, identity);
  assert.equal(picks.length, 6);
  assert.deepEqual(tally(picks), { metal: 2, pop: 2, rock: 2 });
});

test("larger families fill the remainder once small ones run out", () => {
  const items = [...Array(5).fill("a"), ...Array(1).fill("b")].map((f, i) => ({ f, i }));
  const picks = stratifiedPick(items, (x) => x.f, 4, identity);
  assert.equal(picks.length, 4);
  assert.deepEqual(tally(picks), { a: 3, b: 1 });
});

test("count is clamped to available items", () => {
  const items = [{ f: "a", i: 0 }, { f: "b", i: 1 }];
  assert.equal(stratifiedPick(items, (x) => x.f, 10, identity).length, 2);
  assert.deepEqual(stratifiedPick([], () => "x", 5, identity), []);
});
