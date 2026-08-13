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

    const genres = grouped
      .map((g) => ({
        genre: g.genre,
        label: genreLabel(g.genre),
        family: familyOf(g.genre),
        emoji: genreMeta(g.genre)?.emoji ?? "🎵",
        count: g._count._all,
      }))
      .sort((a, b) => b.count - a.count);

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
