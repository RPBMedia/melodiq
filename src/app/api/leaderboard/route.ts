import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Public: top game sessions ranked by score, joined to their player.
export async function GET() {
  try {
    const top = await prisma.gameSession.findMany({
      // Only completed Classic/Daily games. Survival and Speed use different
      // scoring curves/lengths, so they'd distort a shared ranking — they get
      // their own boards later.
      where: { finishedAt: { not: null }, mode: { notIn: ["survival", "speed"] } },
      orderBy: [{ score: "desc" }, { createdAt: "asc" }],
      take: 25,
      select: {
        id: true,
        score: true,
        correctCount: true,
        totalRounds: true,
        createdAt: true,
        mode: true,
        genre: true,
        user: { select: { name: true, image: true } },
      },
    });

    const entries = top.map((g, i) => ({
      rank: i + 1,
      name: g.user.name ?? "Anonymous",
      image: g.user.image ?? null,
      score: g.score,
      correctCount: g.correctCount,
      totalRounds: g.totalRounds,
      mode: g.mode,
      genre: g.genre,
      date: g.createdAt,
    }));

    return NextResponse.json({ entries });
  } catch (err) {
    console.error("leaderboard failed:", err);
    return NextResponse.json({ error: "Could not load leaderboard." }, { status: 500 });
  }
}
