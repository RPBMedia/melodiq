// Song-pool sampling helpers (pure).

/**
 * Pick `count` items spread evenly across their "families" (round-robin), so a
 * family with many more items (e.g. metal, which has the most sub-genres) can't
 * dominate an "all genres" selection. Larger families still fill the remainder
 * once smaller ones run out. `shuffle` supplies (optionally seeded) randomness so
 * callers stay deterministic when they need to be.
 */
export function stratifiedPick<T>(
  items: T[],
  familyKey: (t: T) => string,
  count: number,
  shuffle: <X>(a: X[]) => X[],
): T[] {
  const byFamily = new Map<string, T[]>();
  for (const it of shuffle(items)) {
    const key = familyKey(it);
    const arr = byFamily.get(key);
    if (arr) arr.push(it);
    else byFamily.set(key, [it]);
  }

  const buckets = shuffle([...byFamily.values()]);
  const target = Math.min(count, items.length);
  const picks: T[] = [];
  let i = 0;
  while (picks.length < target && buckets.length) {
    const b = buckets[i % buckets.length];
    if (b.length) picks.push(b.pop()!);
    i++;
  }
  return picks;
}
