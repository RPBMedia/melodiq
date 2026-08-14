import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Logo } from "@/components/Logo";
import { DashboardCard } from "@/components/DashboardCard";
import { SignOutButton } from "@/components/AuthButtons";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  const best = await prisma.gameSession.aggregate({
    where: { userId: session.user.id, finishedAt: { not: null } },
    _max: { score: true },
    _count: true,
  });

  const firstName = (session.user.name ?? "there").split(" ")[0];

  return (
    <main className="mx-auto max-w-md px-5 pb-12 pt-10 lg:max-w-4xl lg:px-8">
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

      <Link
        href="/play"
        className="btn-primary mt-7 w-full px-6 py-5 text-lg"
      >
        ▶ Start game
      </Link>

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
      </section>
    </main>
  );
}
