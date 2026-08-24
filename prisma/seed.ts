import { PrismaClient } from "@prisma/client";
import { SONGS } from "./songs";

const prisma = new PrismaClient();

async function main() {
  console.log(`Seeding ${SONGS.length} songs...`);
  // Reset the pool so re-running seed is idempotent. Clear Rounds first — they
  // reference Songs (FK), so deleting songs would otherwise fail on a DB that
  // has games played. GameSession rows (and their leaderboard scores) survive.
  await prisma.round.deleteMany();
  await prisma.song.deleteMany();
  // Batched insert (single round-trip) — fast and atomic, so a slow serverless
  // connection can't leave a half-seeded pool the way 1000+ sequential creates could.
  await prisma.song.createMany({
    data: SONGS.map((s) => ({
      title: s.title,
      artist: s.artist,
      genre: s.genre,
      year: s.year,
      coverColor: s.coverColor,
      difficulty: s.difficulty ?? 2,
      previewUrl: null, // populate later via `npm run fetch:previews`
    })),
  });
  const count = await prisma.song.count();
  console.log(`Done. ${count} songs in the pool.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
