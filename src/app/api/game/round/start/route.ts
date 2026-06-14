import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Stamp the server-side start time for a round. The score is later derived
// from this timestamp, so timing can't be faked by the client.
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let body: { gameId?: string; order?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const { gameId, order } = body;
  if (!gameId || typeof order !== "number") {
    return NextResponse.json({ error: "Missing round info." }, { status: 400 });
  }

  const game = await prisma.gameSession.findUnique({ where: { id: gameId } });
  if (!game || game.userId !== session.user.id) {
    return NextResponse.json({ error: "Game not found." }, { status: 404 });
  }
  if (game.finishedAt) {
    return NextResponse.json({ error: "Game already finished." }, { status: 409 });
  }

  // Only set startedAt the first time (replays of the same round can't reset it).
  const round = await prisma.round.findUnique({
    where: { gameSessionId_order: { gameSessionId: gameId, order } },
  });
  if (!round) {
    return NextResponse.json({ error: "Round not found." }, { status: 404 });
  }
  if (!round.startedAt) {
    await prisma.round.update({
      where: { id: round.id },
      data: { startedAt: new Date() },
    });
  }

  return NextResponse.json({ ok: true });
}
