import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rankMatch, type MatchPlayerView } from "@/lib/versus";
import { genreLabel } from "@/lib/genres";

export const dynamic = "force-dynamic";

export default async function MatchesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");
  const meId = session.user.id;

  const matches = await prisma.match.findMany({
    where: { players: { some: { userId: meId } } },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { players: { include: { user: { select: { name: true, image: true } } } } },
  });

  return (
    <main className="mx-auto max-w-md px-5 pb-14 pt-8 lg:max-w-2xl lg:px-8">
      <div className="mb-6">
        <Link href="/dashboard" className="text-sm text-muted hover:text-ink">
          ← Dashboard
        </Link>
      </div>

      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold">🎮 Your matches</h1>
        <Link href="/match/new" className="btn-primary shrink-0 px-4 py-2.5 text-sm">
          + New match
        </Link>
      </div>

      {matches.length === 0 ? (
        <div className="card mt-8 p-8 text-center">
          <div className="text-4xl">🎮</div>
          <p className="mt-3 font-display text-lg font-semibold">No matches yet</p>
          <p className="mt-1 text-sm text-muted">Challenge a friend to the same 10 clips — best score wins.</p>
          <Link href="/match/new" className="btn-primary mt-5 inline-block px-6 py-3">
            Start a match
          </Link>
        </div>
      ) : (
        <ul className="mt-7 flex flex-col gap-2">
          {matches.map((m) => {
            const views: MatchPlayerView[] = m.players.map((p) => ({
              userId: p.userId,
              name: p.user.name ?? "Player",
              image: p.user.image ?? null,
              score: p.score,
              correctCount: p.correctCount,
              finished: !!p.finishedAt,
              isCreator: p.userId === m.creatorId,
            }));
            const result = rankMatch(views);
            const mine = m.players.find((p) => p.userId === meId);
            const iFinished = !!mine?.finishedAt;

            let badge: { text: string; cls: string };
            if (!iFinished) badge = { text: "Your turn", cls: "text-cyan border-cyan/40 bg-cyan/10" };
            else if (!result.complete) badge = { text: "Waiting", cls: "text-muted border-line bg-surface2/50" };
            else if (result.winners.length > 1 && result.winners.includes(meId))
              badge = { text: "Tie 🤝", cls: "text-ink border-line bg-surface2/50" };
            else if (result.winners[0] === meId) badge = { text: "Won 🏆", cls: "text-good border-good/40 bg-good/10" };
            else badge = { text: "Lost", cls: "text-bad border-bad/40 bg-bad/10" };

            const opponents = views.filter((v) => v.userId !== meId).map((v) => v.name.split(" ")[0]);
            const oppText = opponents.length ? `vs ${opponents.join(", ")}` : "waiting for players";

            return (
              <li key={m.id}>
                <Link
                  href={`/m/${m.id}`}
                  className="card flex items-center gap-3 p-4 transition-transform active:scale-[0.99]"
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">
                      {m.genre ? genreLabel(m.genre) : "All genres"}
                      {m.maxPlayers > 2 ? ` · up to ${m.maxPlayers}` : ""}
                    </div>
                    <div className="truncate text-xs text-muted">
                      {oppText} · {new Date(m.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </div>
                  </div>
                  {iFinished && <div className="font-display text-lg font-bold tabular-nums text-ink">{mine?.score}</div>}
                  <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${badge.cls}`}>
                    {badge.text}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
