import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Public: distinct genres in the pool with song counts, for the genre picker.
export async function GET() {
  try {
    const grouped = await prisma.song.groupBy({
      by: ["genre"],
      _count: { _all: true },
    });
    const genres = grouped
      .map((g) => ({ genre: g.genre, count: g._count._all }))
      .sort((a, b) => b.count - a.count);
    const total = genres.reduce((s, g) => s + g.count, 0);
    return NextResponse.json({ total, genres });
  } catch {
    return NextResponse.json({ error: "Could not load genres." }, { status: 500 });
  }
}
