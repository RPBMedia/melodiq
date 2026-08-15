import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GENRE_FAMILIES, familyOf, genreLabel, genreMeta } from "@/lib/genres";

export const dynamic = "force-dynamic";

// Public: the genre picker data. Returns both a flat list (with counts) and the
// same genres grouped into families (PRD M2 taxonomy), so the UI can present
// families of sub-genres. Unrecognised stored genres fall into "Other".
export async function GET() {
  try {
    const grouped = await prisma.song.groupBy({
      by: ["genre"],
      _count: { _all: true },
    });

    // Fold raw stored strings onto their canonical taxonomy entry so casing and
    // alias variants ("Pop" vs "pop", "hip-hop" vs "hip hop") collapse into a
    // single pill with a summed count, rather than duplicate pills.
    const byCanonical = new Map<
      string,
      { genre: string; label: string; family: ReturnType<typeof familyOf>; emoji: string; count: number }
    >();
    for (const g of grouped) {
      const meta = genreMeta(g.genre);
      const key = meta?.id ?? g.genre.toLowerCase();
      const existing = byCanonical.get(key);
      if (existing) {
        existing.count += g._count._all;
      } else {
        byCanonical.set(key, {
          genre: meta?.id ?? g.genre,
          label: genreLabel(g.genre),
          family: familyOf(g.genre),
          emoji: meta?.emoji ?? "🎵",
          count: g._count._all,
        });
      }
    }

    const genres = [...byCanonical.values()].sort((a, b) => b.count - a.count);

    const total = genres.reduce((s, g) => s + g.count, 0);

    // Build family groups in taxonomy order, keeping only families with songs.
    const families = GENRE_FAMILIES.map((fam) => {
      const members = genres.filter((g) => g.family === fam.id);
      return {
        id: fam.id,
        label: fam.label,
        emoji: fam.emoji,
        accent: fam.accent,
        count: members.reduce((s, g) => s + g.count, 0),
        genres: members,
      };
    }).filter((fam) => fam.count > 0);

    // Anything unmapped is surfaced honestly rather than hidden.
    const other = genres.filter((g) => g.family === null);
    if (other.length > 0) {
      families.push({
        id: "other" as never,
        label: "Other",
        emoji: "🎵",
        accent: "#A09CC4",
        count: other.reduce((s, g) => s + g.count, 0),
        genres: other,
      });
    }

    return NextResponse.json({ total, genres, families });
  } catch {
    return NextResponse.json({ error: "Could not load genres." }, { status: 500 });
  }
}
