import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Logo } from "@/components/Logo";
import { buildShareText } from "@/lib/share";

export const dynamic = "force-dynamic";

async function loadGame(id: string) {
  return prisma.gameSession.findUnique({
    where: { id },
    select: {
      score: true,
      correctCount: true,
      totalRounds: true,
      genre: true,
      dailyDate: true,
      finishedAt: true,
      user: { select: { name: true } },
    },
  });
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const game = await loadGame(params.id);
  const base = {
    title: "MelodIQ — Name that tune",
    description: "Hear a clip, name the song. The faster you guess, the more you score.",
  };
  if (!game?.finishedAt) {
    return { ...base, twitter: { card: "summary_large_image", ...base } };
  }
  const firstName = (game.user?.name ?? "A player").split(" ")[0];
  const text = buildShareText({
    score: game.score,
    correctCount: game.correctCount,
    totalRounds: game.totalRounds,
    genre: game.genre,
    isDaily: !!game.dailyDate,
  });
  const title = `${firstName} scored ${game.score.toLocaleString()} on MelodIQ`;
  return {
    title,
    description: text,
    openGraph: { title, description: text, type: "website" },
    twitter: { card: "summary_large_image", title, description: text },
  };
}

export default async function SharePage({ params }: { params: { id: string } }) {
  const game = await loadGame(params.id);
  const finished = !!game?.finishedAt;
  const isDaily = !!game?.dailyDate;
  const firstName = (game?.user?.name ?? "A player").split(" ")[0];
  const pct = finished && game ? Math.round((100 * game.correctCount) / game.totalRounds) : 0;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-12">
      <div className="flex justify-center">
        <Logo className="text-2xl" />
      </div>

      <div className="card mt-8 overflow-hidden p-0">
        <div className="h-2 w-full bg-gradient-to-r from-magenta via-violet to-cyan" />
        <div className="p-7 text-center">
          {finished && game ? (
            <>
              <div className="text-sm uppercase tracking-wider text-muted">
                {isDaily ? "🔥 Daily Challenge" : game.genre ?? "All genres"}
              </div>
              <p className="mt-4 text-muted">{firstName} scored</p>
              <div className="font-display text-7xl font-extrabold tabular-nums text-cyan">
                {game.score.toLocaleString()}
              </div>
              <p className="mt-1 text-muted">points</p>
              <div className="mt-6 grid grid-cols-2 gap-3 text-left">
                <div className="rounded-2xl bg-surface2 p-4">
                  <div className="text-xs text-muted">Correct</div>
                  <div className="font-display text-2xl font-bold tabular-nums">
                    {game.correctCount}/{game.totalRounds}
                  </div>
                </div>
                <div className="rounded-2xl bg-surface2 p-4">
                  <div className="text-xs text-muted">Accuracy</div>
                  <div className="font-display text-2xl font-bold tabular-nums">{pct}%</div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="text-5xl">🎧</div>
              <h1 className="mt-4 font-display text-2xl font-bold">Hear a clip. Name the tune.</h1>
              <p className="mt-2 text-muted">
                The faster you guess, the more you score. Think you&rsquo;ve got the ear?
              </p>
            </>
          )}
        </div>
      </div>

      <Link href="/" className="btn-primary mt-6 px-6 py-4 text-center text-lg">
        ▶ {finished ? "Play MelodIQ — beat this score" : "Play MelodIQ"}
      </Link>
      <p className="mt-3 text-center text-xs text-muted">Free · sign in with Google to save your scores</p>
    </main>
  );
}
