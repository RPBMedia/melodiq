import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ACHIEVEMENTS } from "@/lib/achievements";

export const dynamic = "force-dynamic";

// The full catalog with the signed-in user's unlock state.
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  const unlocked = await prisma.userAchievement.findMany({
    where: { userId: session.user.id },
    select: { achievementId: true, unlockedAt: true },
  });
  const map = new Map(unlocked.map((u) => [u.achievementId, u.unlockedAt]));
  return NextResponse.json({
    total: ACHIEVEMENTS.length,
    unlockedCount: unlocked.length,
    achievements: ACHIEVEMENTS.map((a) => ({
      ...a,
      unlocked: map.has(a.id),
      unlockedAt: map.get(a.id) ?? null,
    })),
  });
}
