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

// ----- M4 alternate modes -----
// `GameSession.mode` doubles as the game type. "multiple"/"typing" are the two
// input styles of the Classic loop; "survival" and "speed" are alternate modes
// that both use multiple-choice input.
export type GameMode = "multiple" | "typing" | "survival" | "speed";

/** Speed/Intro: name it fast. Shorter window and a steeper, front-loaded curve. */
export const SPEED_ROUND_SECONDS = 12;

/** Survival: a deep, difficulty-ramped stack; 3 lives; play until they run out. */
export const SURVIVAL_STACK = 40;
export const SURVIVAL_LIVES = 3;

/**
 * Speed/Intro points for a CORRECT answer — reward the very first seconds:
 *   0–1.5s -> 100 · 1.5–3s -> 75 · 3–6s -> 45 · 6–12s -> 20 · >12s -> 0
 */
export function pointsForElapsedSpeed(elapsedSeconds: number): number {
  if (elapsedSeconds < 0) return 0;
  if (elapsedSeconds <= 1.5) return 100;
  if (elapsedSeconds <= 3) return 75;
  if (elapsedSeconds <= 6) return 45;
  if (elapsedSeconds <= SPEED_ROUND_SECONDS) return 20;
  return 0;
}

/** The per-round time window for a mode (seconds). */
export function roundSecondsForMode(mode: string): number {
  return mode === "speed" ? SPEED_ROUND_SECONDS : ROUND_SECONDS;
}

/** Points for a correct answer under the given mode's curve. */
export function pointsForModeElapsed(mode: string, elapsedSeconds: number): number {
  return mode === "speed" ? pointsForElapsedSpeed(elapsedSeconds) : pointsForElapsed(elapsedSeconds);
}

/** Mode-aware correctness + timing. Used by the server at submit time. */
export function scoreAnswerFor(mode: string, correct: boolean, elapsedMs: number): number {
  if (!correct) return 0;
  return pointsForModeElapsed(mode, elapsedMs / 1000);
}
