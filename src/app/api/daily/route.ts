import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildGame } from "@/lib/game";
import { todayUTC, streakIsAlive } from "@/lib/progression";

export const dynamic = "force-dynamic";

const DAILY_COUNT = 10;

// GET — today's Daily Challenge status for the signed-in user.
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  const today = todayUTC();
  const [user, todays] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { dailyStreak: true, lastDailyDate: true },
    }),
    prisma.gameSession.findUnique({
      where: { userId_dailyDate: { userId: session.user.id, dailyDate: today } },
      select: { id: true, score: true, correctCount: true, totalRounds: true, finishedAt: true },
    }),
  ]);

  const played = !!todays?.finishedAt;
  const alive = streakIsAlive(user?.lastDailyDate ?? null, today);
  return NextResponse.json({
    date: today,
    played,
    inProgress: !!todays && !todays.finishedAt,
    result: played
      ? { gameId: todays!.id, score: todays!.score, correctCount: todays!.correctCount, totalRounds: todays!.totalRounds }
      : null,
    dailyStreak: alive ? user?.dailyStreak ?? 0 : 0,
    streakAlive: alive,
  });
}

// POST — start (or resume) today's Daily Challenge. Same seeded clip set for
// everyone; one per user per day (enforced by the unique constraint).
export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  const today = todayUTC();

  const existing = await prisma.gameSession.findUnique({
    where: { userId_dailyDate: { userId: session.user.id, dailyDate: today } },
    select: { id: true, finishedAt: true },
  });
  if (existing?.finishedAt) {
    return NextResponse.json(
      { error: "You've already played today's Daily Challenge.", played: true, date: today },
      { status: 409 },
    );
  }

  try {
    // Deterministic build seeded by the date — identical for every player.
    const { rounds, titlePool } = await buildGame(null, DAILY_COUNT, today);

    // Resume an abandoned-but-unfinished daily on the same id; otherwise create.
    // The build is deterministic, so the stored rounds already match this payload.
    const gameId =
      existing?.id ??
      (
        await prisma.gameSession.create({
          data: {
            userId: session.user.id,
            totalRounds: rounds.length,
            mode: "multiple",
            genre: null,
            dailyDate: today,
            rounds: { create: rounds.map((r) => ({ songId: r.songId, order: r.order })) },
          },
          select: { id: true },
        })
      ).id;

    return NextResponse.json({
      gameId,
      mode: "multiple",
      genre: null,
      daily: true,
      date: today,
      titlePool,
      rounds: rounds.map((r) => ({
        order: r.order,
        songId: r.songId,
        previewUrl: r.previewUrl,
        coverColor: r.coverColor,
        artist: r.artist,
        options: r.options,
      })),
    });
  } catch (err) {
    console.error("start daily failed:", err);
    return NextResponse.json(
      { error: "Could not start the Daily Challenge. Is the song pool seeded?" },
      { status: 500 },
    );
  }
}
