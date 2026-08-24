// Hints (PRD M4) — spend points to narrow down a round. A 5-step ladder, bought
// in order, each with a point cost that's subtracted from the round's score
// server-side. SINGLE-PLAYER ONLY: multiplayer rounds must never offer hints, so
// all players compete on equal terms (enforced by the match round type).
//
// The reveal content is computed server-side from the song so it can't be faked;
// this module holds the pure ladder + content generators.

import { genreLabel } from "@/lib/genres";

export type HintKind = "genre" | "decade" | "initials" | "firstLetter" | "removeOption";

export type HintStep = { level: number; kind: HintKind; cost: number; label: string };

// The ladder. Costs total 95, so a fully-hinted correct answer still scores a
// little — hints erode the score, they don't zero it.
export const HINT_LADDER: HintStep[] = [
  { level: 1, kind: "genre", cost: 15, label: "Reveal the genre" },
  { level: 2, kind: "decade", cost: 15, label: "Reveal the decade" },
  { level: 3, kind: "initials", cost: 20, label: "Artist initials" },
  { level: 4, kind: "firstLetter", cost: 20, label: "First letter of the title" },
  { level: 5, kind: "removeOption", cost: 25, label: "Remove a wrong option" },
];

export const MAX_HINTS = HINT_LADDER.length;

/** How many ladder steps a mode offers: multiple-choice 5, typing 4 (no option
 *  removal), and none for Survival/Speed/Year. */
export function availableHintLevels(mode: string): number {
  if (mode === "multiple") return 5;
  if (mode === "typing") return 4;
  return 0;
}

/** Total point cost of the first n hints. */
export function hintsCost(n: number): number {
  return HINT_LADDER.slice(0, Math.max(0, n)).reduce((s, h) => s + h.cost, 0);
}

export function decadeOf(year: number | null): string {
  if (year == null) return "Unknown";
  return `${Math.floor(year / 10) * 10}s`;
}

export function initialsOf(artist: string): string {
  const parts = artist.split(/\s+/).filter((w) => /[a-z0-9]/i.test(w));
  if (!parts.length) return "?";
  return parts.map((w) => w[0]!.toUpperCase()).join(".") + ".";
}

/** Reveal text for the non-interactive hint kinds (levels 1–4). */
export function hintContent(
  kind: HintKind,
  song: { genre: string; year: number | null; artist: string; title: string },
): string {
  switch (kind) {
    case "genre":
      return genreLabel(song.genre);
    case "decade":
      return decadeOf(song.year);
    case "initials":
      return initialsOf(song.artist);
    case "firstLetter":
      return `${song.title.trim().charAt(0).toUpperCase()}…`;
    default:
      return "";
  }
}

/** Level 5: choose one wrong option title to remove (not the answer, not one
 *  already removed). Returns null when there's nothing left to cull. */
export function pickOptionToRemove(
  options: string[],
  correctTitle: string,
  alreadyRemoved: string[] = [],
): string | null {
  const removed = new Set(alreadyRemoved);
  const wrong = options.filter((o) => o !== correctTitle && !removed.has(o));
  return wrong.length ? wrong[0] : null;
}
