import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateMatchSeed, MATCH_ROUNDS } from "@/lib/versus";

export const dynamic = "force-dynamic";

// Create a Head-to-Head match. The creator becomes the first player; their turn
// (and everyone else's) is a seeded game built on first play. Always
// multiple-choice, and hints are disabled for match games.
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let body: { genre?: string | null } = {};
  try {
    body = await req.json();
  } catch {
    // default: all genres
  }
  const genre = body.genre && body.genre !== "all" ? body.genre : null;

  const match = await prisma.match.create({
    data: {
      creatorId: session.user.id,
      seed: generateMatchSeed(),
      genre,
      mode: "multiple",
      totalRounds: MATCH_ROUNDS,
      players: { create: { userId: session.user.id } },
    },
  });

  return NextResponse.json({ matchId: match.id });
}
