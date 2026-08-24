import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Logo } from "@/components/Logo";
import { MatchInvite } from "@/components/MatchInvite";
import { rankMatch, type MatchPlayerView } from "@/lib/versus";
import { genreLabel } from "@/lib/genres";

export const dynamic = "force-dynamic";

async function loadMatch(id: string) {
  return prisma.match.findUnique({
    where: { id },
    include: {
      players: { include: { user: { select: { name: true, image: true } } } },
    },
  });
}

function toViews(match: NonNullable<Awaited<ReturnType<typeof loadMatch>>>): MatchPlayerView[] {
  return match.players.map((p) => ({
    userId: p.userId,
    name: p.user.name ?? "Player",
    image: p.user.image ?? null,
    score: p.score,
    correctCount: p.correctCount,
    finished: !!p.finishedAt,
    isCreator: p.userId === match.creatorId,
  }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const match = await loadMatch(params.id);
  if (!match) return { title: "MelodIQ Head-to-Head" };
  const creator = match.players.find((p) => p.userId === match.creatorId);
  const name = creator?.user.name?.split(" ")[0] ?? "A player";
  const finishedCreator = creator?.finishedAt ? ` They scored ${creator.score}.` : "";
  const title = `${name} challenges you on MelodIQ`;
  const description = `Same 10 clips, best score wins.${finishedCreator} Can you beat them?`;
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function MatchPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const match = await loadMatch(params.id);
  if (!match) notFound();

  const views = toViews(match);
  const result = rankMatch(views);
  const meId = session?.user?.id ?? null;
  const mine = meId ? match.players.find((p) => p.userId === meId) : null;
  const iFinished = !!mine?.finishedAt;
  const creatorName = views.find((v) => v.isCreator)?.name.split(" ")[0] ?? "A player";
  const genreText = match.genre ? genreLabel(match.genre) : "All genres";

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col px-5 py-10">
      <div className="flex items-center justify-between">
        <Logo className="text-xl" />
        <Link href="/dashboard" className="text-sm text-muted hover:text-ink">
          Dashboard
        </Link>
      </div>

      <div className="mt-8">
        <p className="pill">🎮 Head-to-Head · {genreText}</p>
        <h1 className="mt-3 font-display text-3xl font-bold">
          {result.complete ? "Match result" : iFinished ? "Your score is in" : `${creatorName} challenges you`}
        </h1>
        <p className="mt-1 text-muted">Everyone plays the same 10 clips. Best score wins.</p>
      </div>

      {/* Standings */}
      <ol className="mt-7 flex flex-col gap-2">
        {result.players.map((p) => (
          <li
            key={p.userId}
            className={`card flex items-center gap-3 p-3 ${p.isWinner && result.complete ? "border-good/60" : ""}`}
          >
            <div className="w-7 text-center font-display text-lg font-bold tabular-nums">
              {p.rank ? (p.isWinner && result.complete ? "👑" : p.rank) : "…"}
            </div>
            {p.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.image} alt="" className="h-10 w-10 rounded-full border border-line" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface2 text-muted">
                {p.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium">
                {p.name}
                {p.userId === meId ? " (you)" : ""}
                {p.isCreator ? " · host" : ""}
              </div>
              <div className="text-xs text-muted">
                {p.finished ? `${p.correctCount}/${match.totalRounds} correct` : "still playing…"}
              </div>
            </div>
            <div className="font-display text-xl font-bold grad-text tabular-nums">
              {p.finished ? p.score : "—"}
            </div>
          </li>
        ))}
      </ol>

      {result.complete && (
        <p className="mt-4 text-center font-display text-lg font-semibold text-good">
          {result.winners.length > 1
            ? "It's a tie! 🤝"
            : `${views.find((v) => v.userId === result.winners[0])?.name.split(" ")[0]} wins! 🏆`}
        </p>
      )}

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3">
        {!meId ? (
          <Link href="/" className="btn-primary px-6 py-4 text-center">
            Sign in to play
          </Link>
        ) : !iFinished ? (
          <Link href={`/play?match=${match.id}`} className="btn-primary px-6 py-4 text-center text-lg">
            ▶ {mine ? "Play your turn" : "Accept the challenge"}
          </Link>
        ) : !result.complete ? (
          <>
            <p className="text-center text-sm text-muted">Waiting for your challenger… send them the link.</p>
            <MatchInvite path={`/m/${match.id}`} />
          </>
        ) : (
          <MatchInvite path={`/m/${match.id}`} />
        )}
        {meId && (
          <Link href="/match/new" className="btn-ghost px-6 py-3 text-center">
            Start a new match
          </Link>
        )}
      </div>
    </main>
  );
}
