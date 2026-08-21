import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { levelForXp, rankForLevel, todayUTC, streakIsAlive } from "@/lib/progression";

export const dynamic = "force-dynamic";

// The signed-in user's progression, derived from their stored XP + daily-streak
// fields. All level/rank math lives in progression.ts (single source of truth).
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { xp: true, dailyStreak: true, lastDailyDate: true },
  });

  const xp = user?.xp ?? 0;
  const info = levelForXp(xp);
  const rank = rankForLevel(info.level);
  const today = todayUTC();
  const alive = streakIsAlive(user?.lastDailyDate ?? null, today);

  return NextResponse.json({
    xp,
    level: info.level,
    rank: rank.title,
    nextRank: rank.nextTitle,
    levelsToNextRank: rank.levelsToNext,
    xpIntoLevel: info.xpIntoLevel,
    xpForNextLevel: info.xpForNextLevel,
    xpToNextLevel: info.xpToNextLevel,
    progressPct: info.progressPct,
    dailyStreak: alive ? user?.dailyStreak ?? 0 : 0,
    streakAlive: alive,
    playedDailyToday: (user?.lastDailyDate ?? null) === today,
  });
}
