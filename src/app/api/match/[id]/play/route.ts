import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildGame } from "@/lib/game";
import { MATCH_ACTIVE_MAX } from "@/lib/versus";

export const dynamic = "force-dynamic";

// Start (or resume) the current user's turn in a match. Joins the match if they
// haven't played it yet (up to MATCH_MAX_PLAYERS), builds their seeded game — the
// SAME clip set as everyone else — and returns the play payload. If they already
// finished, says so; an abandoned unfinished game is cleanly restarted.
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  const userId = session.user.id;

  const match = await prisma.match.findUnique({
    where: { id: params.id },
    include: { players: true },
  });
  if (!match) {
    return NextResponse.json({ error: "Match not found." }, { status: 404 });
  }

  let me = match.players.find((p) => p.userId === userId);
  if (!me) {
    // 1v1 for now (schema supports more; see MATCH_ACTIVE_MAX).
    if (match.players.length >= MATCH_ACTIVE_MAX) {
      return NextResponse.json({ error: "This match already has two players." }, { status: 409 });
    }
    me = await prisma.matchPlayer.create({ data: { matchId: match.id, userId } });
  }

  // Already finished -> the client should show the result, not replay.
  if (me.gameSessionId) {
    const existing = await prisma.gameSession.findUnique({
      where: { id: me.gameSessionId },
      select: { finishedAt: true },
    });
    if (existing?.finishedAt) {
      return NextResponse.json({ finished: true, matchId: match.id });
    }
    // Abandoned mid-game: unlink and drop it for a clean restart (nothing scored yet).
    await prisma.matchPlayer.update({ where: { id: me.id }, data: { gameSessionId: null } });
    await prisma.gameSession.delete({ where: { id: me.gameSessionId } }).catch(() => {});
  }

  // Build the seeded clip set (identical for every player) and persist the turn.
  const { rounds, titlePool } = await buildGame(match.genre, match.totalRounds, match.seed);
  const game = await prisma.gameSession.create({
    data: {
      userId,
      totalRounds: rounds.length,
      mode: match.mode,
      genre: match.genre,
      matchId: match.id,
      rounds: { create: rounds.map((r) => ({ songId: r.songId, order: r.order })) },
    },
  });
  await prisma.matchPlayer.update({ where: { id: me.id }, data: { gameSessionId: game.id } });

  return NextResponse.json({
    gameId: game.id,
    mode: match.mode,
    genre: match.genre,
    matchId: match.id,
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
}
