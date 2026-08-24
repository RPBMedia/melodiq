import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Logo } from "@/components/Logo";
import { DashboardCard } from "@/components/DashboardCard";
import { SignOutButton } from "@/components/AuthButtons";
import { Onboarding, HowToPlayButton } from "@/components/Onboarding";
import { levelForXp, rankForLevel, todayUTC, streakIsAlive } from "@/lib/progression";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { JOURNEYS, MAX_STAGE_STARS } from "@/lib/journeys";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  const today = todayUTC();
  const [best, me, todaysDaily, achievementsUnlocked, collectedSongs, journeyAgg] = await Promise.all([
    prisma.gameSession.aggregate({
      where: { userId: session.user.id, finishedAt: { not: null } },
      _max: { score: true },
      _count: true,
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { xp: true, dailyStreak: true, lastDailyDate: true },
    }),
    prisma.gameSession.findUnique({
      where: { userId_dailyDate: { userId: session.user.id, dailyDate: today } },
      select: { finishedAt: true, score: true },
    }),
    prisma.userAchievement.count({ where: { userId: session.user.id } }),
    prisma.round.findMany({
      where: { correct: true, gameSession: { userId: session.user.id } },
      distinct: ["songId"],
      select: { songId: true },
    }),
    prisma.userStageProgress.aggregate({
      where: { userId: session.user.id },
      _sum: { stars: true },
    }),
  ]);
  const collectedCount = collectedSongs.length;
  const journeyStars = journeyAgg._sum.stars ?? 0;
  const journeyMaxStars = JOURNEYS.reduce((n, j) => n + j.stages.length * MAX_STAGE_STARS, 0);

  const firstName = (session.user.name ?? "there").split(" ")[0];

  // Progression (M3). Level/rank are derived from stored XP; the streak greys
  // out if it isn't alive (played today or yesterday).
  const xp = me?.xp ?? 0;
  const level = levelForXp(xp);
  const rank = rankForLevel(level.level);
  const streakAlive = streakIsAlive(me?.lastDailyDate ?? null, today);
  const dailyStreak = streakAlive ? me?.dailyStreak ?? 0 : 0;
  const dailyPlayed = !!todaysDaily?.finishedAt;

  return (
    <main className="mx-auto max-w-md px-5 pb-12 pt-10 lg:max-w-4xl lg:px-8">
      <Onboarding />
      <header className="flex items-center justify-between">
        <Logo className="text-xl" />
        <div className="flex items-center gap-3">
          {session.user.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={session.user.image}
              alt=""
              className="h-9 w-9 rounded-full border border-line"
            />
          )}
          <SignOutButton />
        </div>
      </header>

      <section className="mt-8">
        <h1 className="font-display text-3xl font-bold">Hey {firstName} 👋</h1>
        <p className="mt-1 text-muted">
          {best._count > 0
            ? `Your best so far is ${best._max.score} points. Beat it?`
            : "Ready for your first round?"}
        </p>
      </section>

      {/* Progression: level, DJ-rank, XP bar */}
      <section className="card mt-6 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted">{rank.title}</div>
            <div className="font-display text-2xl font-bold">Level {level.level}</div>
          </div>
          <div className="text-right">
            <div className="font-display text-lg font-bold tabular-nums text-cyan">
              {xp.toLocaleString()} XP
            </div>
            {dailyStreak > 0 && <div className="text-sm">🔥 {dailyStreak}-day streak</div>}
          </div>
        </div>
        <div
          className="mt-3 h-2 overflow-hidden rounded-full bg-line"
          role="progressbar"
          aria-valuenow={level.progressPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${level.progressPct}% toward level ${level.level + 1}`}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-magenta to-violet"
            style={{ width: `${level.progressPct}%` }}
          />
        </div>
        <div className="mt-1.5 flex justify-between text-xs text-muted">
          <span>Level {level.level}</span>
          <span>
            {level.xpToNextLevel.toLocaleString()} XP to level {level.level + 1}
            {rank.nextTitle ? ` · next rank: ${rank.nextTitle}` : ""}
          </span>
        </div>
      </section>

      {/* Daily Challenge — the core habit loop */}
      <section className="card mt-6 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-magenta">🔥 Daily Challenge</div>
            <div className="font-display text-xl font-bold">
              {dailyPlayed ? "Done for today ✓" : "Same 10 tracks for everyone"}
            </div>
            <p className="mt-1 text-sm text-muted">
              {dailyPlayed
                ? `You scored ${todaysDaily?.score ?? 0}${dailyStreak > 0 ? ` · 🔥 ${dailyStreak}-day streak` : ""}. Back tomorrow to keep it going.`
                : "One shot, seeded by today's date. Builds your daily streak and earns 1.5× XP."}
            </p>
          </div>
          {dailyPlayed ? (
            <Link href="/leaderboard" className="btn-ghost shrink-0 px-4 py-3 text-sm">
              Leaderboard
            </Link>
          ) : (
            <Link href="/play?daily=1" className="btn-primary shrink-0 px-5 py-3">
              Play
            </Link>
          )}
        </div>
      </section>

      <Link
        href="/play"
        className="btn-primary mt-7 w-full px-6 py-5 text-lg"
      >
        ▶ Start game
      </Link>
      <div className="mt-3 text-center">
        <HowToPlayButton />
      </div>

      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        <DashboardCard
          index={0}
          href="/play"
          title="Play"
          desc="10 songs, 30 seconds each"
          accent="linear-gradient(135deg,#FF2D87,#8B5CF6)"
          icon={<span className="text-xl">🎧</span>}
        />
        <DashboardCard
          index={1}
          href="/leaderboard"
          title="Leaderboard"
          desc="See the top guessers"
          accent="linear-gradient(135deg,#8B5CF6,#22D3EE)"
          icon={<span className="text-xl">🏆</span>}
        />
        <DashboardCard
          index={2}
          href="/stats"
          title="My stats"
          desc="Track your progress"
          accent="linear-gradient(135deg,#22D3EE,#34D399)"
          icon={<span className="text-xl">📈</span>}
        />
        <DashboardCard
          index={3}
          href="/achievements"
          title="Achievements"
          desc={`${achievementsUnlocked}/${ACHIEVEMENTS.length} unlocked`}
          accent="linear-gradient(135deg,#FBBF24,#FF2D87)"
          icon={<span className="text-xl">🏅</span>}
        />
        <DashboardCard
          index={4}
          href="/collection"
          title="Collection"
          desc={`${collectedCount} track${collectedCount === 1 ? "" : "s"} collected`}
          accent="linear-gradient(135deg,#34D399,#8B5CF6)"
          icon={<span className="text-xl">💿</span>}
        />
        <DashboardCard
          index={5}
          href="/journeys"
          title="Journeys"
          desc={`★ ${journeyStars}/${journeyMaxStars} · genre tours`}
          accent="linear-gradient(135deg,#8B5CF6,#FB7185)"
          icon={<span className="text-xl">🗺️</span>}
        />
        <DashboardCard
          index={6}
          href="/play?mode=survival"
          title="Survival"
          desc="3 lives · how far can you go?"
          accent="linear-gradient(135deg,#FB7185,#FF2D87)"
          icon={<span className="text-xl">💀</span>}
        />
        <DashboardCard
          index={7}
          href="/play?mode=speed"
          title="Speed"
          desc="Name it in the first seconds"
          accent="linear-gradient(135deg,#FBBF24,#22D3EE)"
          icon={<span className="text-xl">⚡</span>}
        />
      </section>
    </main>
  );
}
