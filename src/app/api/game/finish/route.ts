import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { xpForGame, levelForXp, rankForLevel, nextStreak } from "@/lib/progression";

export const dynamic = "force-dynamic";

// Aggregate the (already server-scored) rounds into the game's final totals,
// mark it finished, and — on the FIRST finish only — award XP and, for a Daily
// Challenge, advance the daily streak. XP is decided server-side in
// progression.ts; scoring/timing is never trusted from the client.
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
  const isDaily = !!game.dailyDate;

  const before = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { xp: true, dailyStreak: true, lastDailyDate: true },
  });
  const beforeXp = before?.xp ?? 0;
  const beforeLevel = levelForXp(beforeXp).level;

  // One transaction so score + XP + streak commit together. The conditional
  // `finishedAt: null` update means only the first finish awards XP — a repeat
  // finish (or a race) updates 0 rows and skips the award.
  const outcome = await prisma.$transaction(async (tx) => {
    const fin = await tx.gameSession.updateMany({
      where: { id: game.id, finishedAt: null },
      data: { score, correctCount, finishedAt: new Date() },
    });
    if (fin.count !== 1) {
      // Already finished earlier: keep the aggregate in sync, award nothing.
      await tx.gameSession.update({ where: { id: game.id }, data: { score, correctCount } });
      return { xpEarned: 0, totalXp: beforeXp, dailyStreak: before?.dailyStreak ?? 0 };
    }
    const xpEarned = xpForGame({ score, correctCount, totalRounds: game.totalRounds, isDaily });
    const data: Prisma.UserUpdateInput = { xp: { increment: xpEarned } };
    let dailyStreak = before?.dailyStreak ?? 0;
    if (isDaily && game.dailyDate) {
      dailyStreak = nextStreak(before?.lastDailyDate ?? null, before?.dailyStreak ?? 0, game.dailyDate);
      data.dailyStreak = dailyStreak;
      data.lastDailyDate = game.dailyDate;
    }
    const user = await tx.user.update({ where: { id: session.user.id }, data, select: { xp: true } });
    return { xpEarned, totalXp: user.xp, dailyStreak };
  });

  const levelInfo = levelForXp(outcome.totalXp);

  return NextResponse.json({
    gameId: game.id,
    score,
    correctCount,
    totalRounds: game.totalRounds,
    mode: game.mode,
    genre: game.genre,
    isDaily,
    dailyDate: game.dailyDate,
    // progression
    xpEarned: outcome.xpEarned,
    totalXp: outcome.totalXp,
    level: levelInfo.level,
    leveledUp: levelInfo.level > beforeLevel,
    rank: rankForLevel(levelInfo.level).title,
    progressPct: levelInfo.progressPct,
    xpToNextLevel: levelInfo.xpToNextLevel,
    dailyStreak: outcome.dailyStreak,
  });
}
