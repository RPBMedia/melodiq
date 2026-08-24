"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GENRE_FAMILIES } from "@/lib/genres";

export function MatchNewForm() {
  const router = useRouter();
  const [genre, setGenre] = useState("all");
  const [maxPlayers, setMaxPlayers] = useState(2);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/match/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ genre, maxPlayers }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.matchId) {
        setError(data.error || "Could not create the match.");
        return;
      }
      router.push(`/play?match=${data.matchId}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-7 flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium uppercase tracking-wider text-muted">Playlist</span>
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="auth-input"
          aria-label="Match genre"
        >
          <option value="all">All genres</option>
          {GENRE_FAMILIES.map((fam) => (
            <optgroup key={fam.id} label={`${fam.emoji} ${fam.label}`}>
              {fam.genres.length > 1 && <option value={`family:${fam.id}`}>All {fam.label}</option>}
              {fam.genres.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium uppercase tracking-wider text-muted">Players</span>
        <div className="grid grid-cols-4 gap-2">
          {[2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setMaxPlayers(n)}
              className={`rounded-2xl border p-3 text-center transition-all active:scale-[0.98] ${
                maxPlayers === n ? "border-violet bg-violet/15 shadow-glow" : "border-line bg-surface2/50 hover:bg-surface2"
              }`}
            >
              <div className="font-display text-lg font-bold tabular-nums">{n === 2 ? "1v1" : n}</div>
              <div className="text-[11px] text-muted">{n === 2 ? "duel" : "players"}</div>
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-bad">{error}</p>}

      <button onClick={create} disabled={busy} className="btn-primary px-6 py-5 text-lg disabled:opacity-60">
        {busy ? "Creating…" : "▶ Start match & play"}
      </button>
      <p className="text-center text-xs text-muted">
        You play first, then get a link to challenge {maxPlayers === 2 ? "a friend" : `up to ${maxPlayers - 1} friends`} to the same 10 clips.
      </p>
    </div>
  );
}
