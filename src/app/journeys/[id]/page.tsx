import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { journeyById, journeyProgress, stageUnlocked, MAX_STAGE_STARS, type StarsMap } from "@/lib/journeys";

export const dynamic = "force-dynamic";

function Stars({ n, accent }: { n: number; accent: string }) {
  return (
    <span className="text-lg tracking-widest" aria-label={`${n} of ${MAX_STAGE_STARS} stars`}>
      <span style={{ color: accent }}>{"★".repeat(n)}</span>
      <span className="text-line">{"★".repeat(MAX_STAGE_STARS - n)}</span>
    </span>
  );
}

export default async function JourneyMapPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  const journey = journeyById(params.id);
  if (!journey) notFound();

  const rows = await prisma.userStageProgress.findMany({
    where: { userId: session.user.id, stageId: { in: journey.stages.map((s) => s.id) } },
    select: { stageId: true, stars: true },
  });
  const stars: StarsMap = Object.fromEntries(rows.map((r) => [r.stageId, r.stars]));
  const p = journeyProgress(journey, stars);

  return (
    <main className="mx-auto max-w-md px-5 pb-14 pt-8 lg:max-w-2xl lg:px-8">
      <div className="mb-6">
        <Link href="/journeys" className="text-sm text-muted hover:text-ink">
          ← All journeys
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-4xl" aria-hidden>{journey.emoji}</span>
        <div>
          <h1 className="font-display text-3xl font-bold">{journey.title}</h1>
          <p className="text-sm text-muted">
            {p.stagesCleared}/{journey.stages.length} stages · ★ {p.totalStars}/{p.maxStars}
            {p.complete ? " · complete 🏆" : ""}
          </p>
        </div>
      </div>
      <p className="mt-3 text-muted">{journey.description}</p>

      <ol className="mt-8 space-y-3">
        {journey.stages.map((stage, i) => {
          const earned = stars[stage.id] ?? 0;
          const unlocked = stageUnlocked(journey, i, stars);
          const isNext = p.nextStageId === stage.id;
          return (
            <li
              key={stage.id}
              className={`card flex items-center gap-4 p-4 ${unlocked ? "" : "opacity-55"} ${
                isNext ? "ring-2 ring-offset-2 ring-offset-bg" : ""
              }`}
              style={isNext ? { boxShadow: `0 0 0 2px ${journey.accent}` } : undefined}
            >
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl font-display text-lg font-bold"
                style={{ background: unlocked ? `${journey.accent}22` : "transparent", color: journey.accent }}
              >
                {unlocked ? i + 1 : "🔒"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-display font-semibold">{stage.title}</div>
                <div className="mt-0.5">
                  {unlocked ? (
                    <Stars n={earned} accent={journey.accent} />
                  ) : (
                    <span className="text-xs text-muted">Clear the previous stage to unlock</span>
                  )}
                </div>
              </div>
              {unlocked && (
                <Link
                  href={`/play?stage=${stage.id}`}
                  className={`${earned > 0 ? "btn-ghost" : "btn-primary"} shrink-0 px-4 py-2.5 text-sm`}
                >
                  {earned === 0 ? "Play" : earned < MAX_STAGE_STARS ? "Improve" : "Replay"}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </main>
  );
}
