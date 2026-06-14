// Optional: populate legal 30-second preview URLs from the iTunes Search API.
//
// Apple's iTunes Search API is free, needs no API key, and returns a
// `previewUrl` field that points to a licensed 30s AAC/M4A preview clip that
// is allowed to be streamed. This script matches each seeded song to its
// closest iTunes result and saves the previewUrl + artwork onto the Song row.
//
// Usage:  npm run fetch:previews
//
// Requires Node 18+ (global fetch). Run AFTER `npm run db:seed`.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function cleanArtist(artist) {
  // Strip collaboration suffixes: "ft. ...", "feat. ...", "& ...", "x ..."
  return artist
    .replace(/\s+(ft\.|feat\.|featuring|&|x)\s+.*/i, "")
    .trim();
}

function cleanTitle(title) {
  // Strip leading parenthetical like "(I Can't Get No) Satisfaction" -> "Satisfaction"
  return title.replace(/^\([^)]+\)\s*/, "").trim();
}

async function searchItunes(term) {
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&entity=song&limit=3&country=US`;
  const res = await fetch(url, { headers: { "User-Agent": "MelodIQ/0.1" } });
  if (!res.ok) return null;
  const data = await res.json();
  return data.results?.find((r) => r.previewUrl) ?? null;
}

async function lookup(title, artist) {
  const cleanedArtist = cleanArtist(artist);
  const cleanedTitle = cleanTitle(title);

  // Try progressively looser search terms until we get a preview URL.
  const attempts = [
    `${artist} ${title}`,
    `${cleanedArtist} ${title}`,
    `${cleanedArtist} ${cleanedTitle}`,
    `${cleanedTitle}`,
  ];

  for (const term of attempts) {
    const hit = await searchItunes(term);
    if (hit?.previewUrl) {
      return {
        previewUrl: hit.previewUrl,
        artwork: hit.artworkUrl100?.replace("100x100", "600x600") ?? null,
      };
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  return null;
}

async function main() {
  const songs = await prisma.song.findMany();
  console.log(`Resolving previews for ${songs.length} songs...`);
  let ok = 0;
  for (const song of songs) {
    try {
      const found = await lookup(song.title, song.artist);
      if (found) {
        await prisma.song.update({
          where: { id: song.id },
          data: { previewUrl: found.previewUrl },
        });
        ok++;
        console.log(`  ✓ ${song.artist} — ${song.title}`);
      } else {
        console.log(`  · no preview: ${song.artist} — ${song.title}`);
      }
      await new Promise((r) => setTimeout(r, 300));
    } catch (e) {
      console.log(`  ! error for ${song.title}:`, e.message);
    }
  }
  console.log(`Done. ${ok}/${songs.length} previews populated.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
