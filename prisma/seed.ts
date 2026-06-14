import { PrismaClient } from "@prisma/client";
import { SONGS } from "./songs";

const prisma = new PrismaClient();

async function main() {
  console.log(`Seeding ${SONGS.length} songs...`);
  // Reset the pool so re-running seed is idempotent.
  await prisma.song.deleteMany();
  for (const s of SONGS) {
    await prisma.song.create({
      data: {
        title: s.title,
        artist: s.artist,
        genre: s.genre,
        year: s.year,
        coverColor: s.coverColor,
        previewUrl: null, // populate later via `npm run fetch:previews`
      },
    });
  }
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
