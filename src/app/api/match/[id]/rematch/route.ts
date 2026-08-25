import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateMatchSeed } from "@/lib/versus";

export const dynamic = "force-dynamic";

// Rematch: clone a finished match's settings (genre, size, length) into a fresh
// one with a NEW seed, created by whoever clicked. Only a participant can rematch.
export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  const userId = session.user.id;

  const src = await prisma.match.findUnique({
    where: { id: params.id },
    include: { players: { select: { userId: true } } },
  });
  if (!src) {
    return NextResponse.json({ error: "Match not found." }, { status: 404 });
  }
  if (!src.players.some((p) => p.userId === userId)) {
    return NextResponse.json({ error: "Only players in the match can rematch." }, { status: 403 });
  }

  const match = await prisma.match.create({
    data: {
      creatorId: userId,
      seed: generateMatchSeed(),
      genre: src.genre,
      mode: src.mode,
      totalRounds: src.totalRounds,
      maxPlayers: src.maxPlayers,
      players: { create: { userId } },
    },
  });

  return NextResponse.json({ matchId: match.id });
}
