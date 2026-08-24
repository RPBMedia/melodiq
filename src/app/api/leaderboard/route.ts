import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

// Monday 00:00 UTC of the current week — the "This week" board boundary.
function startOfWeekUTC(): Date {
  const now = new Date();
  const daysSinceMonday = (now.getUTCDay() + 6) % 7; // Sun=0 -> 6, Mon=1 -> 0
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  d.setUTCDate(d.getUTCDate() - daysSinceMonday);
  return d;
}

// Public: top game sessions ranked by score, joined to their player.
//   ?scope=all|week   ?genre=<stored genre string | family:<id> | all>
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const scope = searchParams.get("scope") === "week" ? "week" : "all";
  const genre = searchParams.get("genre");

  try {
    // Survival/Speed/Year use different scoring, so they're excluded from the
    // shared ranking. "week" scopes to games finished since Monday (UTC).
    const where: Prisma.GameSessionWhereInput = {
      mode: { notIn: ["survival", "speed", "year"] },
      finishedAt: scope === "week" ? { gte: startOfWeekUTC() } : { not: null },
    };
    if (genre && genre !== "all") where.genre = genre;

    const top = await prisma.gameSession.findMany({
      where,
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

    return NextResponse.json({ entries, scope, genre: genre ?? "all" });
  } catch (err) {
    console.error("leaderboard failed:", err);
    return NextResponse.json({ error: "Could not load leaderboard." }, { status: 500 });
  }
}
