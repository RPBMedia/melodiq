// Async Head-to-Head (PRD M5). Everyone plays the SAME seeded clip set; scores
// are compared when players finish. The data model holds players as a collection,
// so this supports 2 today and up to MATCH_MAX_PLAYERS later with no change here.
//
// Ranking is pure and unit-tested; seed generation lives here too for one home.

import { randomBytes } from "node:crypto";

export const MATCH_MAX_PLAYERS = 5;
export const MATCH_ROUNDS = 10;

/** A short, URL-safe deterministic seed for a match's clip set. */
export function generateMatchSeed(): string {
  return `m_${randomBytes(9).toString("base64url")}`;
}

export type MatchPlayerView = {
  userId: string;
  name: string;
  image: string | null;
  score: number;
  correctCount: number;
  finished: boolean;
  isCreator: boolean;
};

export type RankedPlayer = MatchPlayerView & { rank: number | null; isWinner: boolean };

export type MatchResult = {
  players: RankedPlayer[]; // finished (score desc) first, then still-playing
  finishedCount: number;
  totalPlayers: number;
  complete: boolean; // >=2 players and everyone who joined has finished
  topScore: number | null;
  winners: string[]; // userId(s) tied at the top score (only among finished)
};

/**
 * Rank a match's players: finished players sorted by score (then accuracy, then
 * name) get 1-based ranks and a winner flag on the top score (ties share it);
 * players still mid-game are appended with rank null.
 */
export function rankMatch(players: MatchPlayerView[]): MatchResult {
  const finished = players
    .filter((p) => p.finished)
    .sort(
      (a, b) => b.score - a.score || b.correctCount - a.correctCount || a.name.localeCompare(b.name),
    );
  const pending = players.filter((p) => !p.finished);

  const topScore = finished.length ? finished[0].score : null;
  const winners = topScore === null ? [] : finished.filter((p) => p.score === topScore).map((p) => p.userId);

  const ranked: RankedPlayer[] = [
    ...finished.map((p, i) => ({ ...p, rank: i + 1, isWinner: p.score === topScore })),
    ...pending.map((p) => ({ ...p, rank: null, isWinner: false })),
  ];

  return {
    players: ranked,
    finishedCount: finished.length,
    totalPlayers: players.length,
    complete: players.length >= 2 && pending.length === 0,
    topScore,
    winners,
  };
}
