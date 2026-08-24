"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GENRE_FAMILIES } from "@/lib/genres";

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

type Scope = "all" | "week";

export function LeaderboardList() {
  const [scope, setScope] = useState<Scope>("all");
  const [genre, setGenre] = useState<string>("all");
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    setEntries(null);
    setError(null);
    fetch(`/api/leaderboard?scope=${scope}&genre=${encodeURIComponent(genre)}`)
      .then((r) => r.json())
      .then((d) => {
        if (!live) return;
        if (d.error) setError(d.error);
        else setEntries(d.entries);
      })
      .catch(() => live && setError("Could not load the leaderboard."));
    return () => {
      live = false;
    };
  }, [scope, genre]);

  const medal = (rank: number) =>
    rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `${rank}`;

  return (
    <div>
      {/* Controls: all-time vs this week, and a genre filter */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-2xl border border-line bg-surface2/50 p-1">
          {(["all", "week"] as Scope[]).map((s) => (
            <button
              key={s}
              onClick={() => setScope(s)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                scope === s ? "bg-violet/25 text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {s === "all" ? "All-time" : "This week"}
            </button>
          ))}
        </div>
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="rounded-2xl border border-line bg-surface2/50 px-4 py-2.5 text-sm text-ink outline-none focus:border-violet"
          aria-label="Filter by genre"
        >
          <option value="all">All genres</option>
          {GENRE_FAMILIES.map((fam) => (
            <optgroup key={fam.id} label={`${fam.emoji} ${fam.label}`}>
              {fam.genres.length > 1 && (
                <option value={`family:${fam.id}`}>All {fam.label}</option>
              )}
              {fam.genres.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {error ? (
        <p className="mt-8 text-bad">{error}</p>
      ) : !entries ? (
        <p className="mt-8 text-muted">Loading scores…</p>
      ) : entries.length === 0 ? (
        <div className="card mt-6 p-8 text-center">
          <p className="text-muted">
            No scores yet for this filter. {scope === "week" ? "Be the first this week!" : "Be the first to play!"}
          </p>
        </div>
      ) : (
        <ul className="mt-6 flex flex-col gap-2">
          {entries.map((e, i) => (
            <motion.li
              key={`${e.rank}-${e.date}`}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.4) }}
              className={`card flex items-center gap-3 p-3 ${e.rank <= 3 ? "border-violet/50" : ""}`}
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
                  {new Date(e.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  {" · "}
                  {e.genre ?? "All"}
                  {e.mode === "typing" ? " · Typed" : ""}
                </div>
              </div>
              <div className="font-display text-xl font-bold grad-text tabular-nums">{e.score}</div>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}
