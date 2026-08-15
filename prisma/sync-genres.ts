import { PrismaClient } from "@prisma/client";
import { SONGS } from "./songs";

// One-off: sync each song's `genre` to the canonical taxonomy value from
// songs.ts by matching on title+artist, WITHOUT touching previewUrl/provider.
// Used after normalizing legacy capitalized genres so we don't have to wipe and
// re-fetch every preview (a full reseed would null all previewUrls).
const prisma = new PrismaClient();

async function main() {
  let updated = 0;
  const missing: string[] = [];
  for (const s of SONGS) {
    const res = await prisma.song.updateMany({
      where: { title: s.title, artist: s.artist, NOT: { genre: s.genre } },
      data: { genre: s.genre },
    });
    updated += res.count;
    const exists = await prisma.song.count({ where: { title: s.title, artist: s.artist } });
    if (exists === 0) missing.push(`${s.title} — ${s.artist}`);
  }
  console.log(`Updated ${updated} song genres in place (previews preserved).`);
  if (missing.length) console.log(`Not found in DB (skipped):\n  ${missing.join("\n  ")}`);

  const g = await prisma.song.groupBy({ by: ["genre"], _count: { _all: true } });
  console.log("\nLive DB genre distribution:");
  console.log(
    g
      .map((x) => ({ genre: x.genre, n: x._count._all }))
      .sort((a, b) => b.n - a.n)
      .map((x) => `  ${String(x.n).padStart(3)}  ${x.genre}`)
      .join("\n"),
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
