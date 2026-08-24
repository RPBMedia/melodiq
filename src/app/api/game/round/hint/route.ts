import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { HINT_LADDER, availableHintLevels, hintContent, pickOptionToRemove } from "@/lib/hints";

export const dynamic = "force-dynamic";

// Buy the next hint for a round. Hints are bought in ladder order; the reveal
// content is computed server-side (never trust the client), usage is recorded on
// the Round so scoring can deduct the cost at answer time, and hints are only
// available in single-player Classic modes.
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let body: { gameId?: string; order?: number; options?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const { gameId, order, options } = body;
  if (!gameId || typeof order !== "number") {
    return NextResponse.json({ error: "Missing round info." }, { status: 400 });
  }

  const game = await prisma.gameSession.findUnique({ where: { id: gameId } });
  if (!game || game.userId !== session.user.id) {
    return NextResponse.json({ error: "Game not found." }, { status: 404 });
  }

  // Single-player only: Head-to-Head matches never offer hints, so all players
  // compete on equal terms. Enforced here on the server, not just in the UI.
  if (game.matchId) {
    return NextResponse.json({ error: "Hints are disabled in Head-to-Head." }, { status: 400 });
  }
  const maxLevels = availableHintLevels(game.mode);
  if (maxLevels === 0) {
    return NextResponse.json({ error: "Hints aren't available in this mode." }, { status: 400 });
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

  const level = round.hintsUsed + 1;
  if (level > maxLevels) {
    return NextResponse.json({ error: "No more hints for this round." }, { status: 409 });
  }
  const step = HINT_LADDER[level - 1];

  let value: string;
  if (step.kind === "removeOption") {
    const opts = Array.isArray(options) ? options.filter((o): o is string => typeof o === "string") : [];
    const remove = pickOptionToRemove(opts, round.song.title);
    if (!remove) {
      return NextResponse.json({ error: "Nothing left to remove." }, { status: 400 });
    }
    value = remove;
  } else {
    value = hintContent(step.kind, round.song);
  }

  await prisma.round.update({ where: { id: round.id }, data: { hintsUsed: level } });

  return NextResponse.json({ level, kind: step.kind, value, cost: step.cost, maxLevels });
}
