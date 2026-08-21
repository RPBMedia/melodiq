// The Record Collection — a "wall" of every track the player has correctly
// identified. It is derived entirely from Round history (a track is COLLECTED
// the first time it's guessed right), so there's no separate table to keep in
// sync: the page reads Round + Song and this pure builder shapes the view.

export type CollectedRow = {
  songId: string;
  bestTimeMs: number; // fastest correct guess for this song (ms), > 0
  timesCorrect: number; // how many times the player has nailed it
};

export type SongMeta = {
  id: string;
  title: string;
  artist: string;
  genre: string;
  year: number | null;
  coverColor: string;
};

export type GenreTotal = { genre: string; total: number };

export type CollectionCard = SongMeta & {
  bestTimeMs: number;
  bestTimeLabel: string; // e.g. "2.4s"
  timesCorrect: number;
};

export type GenreGroup = {
  genre: string;
  collected: number;
  total: number;
  pct: number; // 0–100, rounded
  cards: CollectionCard[]; // fastest-first
};

export type CollectionView = {
  totalCollected: number;
  totalSongs: number;
  pct: number; // 0–100, rounded
  genres: GenreGroup[]; // most-complete-first
};

// Whole seconds get no decimal noise; otherwise one decimal ("2.4s").
export function formatTime(ms: number): string {
  const s = ms / 1000;
  return `${Number.isInteger(s) ? s : s.toFixed(1)}s`;
}

function pct(part: number, whole: number): number {
  return whole > 0 ? Math.round((100 * part) / whole) : 0;
}

// Fold the (correct-round) aggregates + song metadata + per-genre totals into a
// genre-grouped wall. Genres are ordered by completion (then name); cards within
// a genre by fastest best time (then title). Unknown song ids are skipped.
export function buildCollection(
  collected: CollectedRow[],
  songs: SongMeta[],
  genreTotals: GenreTotal[],
): CollectionView {
  const byId = new Map(songs.map((s) => [s.id, s]));
  const totals = new Map(genreTotals.map((g) => [g.genre, g.total]));

  const groups = new Map<string, CollectionCard[]>();
  for (const row of collected) {
    const song = byId.get(row.songId);
    if (!song) continue;
    const card: CollectionCard = {
      ...song,
      bestTimeMs: row.bestTimeMs,
      bestTimeLabel: formatTime(row.bestTimeMs),
      timesCorrect: row.timesCorrect,
    };
    const arr = groups.get(song.genre);
    if (arr) arr.push(card);
    else groups.set(song.genre, [card]);
  }

  const totalSongs = genreTotals.reduce((n, g) => n + g.total, 0);
  let totalCollected = 0;

  const genres: GenreGroup[] = [];
  for (const [genre, cards] of groups) {
    cards.sort((a, b) => a.bestTimeMs - b.bestTimeMs || a.title.localeCompare(b.title));
    const total = totals.get(genre) ?? cards.length;
    totalCollected += cards.length;
    genres.push({ genre, collected: cards.length, total, pct: pct(cards.length, total), cards });
  }

  genres.sort((a, b) => b.pct - a.pct || a.genre.localeCompare(b.genre));

  return { totalCollected, totalSongs, pct: pct(totalCollected, totalSongs), genres };
}
