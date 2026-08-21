import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ACHIEVEMENTS } from "@/lib/achievements";

export const dynamic = "force-dynamic";

export default async function AchievementsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  const unlocked = await prisma.userAchievement.findMany({
    where: { userId: session.user.id },
    select: { achievementId: true },
  });
  const have = new Set(unlocked.map((u) => u.achievementId));
  const unlockedCount = have.size;
  const pct = Math.round((100 * unlockedCount) / ACHIEVEMENTS.length);

  return (
    <main className="mx-auto max-w-md px-5 pb-12 pt-8 lg:max-w-4xl lg:px-8">
      <div className="mb-6">
        <Link href="/dashboard" className="text-sm text-muted hover:text-ink">
          ← Dashboard
        </Link>
      </div>

      <h1 className="font-display text-3xl font-bold">Achievements</h1>
      <p className="mt-1 text-muted">
        {unlockedCount} of {ACHIEVEMENTS.length} unlocked
      </p>
      <div
        className="mt-3 h-2 overflow-hidden rounded-full bg-line"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${pct}% of achievements unlocked`}
      >
        <div className="h-full rounded-full bg-gradient-to-r from-magenta to-violet" style={{ width: `${pct}%` }} />
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        {ACHIEVEMENTS.map((a) => {
          const on = have.has(a.id);
          return (
            <div
              key={a.id}
              className={`card flex items-center gap-4 p-4 ${on ? "" : "opacity-55"}`}
            >
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl ${
                  on ? "bg-violet/15" : "bg-surface2"
                }`}
                aria-hidden
              >
                {on ? a.icon : "🔒"}
              </span>
              <div className="min-w-0">
                <div className="font-display font-semibold">{a.name}</div>
                <div className="text-sm text-muted">{a.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
