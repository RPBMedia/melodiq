// Title matching for the "type the title" mode. We normalize aggressively so
// players aren't punished for casing, punctuation, featured-artist tags, or a
// leading "the", then allow a small typo tolerance via Levenshtein distance.

export function normalizeTitle(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\(.*?\)|\[.*?\]/g, " ") // drop "(Remix)", "[Live]", etc.
    .replace(/\bfeat\.?\b|\bft\.?\b/g, " ")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9 ]/g, " ") // strip punctuation
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^the /, "");
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const prev = new Array(n + 1);
  const curr = new Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= n; j++) prev[j] = curr[j];
  }
  return prev[n];
}

/**
 * True when the player's guess matches the real title. Exact (normalized)
 * matches always pass; otherwise we allow a typo budget that scales with the
 * title's length (about 1 typo per 6 characters, capped at 2).
 */
export function titlesMatch(guess: string | null | undefined, actual: string): boolean {
  if (!guess) return false;
  const g = normalizeTitle(guess);
  const a = normalizeTitle(actual);
  if (!g) return false;
  if (g === a) return true;
  const budget = Math.min(2, Math.floor(a.length / 6));
  return levenshtein(g, a) <= budget;
}
