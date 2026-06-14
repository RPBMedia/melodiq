// MelodIQ scoring rules. Single source of truth, shared by client (live score
// display) and server (authoritative scoring at submit time).

export const ROUND_SECONDS = 30;
export const SONGS_PER_GAME = 10;
export const OPTIONS_PER_ROUND = 4;

/**
 * Points for a CORRECT answer based on elapsed time since the clip started.
 *   0–5s   -> 100
 *   6–10s  -> 80
 *   11–20s -> 50
 *   21–30s -> 25
 *   >30s   -> 0  (ran out of time)
 * A wrong answer is always 0 (handled by the caller).
 */
export function pointsForElapsed(elapsedSeconds: number): number {
  if (elapsedSeconds < 0) return 0;
  if (elapsedSeconds <= 5) return 100;
  if (elapsedSeconds <= 10) return 80;
  if (elapsedSeconds <= 20) return 50;
  if (elapsedSeconds <= ROUND_SECONDS) return 25;
  return 0;
}

/** Convenience wrapper that combines correctness + timing. */
export function scoreAnswer(correct: boolean, elapsedMs: number): number {
  if (!correct) return 0;
  return pointsForElapsed(elapsedMs / 1000);
}

export const MAX_GAME_SCORE = SONGS_PER_GAME * 100;
