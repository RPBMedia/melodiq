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

async function lookup(title, artist) {
  const term = encodeURIComponent(`${artist} ${title}`);
  const url = `https://itunes.apple.com/search?term=${term}&media=music&entity=song&limit=1`;
  const res = await fetch(url, { headers: { "User-Agent": "MelodIQ/0.1" } });
  if (!res.ok) return null;
  const data = await res.json();
  const hit = data.results?.[0];
  if (!hit?.previewUrl) return null;
  return {
    previewUrl: hit.previewUrl,
    // 600x600 artwork for nicer covers (optional)
    artwork: hit.artworkUrl100?.replace("100x100", "600x600") ?? null,
  };
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
      // Be polite to the public API.
      await new Promise((r) => setTimeout(r, 350));
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
