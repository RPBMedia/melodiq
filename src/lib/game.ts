import { prisma } from "@/lib/prisma";
import { SONGS_PER_GAME, OPTIONS_PER_ROUND } from "@/lib/scoring";
import { resolvePreview, isEphemeralPreview } from "@/lib/preview";
import { familyOf, genreMeta } from "@/lib/genres";

/** A family selection (the "All Metal" pill) arrives as "family:<id>". */
const FAMILY_PREFIX = "family:";

export type RoundPayload = {
  order: number;
  songId: string;
  previewUrl: string | null;
  coverColor: string;
  artist: string;
  // Multiple-choice options (title + artist), shuffled. The correct title is
  // still revealed only after an answer (via the answer endpoint), so the
  // client can't tell which option is right up front.
  options: { title: string; artist: string }[];
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
export async function buildGame(
  genre?: string | null,
  count: number = SONGS_PER_GAME,
): Promise<BuiltGame> {
  const all = await prisma.song.findMany();
  if (all.length < OPTIONS_PER_ROUND) {
    throw new Error("Song pool is too small. Run `npm run db:seed`.");
  }

  // `genre` may be a specific sub-genre ("heavy metal") OR a whole family via
  // the "family:<id>" form ("family:metal" = every metal sub-genre).
  const familyFilter = genre?.startsWith(FAMILY_PREFIX)
    ? genre.slice(FAMILY_PREFIX.length)
    : null;
  // Resolve the requested sub-genre through the taxonomy so canonical ids and
  // aliases/casing variants all match the same songs ("Pop" == "pop").
  const targetGenre =
    genre && genre !== "all" && !familyFilter
      ? genreMeta(genre)?.id ?? genre.toLowerCase()
      : null;
  const inGenre =
    genre && genre !== "all"
      ? familyFilter
        ? all.filter((s) => familyOf(s.genre) === familyFilter)
        : all.filter((s) => (genreMeta(s.genre)?.id ?? s.genre.toLowerCase()) === targetGenre)
      : all;

  const pool = inGenre.length >= OPTIONS_PER_ROUND ? inGenre : all;

  // Requested length, capped by how many distinct songs the pool can field.
  const picks = shuffle(pool).slice(0, Math.min(count, pool.length));

  // Freshen preview URLs at serve time: Deezer URLs expire (403 → silence), so
  // re-resolve any missing/ephemeral one now. Stable iTunes URLs are kept. Done
  // in parallel; a freshly-found stable (iTunes) URL is written back so the pool
  // self-heals and needs no refresh next time. Best-effort — never blocks a game.
  await Promise.all(
    picks.map(async (song) => {
      if (song.previewUrl && !isEphemeralPreview(song.previewUrl)) return;
      try {
        const fresh = await resolvePreview(song.title, song.artist);
        if (!fresh) return;
        song.previewUrl = fresh.previewUrl;
        if (!isEphemeralPreview(fresh.previewUrl)) {
          prisma.song
            .update({
              where: { id: song.id },
              data: { previewUrl: fresh.previewUrl, provider: fresh.provider },
            })
            .catch(() => {});
        }
      } catch {
        /* keep whatever we had */
      }
    }),
  );

  const rounds: RoundPayload[] = picks.map((song, order) => {
    // Prefer same-pool decoys; fall back to the full pool if needed.
    let decoyPool = pool.filter((s) => s.id !== song.id);
    if (decoyPool.length < OPTIONS_PER_ROUND - 1) {
      decoyPool = all.filter((s) => s.id !== song.id);
    }
    const decoys = shuffle(decoyPool)
      .slice(0, OPTIONS_PER_ROUND - 1)
      .map((s) => ({ title: s.title, artist: s.artist }));
    return {
      order,
      songId: song.id,
      previewUrl: song.previewUrl,
      coverColor: song.coverColor,
      artist: song.artist,
      options: shuffle([{ title: song.title, artist: song.artist }, ...decoys]),
    };
  });

  const titlePool = Array.from(new Set(pool.map((s) => s.title))).sort();
  return { rounds, titlePool };
}
