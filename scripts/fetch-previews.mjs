// Multi-provider preview pipeline (PRD M2).
//
// Populates each Song with a LEGAL 30-second preview URL, trying providers in
// order and validating that the chosen URL actually resolves before saving:
//   1. iTunes Search API (free, no key, AAC/M4A previews)
//   2. Deezer public API  (free, no key, MP3 previews) — fallback
// Records which provider won on `Song.provider`.
//
// Usage:
//   npm run fetch:previews          # only fill songs missing a preview
//   FORCE=1 npm run fetch:previews  # re-resolve every song
//
// Requires Node 18+ (global fetch). Run AFTER `npm run db:push` + `db:seed`.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const FORCE = process.env.FORCE === "1" || process.argv.includes("--force");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function cleanArtist(artist) {
  return artist.replace(/\s+(ft\.|feat\.|featuring|&|x)\s+.*/i, "").trim();
}
function cleanTitle(title) {
  return title.replace(/^\([^)]+\)\s*/, "").trim();
}

/** Verify a preview URL resolves to real audio (cheap HEAD, ranged-GET fallback). */
async function validate(url) {
  if (!url) return false;
  try {
    const head = await fetch(url, { method: "HEAD" });
    if (head.ok) return true;
  } catch {
    /* some CDNs reject HEAD; fall through */
  }
  try {
    const res = await fetch(url, { headers: { Range: "bytes=0-1" } });
    return res.ok || res.status === 206;
  } catch {
    return false;
  }
}

async function searchItunes(term) {
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&entity=song&limit=3&country=US`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "MelodIQ/0.2" } });
    if (!res.ok) return null;
    const data = await res.json();
    const hit = data.results?.find((r) => r.previewUrl);
    return hit?.previewUrl ?? null;
  } catch {
    return null;
  }
}

async function searchDeezer(term) {
  const url = `https://api.deezer.com/search?q=${encodeURIComponent(term)}&limit=5`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "MelodIQ/0.2" } });
    if (!res.ok) return null;
    const data = await res.json();
    const hit = data.data?.find((r) => r.preview);
    return hit?.preview ?? null;
  } catch {
    return null;
  }
}

/** Resolve a validated preview + provider, trying iTunes then Deezer. */
async function resolve(title, artist) {
  const a = cleanArtist(artist);
  const t = cleanTitle(title);
  const terms = [`${artist} ${title}`, `${a} ${title}`, `${a} ${t}`, `${t}`];

  for (const provider of ["itunes", "deezer"]) {
    const search = provider === "itunes" ? searchItunes : searchDeezer;
    for (const term of terms) {
      const url = await search(term);
      if (url && (await validate(url))) return { previewUrl: url, provider };
      await sleep(150);
    }
  }
  return null;
}

async function main() {
  const where = FORCE ? {} : { previewUrl: null };
  const songs = await prisma.song.findMany({ where });
  console.log(
    `Resolving previews for ${songs.length} song(s)${FORCE ? " (forced)" : " (missing only)"}...`,
  );

  const byProvider = { itunes: 0, deezer: 0 };
  let missing = 0;
  for (const song of songs) {
    try {
      const found = await resolve(song.title, song.artist);
      if (found) {
        await prisma.song.update({
          where: { id: song.id },
          data: { previewUrl: found.previewUrl, provider: found.provider },
        });
        byProvider[found.provider]++;
        console.log(`  ✓ [${found.provider}] ${song.artist} — ${song.title}`);
      } else {
        missing++;
        console.log(`  · no preview: ${song.artist} — ${song.title}`);
      }
      await sleep(250);
    } catch (e) {
      console.log(`  ! error for ${song.title}:`, e.message);
    }
  }

  const ok = byProvider.itunes + byProvider.deezer;
  console.log(
    `\nDone. ${ok}/${songs.length} resolved ` +
      `(iTunes ${byProvider.itunes}, Deezer ${byProvider.deezer}); ${missing} still missing.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
