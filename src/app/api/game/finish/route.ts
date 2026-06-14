import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Aggregate the (already server-scored) rounds into the game's final totals
// and mark it finished so it appears on the leaderboard and in stats.
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let body: { gameId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!body.gameId) {
    return NextResponse.json({ error: "Missing game id." }, { status: 400 });
  }

  const game = await prisma.gameSession.findUnique({
    where: { id: body.gameId },
    include: { rounds: true },
  });
  if (!game || game.userId !== session.user.id) {
    return NextResponse.json({ error: "Game not found." }, { status: 404 });
  }

  const score = game.rounds.reduce((s, r) => s + r.points, 0);
  const correctCount = game.rounds.filter((r) => r.correct).length;

  const updated = await prisma.gameSession.update({
    where: { id: game.id },
    data: {
      score,
      correctCount,
      finishedAt: game.finishedAt ?? new Date(),
    },
  });

  return NextResponse.json({
    gameId: updated.id,
    score: updated.score,
    correctCount: updated.correctCount,
    totalRounds: updated.totalRounds,
    mode: updated.mode,
    genre: updated.genre,
  });
}
