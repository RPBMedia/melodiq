/** Server-side preview resolution.
 *
 * iTunes preview URLs are stable, but Deezer's are tokenized and EXPIRE — a
 * stored Deezer URL 403s after a while and plays as silence. So we re-resolve
 * ephemeral URLs fresh at game-start (see buildGame) rather than trusting the
 * stored value. Providers tried in order: iTunes (stable) then Deezer.
 */

const UA = "MelodIQ/0.2";

/** Deezer preview URLs (cdnt/cdns-preview.dzcdn.net) carry an expiring token. */
export function isEphemeralPreview(url: string | null | undefined): boolean {
  return !!url && /dzcdn\.net/i.test(url);
}

function cleanArtist(a: string): string {
  return a.replace(/\s+(ft\.|feat\.|featuring|&|x)\s+.*/i, "").trim();
}
function cleanTitle(t: string): string {
  return t.replace(/^\([^)]+\)\s*/, "").trim();
}

async function searchItunes(term: string): Promise<string | null> {
  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&entity=song&limit=3&country=US`;
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.results?.find((r: { previewUrl?: string }) => r.previewUrl)?.previewUrl ?? null;
  } catch {
    return null;
  }
}

async function searchDeezer(term: string): Promise<string | null> {
  try {
    const url = `https://api.deezer.com/search?q=${encodeURIComponent(term)}&limit=5`;
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data?.find((r: { preview?: string }) => r.preview)?.preview ?? null;
  } catch {
    return null;
  }
}

export interface ResolvedPreview {
  previewUrl: string;
  provider: "itunes" | "deezer";
}

/** Resolve a fresh, currently-valid preview URL for a track, or null. */
export async function resolvePreview(
  title: string,
  artist: string,
): Promise<ResolvedPreview | null> {
  const a = cleanArtist(artist);
  const t = cleanTitle(title);
  const terms = [`${artist} ${title}`, `${a} ${title}`, `${a} ${t}`, `${t}`];

  for (const term of terms) {
    const it = await searchItunes(term);
    if (it) return { previewUrl: it, provider: "itunes" };
  }
  for (const term of terms) {
    const dz = await searchDeezer(term);
    if (dz) return { previewUrl: dz, provider: "deezer" };
  }
  return null;
}
