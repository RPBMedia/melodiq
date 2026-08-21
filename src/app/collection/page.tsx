import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildCollection, type CollectedRow } from "@/lib/collection";

export const dynamic = "force-dynamic";

export default async function CollectionPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");
  const userId = session.user.id;

  // A track is "collected" the first time it's guessed right. Best time = the
  // fastest correct guess; timesCorrect = how often it's been nailed. All
  // derived from Round history — no separate collection table.
  const [correct, genreTotals] = await Promise.all([
    prisma.round.groupBy({
      by: ["songId"],
      where: { correct: true, timeMs: { gt: 0 }, gameSession: { userId } },
      _min: { timeMs: true },
      _count: { _all: true },
    }),
    prisma.song.groupBy({ by: ["genre"], _count: { _all: true } }),
  ]);

  const collected: CollectedRow[] = correct.map((r) => ({
    songId: r.songId,
    bestTimeMs: r._min.timeMs ?? 0,
    timesCorrect: r._count._all,
  }));

  const songs = collected.length
    ? await prisma.song.findMany({
        where: { id: { in: collected.map((c) => c.songId) } },
        select: { id: true, title: true, artist: true, genre: true, year: true, coverColor: true },
      })
    : [];

  const view = buildCollection(
    collected,
    songs,
    genreTotals.map((g) => ({ genre: g.genre, total: g._count._all })),
  );

  return (
    <main className="mx-auto max-w-md px-5 pb-14 pt-8 lg:max-w-4xl lg:px-8">
      <div className="mb-6">
        <Link href="/dashboard" className="text-sm text-muted hover:text-ink">
          ← Dashboard
        </Link>
      </div>

      <h1 className="font-display text-3xl font-bold">Record Collection</h1>
      <p className="mt-1 text-muted">
        {view.totalCollected} of {view.totalSongs} tracks collected
      </p>
      <div
        className="mt-3 h-2 overflow-hidden rounded-full bg-line"
        role="progressbar"
        aria-valuenow={view.pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${view.pct}% of tracks collected`}
      >
        <div className="h-full rounded-full bg-gradient-to-r from-magenta to-violet" style={{ width: `${view.pct}%` }} />
      </div>

      {view.totalCollected === 0 ? (
        <div className="card mt-8 p-8 text-center">
          <div className="text-4xl">💿</div>
          <p className="mt-3 font-display text-lg font-semibold">Your shelf is empty</p>
          <p className="mt-1 text-sm text-muted">
            Every track you guess correctly gets pressed to vinyl and added here.
          </p>
          <Link href="/play" className="btn-primary mt-5 inline-block px-6 py-3">
            ▶ Start collecting
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          {view.genres.map((g) => (
            <section key={g.genre}>
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <h2 className="font-display text-lg font-bold">{g.genre}</h2>
                <span className="text-sm tabular-nums text-muted">
                  {g.collected}/{g.total} · {g.pct}%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {g.cards.map((c) => (
                  <div key={c.id} className="card overflow-hidden p-0">
                    <div
                      className="flex aspect-square items-end p-3"
                      style={{
                        backgroundImage: `linear-gradient(145deg, ${c.coverColor}, rgba(0,0,0,0.55))`,
                      }}
                    >
                      <span className="rounded-full bg-black/40 px-2 py-0.5 text-xs font-semibold text-white tabular-nums">
                        ⚡ {c.bestTimeLabel}
                      </span>
                    </div>
                    <div className="p-3">
                      <div className="truncate font-display text-sm font-semibold" title={c.title}>
                        {c.title}
                      </div>
                      <div className="truncate text-xs text-muted" title={c.artist}>
                        {c.artist}
                        {c.year ? ` · ${c.year}` : ""}
                      </div>
                      {c.timesCorrect > 1 && (
                        <div className="mt-1 text-xs text-muted">nailed ×{c.timesCorrect}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
