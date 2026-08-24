import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildGame } from "@/lib/game";
import { SONGS_PER_GAME, SURVIVAL_STACK } from "@/lib/scoring";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let body: { genre?: string | null; mode?: string; count?: number } = {};
  try {
    body = await req.json();
  } catch {
    // empty body is fine — defaults to all genres, multiple choice, 10 songs
  }
  const genre = body.genre && body.genre !== "all" ? body.genre : null;
  const mode = ["typing", "survival", "speed"].includes(body.mode ?? "")
    ? (body.mode as string)
    : "multiple";

  // Survival plays a deep, difficulty-ramped stack (ends when lives run out);
  // Speed is a normal-length game; Classic honours the chosen length.
  let count: number;
  let ramp = false;
  if (mode === "survival") {
    count = SURVIVAL_STACK;
    ramp = true;
  } else if (mode === "speed") {
    count = SONGS_PER_GAME;
  } else {
    count = [10, 20, 30].includes(body.count ?? 10) ? (body.count as number) : 10;
  }

  try {
    const { rounds, titlePool } = await buildGame(genre, count, undefined, ramp);

    const game = await prisma.gameSession.create({
      data: {
        userId: session.user.id,
        totalRounds: rounds.length,
        mode,
        genre,
        rounds: {
          create: rounds.map((r) => ({ songId: r.songId, order: r.order })),
        },
      },
    });

    return NextResponse.json({
      gameId: game.id,
      mode,
      genre,
      titlePool,
      // Never include the correct title here.
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
    console.error("start game failed:", err);
    return NextResponse.json(
      { error: "Could not start a game. Is the song pool seeded?" },
      { status: 500 },
    );
  }
}
