import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { todayUTC } from "@/lib/progression";

export const dynamic = "force-dynamic";

// Today's Daily Challenge leaderboard — one finished entry per user (guaranteed
// by the @@unique([userId, dailyDate]) constraint), ranked by score then speed.
export async function GET() {
  const today = todayUTC();
  const rows = await prisma.gameSession.findMany({
    where: { dailyDate: today, finishedAt: { not: null } },
    orderBy: [{ score: "desc" }, { finishedAt: "asc" }],
    take: 100,
    select: {
      id: true,
      score: true,
      correctCount: true,
      totalRounds: true,
      user: { select: { name: true, image: true } },
    },
  });

  return NextResponse.json({
    date: today,
    entries: rows.map((r, i) => ({
      rank: i + 1,
      name: r.user?.name ?? "Anonymous",
      image: r.user?.image ?? null,
      score: r.score,
      correctCount: r.correctCount,
      totalRounds: r.totalRounds,
    })),
  });
}
