import { prisma } from "@/lib/prisma";
import { SONGS_PER_GAME, OPTIONS_PER_ROUND } from "@/lib/scoring";

export type RoundPayload = {
  order: number;
  songId: string;
  previewUrl: string | null;
  coverColor: string;
  artist: string;
  // Multiple-choice options (titles), shuffled. The correct title is NOT sent;
  // the server reveals it only after an answer, so the client can't peek.
  options: string[];
};

export type BuiltGame = {
  rounds: RoundPayload[];
  titlePool: string[]; // candidate titles for the typing-mode autocomplete
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Build a fresh game. If `genre` is provided, songs and decoys are drawn from
 * that genre; otherwise the whole pool is used. Decoys top up from the full
 * pool if a genre is too small to supply enough distinct options.
 */
export async function buildGame(genre?: string | null): Promise<BuiltGame> {
  const all = await prisma.song.findMany();
  if (all.length < OPTIONS_PER_ROUND) {
    throw new Error("Song pool is too small. Run `npm run db:seed`.");
  }

  const inGenre =
    genre && genre !== "all"
      ? all.filter((s) => s.genre.toLowerCase() === genre.toLowerCase())
      : all;

  const pool = inGenre.length >= OPTIONS_PER_ROUND ? inGenre : all;

  const picks = shuffle(pool).slice(0, Math.min(SONGS_PER_GAME, pool.length));

  const rounds: RoundPayload[] = picks.map((song, order) => {
    // Prefer same-pool decoys; fall back to the full pool if needed.
    let decoyPool = pool.filter((s) => s.id !== song.id);
    if (decoyPool.length < OPTIONS_PER_ROUND - 1) {
      decoyPool = all.filter((s) => s.id !== song.id);
    }
    const decoys = shuffle(decoyPool)
      .slice(0, OPTIONS_PER_ROUND - 1)
      .map((s) => s.title);
    return {
      order,
      songId: song.id,
      previewUrl: song.previewUrl,
      coverColor: song.coverColor,
      artist: song.artist,
      options: shuffle([song.title, ...decoys]),
    };
  });

  const titlePool = Array.from(new Set(pool.map((s) => s.title))).sort();
  return { rounds, titlePool };
}
