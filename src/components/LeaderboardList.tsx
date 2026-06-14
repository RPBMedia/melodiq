"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Entry = {
  rank: number;
  name: string;
  image: string | null;
  score: number;
  correctCount: number;
  totalRounds: number;
  mode: string;
  genre: string | null;
  date: string;
};

export function LeaderboardList() {
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setEntries(d.entries);
      })
      .catch(() => setError("Could not load the leaderboard."));
  }, []);

  if (error) return <p className="mt-8 text-bad">{error}</p>;
  if (!entries) return <p className="mt-8 text-muted">Loading scores…</p>;
  if (entries.length === 0)
    return (
      <div className="card mt-8 p-8 text-center">
        <p className="text-muted">No scores yet. Be the first to play a game!</p>
      </div>
    );

  const medal = (rank: number) =>
    rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `${rank}`;

  return (
    <ul className="mt-6 flex flex-col gap-2">
      {entries.map((e, i) => (
        <motion.li
          key={`${e.rank}-${e.date}`}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: Math.min(i * 0.03, 0.4) }}
          className={`card flex items-center gap-3 p-3 ${
            e.rank <= 3 ? "border-violet/50" : ""
          }`}
        >
          <div className="w-8 text-center font-display text-lg font-bold tabular-nums">
            {medal(e.rank)}
          </div>
          {e.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={e.image} alt="" className="h-10 w-10 rounded-full border border-line" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface2 text-muted">
              {e.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="truncate font-medium">{e.name}</div>
            <div className="text-xs text-muted">
              {e.correctCount}/{e.totalRounds} correct ·{" "}
              {new Date(e.date).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
              {" · "}
              {e.genre ?? "All"}
              {e.mode === "typing" ? " · Typed" : ""}
            </div>
          </div>
          <div className="font-display text-xl font-bold grad-text tabular-nums">
            {e.score}
          </div>
        </motion.li>
      ))}
    </ul>
  );
}
