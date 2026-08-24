import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { scoreAnswerFor, roundSecondsForMode, pointsForYearGuess, yearGuessCorrect } from "@/lib/scoring";
import { titlesMatch } from "@/lib/match";
import { hintsCost } from "@/lib/hints";

export const dynamic = "force-dynamic";

// Score a single round using server clocks only. Returns the correct answer so
// the client can reveal it (the title was never sent to the client before now).
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let body: { gameId?: string; order?: number; guessedTitle?: string | null; guessedYear?: number | null };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const { gameId, order, guessedTitle } = body;
  if (!gameId || typeof order !== "number") {
    return NextResponse.json({ error: "Missing round info." }, { status: 400 });
  }

  const game = await prisma.gameSession.findUnique({ where: { id: gameId } });
  if (!game || game.userId !== session.user.id) {
    return NextResponse.json({ error: "Game not found." }, { status: 404 });
  }

  const round = await prisma.round.findUnique({
    where: { gameSessionId_order: { gameSessionId: gameId, order } },
    include: { song: true },
  });
  if (!round) {
    return NextResponse.json({ error: "Round not found." }, { status: 404 });
  }
  if (round.answeredAt) {
    return NextResponse.json({ error: "Round already answered." }, { status: 409 });
  }

  // Elapsed time is the gap between the server-stamped start and now. If the
  // round was never legitimately started, treat it as the worst case (full
  // time) rather than instant, so the start step can't be skipped for points.
  const capMs = roundSecondsForMode(game.mode) * 1000;
  const now = Date.now();
  const startedMs = round.startedAt ? round.startedAt.getTime() : now - capMs;
  const elapsedMs = Math.max(0, Math.min(capMs, now - startedMs));

  // Score by mode. "year" scores by how close the guessed release year is;
  // "typing" fuzzy-matches the title; everything else is exact multiple-choice.
  let correct: boolean;
  let points: number;
  let guessStore: string | null;
  if (game.mode === "year") {
    const actual = round.song.year;
    const gy = typeof body.guessedYear === "number" ? Math.round(body.guessedYear) : null;
    if (actual == null || gy == null) {
      correct = false;
      points = 0;
    } else {
      correct = yearGuessCorrect(gy, actual);
      points = pointsForYearGuess(gy, actual);
    }
    guessStore = gy != null ? String(gy) : null;
  } else {
    correct =
      game.mode === "typing"
        ? titlesMatch(guessedTitle ?? null, round.song.title)
        : guessedTitle === round.song.title;
    points = scoreAnswerFor(game.mode, correct, elapsedMs);
    guessStore = guessedTitle ?? null;
  }

  // Hints erode the round score (server-recorded via /round/hint). Never below 0.
  if (round.hintsUsed > 0) {
    points = Math.max(0, points - hintsCost(round.hintsUsed));
  }

  await prisma.round.update({
    where: { id: round.id },
    data: {
      guessedTitle: guessStore,
      correct,
      points,
      timeMs: Math.round(elapsedMs),
      answeredAt: new Date(),
    },
  });

  return NextResponse.json({
    correct,
    points,
    elapsedMs: Math.round(elapsedMs),
    answer: round.song.title,
    artist: round.song.artist,
    year: round.song.year,
  });
}
