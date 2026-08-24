import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { JOURNEYS, journeyProgress, type StarsMap } from "@/lib/journeys";

export const dynamic = "force-dynamic";

export default async function JourneysPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  const rows = await prisma.userStageProgress.findMany({
    where: { userId: session.user.id },
    select: { stageId: true, stars: true },
  });
  const stars: StarsMap = Object.fromEntries(rows.map((r) => [r.stageId, r.stars]));

  return (
    <main className="mx-auto max-w-md px-5 pb-14 pt-8 lg:max-w-4xl lg:px-8">
      <div className="mb-6">
        <Link href="/dashboard" className="text-sm text-muted hover:text-ink">
          ← Dashboard
        </Link>
      </div>

      <h1 className="font-display text-3xl font-bold">Journeys</h1>
      <p className="mt-1 text-muted">
        Themed tours through a genre&rsquo;s eras. Clear a stage to unlock the next; 3 stars is mastery.
      </p>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        {JOURNEYS.map((j) => {
          const p = journeyProgress(j, stars);
          const pct = Math.round((100 * p.totalStars) / p.maxStars);
          return (
            <Link
              key={j.id}
              href={`/journeys/${j.id}`}
              className="card overflow-hidden p-0 transition-transform active:scale-[0.99]"
            >
              <div className="h-1.5 w-full" style={{ background: j.accent }} />
              <div className="p-5">
                <div className="flex items-center gap-3">
                  <span className="text-3xl" aria-hidden>{j.emoji}</span>
                  <div>
                    <div className="font-display text-lg font-bold">{j.title}</div>
                    <div className="text-xs text-muted">
                      {p.stagesCleared}/{j.stages.length} stages · {p.complete ? "complete 🏆" : "in progress"}
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted">{j.description}</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-line">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: j.accent }} />
                  </div>
                  <span className="text-sm tabular-nums text-muted">
                    ★ {p.totalStars}/{p.maxStars}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
