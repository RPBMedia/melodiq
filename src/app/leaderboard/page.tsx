import Link from "next/link";
import { Logo } from "@/components/Logo";
import { LeaderboardList } from "@/components/LeaderboardList";

export const metadata = { title: "Leaderboard — MelodIQ" };

// Public page — no auth required.
export default function LeaderboardPage() {
  return (
    <main className="mx-auto max-w-md px-5 pb-12 pt-10 lg:max-w-2xl lg:px-8">
      <header className="flex items-center justify-between">
        <Logo className="text-xl" />
        <Link href="/dashboard" className="text-sm text-muted hover:text-ink">
          ← Dashboard
        </Link>
      </header>
      <h1 className="mt-8 font-display text-3xl font-bold">🏆 Leaderboard</h1>
      <p className="mt-1 text-muted">Top scores from every player.</p>
      <LeaderboardList />
    </main>
  );
}
