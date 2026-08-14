"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Recent = {
  id: string;
  score: number;
  correctCount: number;
  totalRounds: number;
  createdAt: string;
  mode: string;
  genre: string | null;
};
type Stats = {
  gamesPlayed: number;
  bestScore: number;
  avgScore: number;
  accuracy: number;
  recent: Recent[];
};

export function StatsView() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => (d.error ? setError(d.error) : setStats(d)))
      .catch(() => setError("Could not load your stats."));
  }, []);

  if (error) return <p className="mt-8 text-bad">{error}</p>;
  if (!stats) return <p className="mt-8 text-muted">Loading…</p>;

  if (stats.gamesPlayed === 0)
    return (
      <div className="card mt-8 p-8 text-center">
        <p className="text-muted">No games yet.</p>
        <Link href="/play" className="btn-primary mt-4 px-6 py-3">Play your first game</Link>
      </div>
    );

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Big label="Best score" value={stats.bestScore} />
        <Big label="Games played" value={stats.gamesPlayed} />
        <Big label="Avg score" value={stats.avgScore} />
        <Big label="Accuracy" value={`${stats.accuracy}%`} />
      </div>

      <h2 className="mt-8 font-display text-lg font-semibold">Recent games</h2>
      <ul className="mt-3 flex flex-col gap-2">
        {stats.recent.map((g) => (
          <li key={g.id} className="card flex items-center justify-between p-4">
            <div>
              <div className="font-medium">{g.correctCount}/{g.totalRounds} correct</div>
              <div className="text-xs text-muted">
                {g.genre ?? "All genres"}
                {g.mode === "typing" ? " · Typed" : " · Multiple choice"} ·{" "}
                {new Date(g.createdAt).toLocaleDateString(undefined, {
                  month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
                })}
              </div>
            </div>
            <div className="font-display text-xl font-bold grad-text tabular-nums">{g.score}</div>
          </li>
        ))}
      </ul>
    </>
  );
}

function Big({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card p-5">
      <div className="text-xs uppercase tracking-wider text-muted">{label}</div>
      <div className="mt-1 font-display text-3xl font-bold tabular-nums">{value}</div>
    </div>
  );
}
