// Helpers for the shareable result card. The text/url builders are pure so they
// can be unit-tested and reused on both client (Web Share) and server (OG meta).

export type ShareStats = {
  score: number;
  correctCount: number;
  totalRounds: number;
  genre: string | null; // null => all genres
  isDaily: boolean;
};

// The caption used for Web Share and the social description. Kept short and
// punchy; ends with a nudge to play.
export function buildShareText(s: ShareStats): string {
  const where = s.isDaily ? "the MelodIQ Daily" : "MelodIQ";
  const genre = !s.isDaily && s.genre ? ` (${s.genre})` : "";
  return `I scored ${s.score.toLocaleString()} on ${where} 🎧 — ${s.correctCount}/${s.totalRounds} correct${genre}. Can you beat me?`;
}

// Short headline for the OG card image.
export function buildShareHeadline(s: ShareStats): string {
  return s.isDaily ? "MelodIQ Daily" : "MelodIQ";
}

// Canonical origin for absolute URLs (OG images, share links) across
// environments. Prefers an explicit site URL, then the auth URL, then Vercel's
// per-deploy host, falling back to localhost in dev.
export function baseUrl(): string {
  const explicit =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || process.env.AUTH_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export function shareUrl(gameId: string): string {
  return `${baseUrl()}/s/${gameId}`;
}
