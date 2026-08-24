/** MelodIQ genre taxonomy (PRD M2).
 *
 * The guessing pool stores a flat `genre` string per Song, but the product
 * organises those into a small set of **families** (Pop, Rock, Metal, …) each
 * containing **sub-genres**. This module is the single source of truth for that
 * structure — used by the genre picker, journeys, and content curation — so the
 * mapping lives in one typed place rather than scattered string checks.
 *
 * Colours come from the neon palette in the PRD.
 */

export type GenreFamilyId =
  | "pop"
  | "rock"
  | "metal"
  | "electronic"
  | "hip-hop"
  | "jazz-blues"
  | "classical-screen"
  | "folk";

export interface GenreMeta {
  /** Canonical lowercase id, matched against the Song.genre string. */
  id: string;
  label: string;
  family: GenreFamilyId;
  emoji: string;
  /** Accent colour (neon palette). */
  accent: string;
  /** Alternate spellings seen in stored/seeded data, matched case-insensitively. */
  aliases?: string[];
}

export interface GenreFamily {
  id: GenreFamilyId;
  label: string;
  emoji: string;
  accent: string;
  genres: GenreMeta[];
}

const MAGENTA = "#FF2D87";
const VIOLET = "#8B5CF6";
const CYAN = "#22D3EE";
const AMBER = "#FBBF24";
const GREEN = "#34D399";
const ROSE = "#FB7185";
const ORANGE = "#FB923C";
const ORCHID = "#E879F9";

/** Families in display order, each with its sub-genres. */
export const GENRE_FAMILIES: GenreFamily[] = [
  {
    id: "pop",
    label: "Pop",
    emoji: "✨",
    accent: MAGENTA,
    genres: [
      { id: "pop", label: "Pop", family: "pop", emoji: "✨", accent: MAGENTA },
      { id: "indie", label: "Indie", family: "pop", emoji: "🎈", accent: MAGENTA, aliases: ["indie pop"] },
    ],
  },
  {
    id: "rock",
    label: "Rock",
    emoji: "🎸",
    accent: ROSE,
    genres: [
      { id: "rock", label: "Rock", family: "rock", emoji: "🎸", accent: ROSE },
      { id: "pop rock", label: "Pop Rock", family: "rock", emoji: "🎤", accent: ROSE, aliases: ["pop-rock"] },
      { id: "hard rock", label: "Hard Rock", family: "rock", emoji: "🤘", accent: ROSE, aliases: ["hard-rock"] },
    ],
  },
  {
    id: "metal",
    label: "Metal",
    emoji: "🔥",
    accent: VIOLET,
    genres: [
      { id: "heavy metal", label: "Heavy Metal", family: "metal", emoji: "🔥", accent: VIOLET },
      { id: "power metal", label: "Speed/Power Metal", family: "metal", emoji: "⚡", accent: VIOLET, aliases: ["speed metal", "speed/power metal", "power/speed metal", "speed power metal"] },
      { id: "progressive metal", label: "Progressive Metal", family: "metal", emoji: "🌀", accent: VIOLET, aliases: ["prog metal", "prog-metal", "progressive-metal"] },
      { id: "death metal", label: "Death Metal", family: "metal", emoji: "💀", accent: VIOLET },
      { id: "black metal", label: "Black Metal", family: "metal", emoji: "🌑", accent: VIOLET },
      { id: "folk metal", label: "Folk Metal", family: "metal", emoji: "⚔️", accent: VIOLET },
    ],
  },
  {
    id: "electronic",
    label: "Electronic",
    emoji: "🎛️",
    accent: CYAN,
    genres: [
      { id: "dance", label: "Dance / EDM", family: "electronic", emoji: "🎉", accent: CYAN, aliases: ["edm", "electronic", "house", "techno", "dance"] },
      { id: "industrial", label: "Industrial", family: "electronic", emoji: "🏭", accent: CYAN },
    ],
  },
  {
    id: "hip-hop",
    label: "Hip-Hop & R&B",
    emoji: "🎤",
    accent: ORCHID,
    genres: [
      { id: "hip hop", label: "Hip-Hop", family: "hip-hop", emoji: "🎤", accent: ORCHID, aliases: ["hip-hop", "hiphop", "rap"] },
      { id: "r&b", label: "R&B", family: "hip-hop", emoji: "💜", accent: ORCHID, aliases: ["rnb", "r and b", "soul", "r&b/soul"] },
    ],
  },
  {
    id: "jazz-blues",
    label: "Jazz & Blues",
    emoji: "🎷",
    accent: AMBER,
    genres: [
      { id: "jazz", label: "Jazz", family: "jazz-blues", emoji: "🎷", accent: AMBER },
      { id: "blues", label: "Blues", family: "jazz-blues", emoji: "🎺", accent: AMBER },
    ],
  },
  {
    id: "classical-screen",
    label: "Classical & Screen",
    emoji: "🎻",
    accent: GREEN,
    genres: [
      { id: "classical", label: "Classical", family: "classical-screen", emoji: "🎻", accent: GREEN },
      { id: "ost", label: "Soundtrack", family: "classical-screen", emoji: "🎬", accent: GREEN, aliases: ["soundtrack", "score", "film score"] },
      { id: "new-age", label: "New Age", family: "classical-screen", emoji: "🌌", accent: GREEN, aliases: ["new age", "newage", "ambient"] },
    ],
  },
  {
    id: "folk",
    label: "Folk",
    emoji: "🪕",
    accent: ORANGE,
    genres: [
      { id: "folk", label: "Folk", family: "folk", emoji: "🪕", accent: ORANGE, aliases: ["acoustic"] },
    ],
  },
];

/** Flat list of every sub-genre. */
export const ALL_GENRES: GenreMeta[] = GENRE_FAMILIES.flatMap((f) => f.genres);

const norm = (s: string) => s.trim().toLowerCase();

// id/alias → GenreMeta, for resolving stored strings.
const BY_KEY = new Map<string, GenreMeta>();
for (const g of ALL_GENRES) {
  BY_KEY.set(norm(g.id), g);
  for (const a of g.aliases ?? []) BY_KEY.set(norm(a), g);
}

/** Resolve a stored genre string to its taxonomy entry (by id or alias). */
export function genreMeta(genre: string): GenreMeta | undefined {
  return BY_KEY.get(norm(genre));
}

/** The family a stored genre string belongs to, or null when unrecognised. */
export function familyOf(genre: string): GenreFamilyId | null {
  return genreMeta(genre)?.family ?? null;
}

/** Human label for a stored genre string (falls back to the raw value). */
export function genreLabel(genre: string): string {
  return genreMeta(genre)?.label ?? genre;
}

export function familyMeta(id: GenreFamilyId): GenreFamily | undefined {
  return GENRE_FAMILIES.find((f) => f.id === id);
}
