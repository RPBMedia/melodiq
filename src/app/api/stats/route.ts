import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const games = await prisma.gameSession.findMany({
    where: { userId: session.user.id, finishedAt: { not: null } },
    orderBy: { createdAt: "desc" },
    select: { id: true, score: true, correctCount: true, totalRounds: true, createdAt: true, mode: true, genre: true },
  });

  const gamesPlayed = games.length;
  const bestScore = games.reduce((m, g) => Math.max(m, g.score), 0);
  const totalScore = games.reduce((s, g) => s + g.score, 0);
  const avgScore = gamesPlayed ? Math.round(totalScore / gamesPlayed) : 0;
  const totalCorrect = games.reduce((s, g) => s + g.correctCount, 0);
  const totalRounds = games.reduce((s, g) => s + g.totalRounds, 0);
  const accuracy = totalRounds ? Math.round((totalCorrect / totalRounds) * 100) : 0;

  return NextResponse.json({
    gamesPlayed,
    bestScore,
    avgScore,
    accuracy,
    recent: games.slice(0, 8),
  });
}
