import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateMatchSeed, clampMaxPlayers, MATCH_ROUNDS } from "@/lib/versus";

export const dynamic = "force-dynamic";

// Create a Head-to-Head match. The creator becomes the first player; their turn
// (and everyone else's) is a seeded game built on first play. Always
// multiple-choice, and hints are disabled for match games.
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let body: { genre?: string | null; maxPlayers?: number } = {};
  try {
    body = await req.json();
  } catch {
    // default: all genres, 1v1
  }
  const genre = body.genre && body.genre !== "all" ? body.genre : null;
  const maxPlayers = clampMaxPlayers(body.maxPlayers ?? 2);

  const match = await prisma.match.create({
    data: {
      creatorId: session.user.id,
      seed: generateMatchSeed(),
      genre,
      mode: "multiple",
      totalRounds: MATCH_ROUNDS,
      maxPlayers,
      players: { create: { userId: session.user.id } },
    },
  });

  return NextResponse.json({ matchId: match.id });
}
