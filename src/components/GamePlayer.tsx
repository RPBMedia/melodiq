"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Visualizer } from "./Visualizer";
import { Logo } from "./Logo";
import { ROUND_SECONDS, pointsForElapsed } from "@/lib/scoring";

type Round = {
  order: number;
  songId: string;
  previewUrl: string | null;
  coverColor: string;
  artist: string;
  options: { title: string; artist: string }[];
};

type Mode = "multiple" | "typing";
type Phase =
  | "setup"
  | "loading"
  | "ready"
  | "playing"
  | "checking"
  | "revealed"
  | "finished"
  | "error";

type Reveal = { correct: boolean; points: number; answer: string; artist: string };

export function GamePlayer({ daily = false }: { daily?: boolean }) {
  const [phase, setPhase] = useState<Phase>(daily ? "loading" : "setup");
  const [error, setError] = useState<string | null>(null);

  // setup choices
  const [mode, setMode] = useState<Mode>("multiple");
  const [genre, setGenre] = useState<string>("all");
  const [count, setCount] = useState<number>(10);

  // game data
  const [gameId, setGameId] = useState<string | null>(null);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [titlePool, setTitlePool] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);
  const [runningScore, setRunningScore] = useState(0);

  // per-round
  const [elapsedMs, setElapsedMs] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const [reveal, setReveal] = useState<Reveal | null>(null);
  const answeredRef = useRef(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const [finalResult, setFinalResult] = useState<{
    score: number;
    correctCount: number;
    totalRounds: number;
    xpEarned: number;
    totalXp: number;
    level: number;
    leveledUp: boolean;
    rank: string;
    isDaily: boolean;
    dailyStreak: number;
  } | null>(null);

  const round = rounds[idx];
  const remaining = Math.max(0, ROUND_SECONDS - elapsedMs / 1000);
  const liveScore = pointsForElapsed(elapsedMs / 1000);

  const stopClock = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  // Own the audio element imperatively (a plain Audio object), OUTSIDE React's
  // render tree, so the ~60fps clock re-renders can never reset or interrupt
  // playback. Created once; src is set at play time inside the user gesture.
  useEffect(() => {
    const a = new Audio();
    a.preload = "auto";
    audioRef.current = a;
    return () => {
      a.pause();
      a.src = "";
      audioRef.current = null;
    };
  }, []);

  // ----- Start a game — the Daily Challenge, or a game from the setup screen -----
  const startGame = useCallback(async () => {
    setPhase("loading");
    setError(null);
    try {
      const res = daily
        ? await fetch("/api/daily", { method: "POST" })
        : await fetch("/api/game/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ genre, mode, count }),
          });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (daily && res.status === 409) {
          throw new Error("You've already played today's Daily Challenge — come back tomorrow! 🔥");
        }
        throw new Error(data.error || "Could not start the game.");
      }
      const data = await res.json();
      setGameId(data.gameId);
      setRounds(data.rounds);
      setTitlePool(data.titlePool ?? []);
      setIdx(0);
      setRunningScore(0);
      if (daily) setMode("multiple"); // the Daily Challenge is always multiple-choice
      setPhase("ready");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setPhase("error");
    }
  }, [genre, mode, count, daily]);

  // The Daily Challenge auto-starts (no setup screen). Guard so React's
  // dev double-invoke can't fire two starts.
  const autoStartedRef = useRef(false);
  useEffect(() => {
    if (daily && !autoStartedRef.current) {
      autoStartedRef.current = true;
      void startGame();
    }
  }, [daily, startGame]);

  // ----- Answer the current round (server scores it) -----
  const answer = useCallback(
    async (guess: string | null) => {
      if (answeredRef.current || !round || !gameId) return;
      answeredRef.current = true;
      stopClock();
      audioRef.current?.pause();
      setPicked(guess);
      setPhase("checking");
      try {
        const res = await fetch("/api/game/round/answer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gameId, order: round.order, guessedTitle: guess }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not score that round.");
        setReveal({
          correct: data.correct,
          points: data.points,
          answer: data.answer,
          artist: data.artist,
        });
        setRunningScore((s) => s + data.points);
        setPhase("revealed");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Scoring failed.");
        setPhase("error");
      }
    },
    [round, gameId, stopClock],
  );

  // ----- Clock loop while playing -----
  useEffect(() => {
    if (phase !== "playing") return;
    const loop = () => {
      const e = performance.now() - startRef.current;
      setElapsedMs(e);
      if (e >= ROUND_SECONDS * 1000) {
        void answer(null); // time's up -> miss
        return;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return stopClock;
  }, [phase, answer, stopClock]);

  // ----- Begin a round: tell the server, then play -----
  const playRound = useCallback(() => {
    if (!round || !gameId) return;
    answeredRef.current = false;
    setPicked(null);
    setTyped("");
    setReveal(null);
    setElapsedMs(0);
    startRef.current = performance.now();
    setPhase("playing");
    // Start playback SYNCHRONOUSLY, before any await, so it runs inside the
    // user gesture that called us (the "Play clip" / "Next song" tap). This is
    // required for native audio autoplay rules — round 1's gesture-play also
    // unlocks the <audio> element so later rounds can play programmatically.
    const audio = audioRef.current;
    if (audio && round.previewUrl) {
      // Assign the source here (in the gesture) rather than via React, so the
      // element is never mid-reload from a render when we call play().
      if (audio.src !== round.previewUrl) audio.src = round.previewUrl;
      try {
        audio.currentTime = 0;
      } catch {
        /* not seekable yet — play() will still start it */
      }
      audio.play().catch(() => {
        /* autoplay blocked / load error — the round still runs silently */
      });
    }
    // Record the round start server-side without blocking playback (the answer
    // endpoint defends against a missing start).
    fetch("/api/game/round/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId, order: round.order }),
    }).catch(() => {});
  }, [round, gameId]);

  const finishGame = useCallback(async () => {
    setPhase("finished");
    try {
      const res = await fetch("/api/game/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId }),
      });
      const data = await res.json();
      if (res.ok) {
        setFinalResult({
          score: data.score,
          correctCount: data.correctCount,
          totalRounds: data.totalRounds,
          xpEarned: data.xpEarned ?? 0,
          totalXp: data.totalXp ?? 0,
          level: data.level ?? 1,
          leveledUp: !!data.leveledUp,
          rank: data.rank ?? "",
          isDaily: !!data.isDaily,
          dailyStreak: data.dailyStreak ?? 0,
        });
      } else {
        setError(data.error || "Could not save your score.");
      }
    } catch {
      setError("Could not save your score. Check your connection.");
    }
  }, [gameId]);

  const next = useCallback(() => {
    if (idx + 1 >= rounds.length) {
      void finishGame();
      return;
    }
    // Advance to the next round's "ready" state — the user taps "Play clip" to
    // start it, so playback always begins inside a user gesture (reliable
    // native autoplay across browsers, iOS included).
    setReveal(null);
    setPicked(null);
    setTyped("");
    setIdx((i) => i + 1);
    setPhase("ready");
  }, [idx, rounds.length, finishGame]);

  // ---------- Render ----------
  if (phase === "setup") {
    return <SetupScreen mode={mode} setMode={setMode} genre={genre} setGenre={setGenre} count={count} setCount={setCount} onStart={startGame} />;
  }

  if (phase === "loading") {
    return (
      <CenterMsg>
        <Visualizer active />
        <p className="mt-4 text-muted">Building your playlist…</p>
      </CenterMsg>
    );
  }

  if (phase === "error") {
    return (
      <CenterMsg>
        <p className="font-semibold text-bad">{error}</p>
        {!daily && (
          <p className="mt-2 text-sm text-muted">
            If this persists, make sure the song pool is seeded (<code>npm run db:seed</code>).
          </p>
        )}
        <div className="mt-6 flex gap-3">
          {!daily && (
            <button onClick={() => setPhase("setup")} className="btn-ghost px-5 py-3">Try again</button>
          )}
          <Link href="/dashboard" className="btn-ghost px-5 py-3">Dashboard</Link>
        </div>
      </CenterMsg>
    );
  }

  if (phase === "finished") {
    const score = finalResult?.score ?? runningScore;
    const total = finalResult?.totalRounds ?? rounds.length;
    const correct = finalResult?.correctCount ?? 0;
    const pct = total ? Math.round((score / (total * 100)) * 100) : 0;
    const xpEarned = finalResult?.xpEarned ?? 0;
    const isDailyResult = finalResult?.isDaily ?? daily;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card mx-auto max-w-md p-7 text-center"
      >
        <p className="pill mx-auto">{isDailyResult ? "Daily Challenge complete" : "Game complete"}</p>
        <h2 className="mt-4 font-display text-2xl font-bold">Nice ears.</h2>
        <div className="my-6">
          <div className="grad-text font-display text-6xl font-bold tabular-nums">{score}</div>
          <div className="text-sm text-muted">out of {total * 100} points</div>
        </div>

        {/* XP + level-up */}
        {finalResult && (
          <div className="mb-4">
            {finalResult.leveledUp && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-2 font-display text-lg font-semibold text-good"
              >
                ⬆️ Level up! You&rsquo;re now level {finalResult.level} · {finalResult.rank}
              </motion.p>
            )}
            <p className="font-display text-2xl font-bold tabular-nums text-cyan">+{xpEarned} XP</p>
            <p className="text-xs text-muted">
              Level {finalResult.level} · {finalResult.rank}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 text-left">
          <Stat label="Correct" value={`${correct}/${total}`} />
          <Stat
            label={isDailyResult ? "Daily streak" : "Score rate"}
            value={isDailyResult ? `🔥 ${finalResult?.dailyStreak ?? 1}` : `${pct}%`}
          />
        </div>
        {error && <p className="mt-4 text-sm text-bad">{error}</p>}
        <div className="mt-7 flex flex-col gap-3">
          {isDailyResult ? (
            <Link href="/dashboard" className="btn-primary px-6 py-4">Back to dashboard</Link>
          ) : (
            <button onClick={() => setPhase("setup")} className="btn-primary px-6 py-4">Play again</button>
          )}
          <Link href="/leaderboard" className="btn-ghost px-6 py-3">View leaderboard</Link>
          {!isDailyResult && (
            <Link href="/dashboard" className="text-sm text-muted hover:text-ink">Back to dashboard</Link>
          )}
        </div>
      </motion.div>
    );
  }

  const scoreClass = liveScore >= 80 ? "score-good" : liveScore >= 50 ? "score-mid" : "score-low";
  const isPlaying = phase === "playing";
  const isChecking = phase === "checking";
  const isRevealed = phase === "revealed";

  return (
    <div className="mx-auto flex max-w-md flex-col gap-5">
      <div className="flex items-center justify-between">
        <Logo className="text-lg" />
        <div className="text-right">
          <div className="text-xs uppercase tracking-wider text-muted">Total</div>
          <div className="font-display text-xl font-bold tabular-nums">{runningScore}</div>
        </div>
      </div>

      <ProgressDots total={rounds.length} current={idx} />

      {/* Audio is a plain Audio() object owned imperatively (see the effect
          above) — deliberately NOT rendered here, so the clock's re-renders
          can't interrupt it. Native playback (no Web Audio) keeps every
          provider's preview audible. */}

      <div className="card relative overflow-hidden p-6">
        <div
          className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-48 w-48 rounded-full opacity-50 blur-3xl"
          style={{ background: round?.coverColor }}
        />
        <div className="relative">
          <div className="flex items-center justify-between">
            <span className="pill">Round {idx + 1} / {rounds.length}</span>
            {isPlaying && <TimerRing remaining={remaining} total={ROUND_SECONDS} />}
          </div>

          <div className="my-5 flex flex-col items-center">
            <Visualizer active={isPlaying} />
            {isPlaying && (
              <div className="mt-3 text-center">
                <div className={`font-display text-4xl font-bold tabular-nums ${scoreClass}`}>+{liveScore}</div>
                <div className="text-xs text-muted">points if correct now</div>
              </div>
            )}
            {isChecking && <p className="mt-3 text-sm text-muted">Checking…</p>}
            {phase === "ready" && (
              <p className="mt-3 text-center text-sm text-muted">
                {round?.previewUrl
                  ? "Tap play, then name the track as fast as you can."
                  : "No preview audio set — guess from the clues. (Add previews with npm run fetch:previews.)"}
              </p>
            )}
          </div>

          {phase === "ready" && (
            <button onClick={playRound} className="btn-primary w-full px-6 py-4 text-base">▶ Play clip</button>
          )}

          {/* Multiple-choice mode */}
          {mode === "multiple" && (isPlaying || isChecking || isRevealed) && round && (
            <div className="grid gap-3">
              {round.options.map((opt) => {
                const isAnswer = isRevealed && reveal?.answer === opt.title;
                const isPicked = opt.title === picked;
                let cls = "btn-ghost";
                if (isRevealed) {
                  if (isAnswer) cls = "btn border border-good bg-good/20 text-good";
                  else if (isPicked) cls = "btn border border-bad bg-bad/20 text-bad";
                  else cls = "btn border border-line bg-surface2/40 text-muted";
                }
                return (
                  <button
                    key={`${opt.title}—${opt.artist}`}
                    disabled={!isPlaying}
                    onClick={() => answer(opt.title)}
                    className={`${cls} w-full px-5 py-3.5 text-left ${
                      isRevealed && isPicked && !isAnswer ? "animate-shake" : ""
                    }`}
                  >
                    <span className="block text-base font-medium leading-tight">{opt.title}</span>
                    <span className="mt-0.5 block text-sm text-muted">{opt.artist}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Typing mode */}
          {mode === "typing" && (isPlaying || isChecking || isRevealed) && (
            <div className="grid gap-3">
              <input
                list="title-pool"
                value={typed}
                disabled={!isPlaying}
                onChange={(e) => setTyped(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && typed.trim()) answer(typed.trim());
                }}
                placeholder="Type the song title…"
                autoFocus
                className="w-full rounded-2xl border border-line bg-surface2/70 px-4 py-4 text-base text-ink outline-none placeholder:text-muted focus:border-violet"
              />
              <datalist id="title-pool">
                {titlePool.map((t) => (
                  <option key={t} value={t} />
                ))}
              </datalist>
              {isPlaying && (
                <button
                  onClick={() => typed.trim() && answer(typed.trim())}
                  disabled={!typed.trim()}
                  className="btn-primary w-full px-6 py-4"
                >
                  Submit guess
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isRevealed && reveal && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="card p-5"
          >
            {reveal.correct ? (
              <p className="font-display text-lg font-semibold text-good">Correct! +{reveal.points} points</p>
            ) : (
              <p className="font-display text-lg font-semibold text-bad">
                {picked ? "Not quite." : "Time's up."} +0 points
              </p>
            )}
            <p className="mt-1 text-sm text-muted">
              It was <span className="font-medium text-ink">{reveal.answer}</span> by {reveal.artist}.
            </p>
            <button onClick={next} className="btn-primary mt-4 w-full px-6 py-4">
              {idx + 1 >= rounds.length ? "See results" : "Next song →"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------- Setup screen ----------------

function SetupScreen({
  mode,
  setMode,
  genre,
  setGenre,
  count,
  setCount,
  onStart,
}: {
  mode: Mode;
  setMode: (m: Mode) => void;
  genre: string;
  setGenre: (g: string) => void;
  count: number;
  setCount: (n: number) => void;
  onStart: () => void;
}) {
  type FamilyGroup = {
    id: string;
    label: string;
    emoji: string;
    accent: string;
    count: number;
    genres: { genre: string; label: string; emoji: string; count: number }[];
  };
  const [families, setFamilies] = useState<FamilyGroup[] | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch("/api/genres")
      .then((r) => r.json())
      .then((d) => {
        setFamilies(d.families ?? []);
        setTotal(d.total ?? 0);
      })
      .catch(() => setFamilies([]));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-md lg:max-w-5xl"
    >
      <h1 className="font-display text-2xl font-bold lg:text-3xl">New game</h1>
      <p className="mt-1 text-muted">{count} songs · 30 seconds each · faster = more points.</p>

      {/* On desktop: config rail on the left, the big playlist picker fills the rest. */}
      <div className="mt-7 lg:grid lg:grid-cols-[minmax(260px,300px)_1fr] lg:gap-10">
        {/* Config rail */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">How to answer</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-1">
            <Choice active={mode === "multiple"} onClick={() => setMode("multiple")} title="Multiple choice" sub="Pick from 4 options" />
            <Choice active={mode === "typing"} onClick={() => setMode("typing")} title="Type the title" sub="Harder · type it in" />
          </div>

          <h2 className="mt-7 text-sm font-semibold uppercase tracking-wider text-muted">Game length</h2>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {[10, 20, 30].map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`rounded-2xl border p-4 text-center transition-all active:scale-[0.98] ${
                  count === n ? "border-violet bg-violet/15 shadow-glow" : "border-line bg-surface2/50 hover:bg-surface2"
                }`}
              >
                <div className="font-display text-xl font-bold tabular-nums">{n}</div>
                <div className="text-xs text-muted">songs</div>
              </button>
            ))}
          </div>

          {/* Desktop-only start button lives with the config for easy reach. */}
          <button onClick={onStart} className="btn-primary mt-7 hidden w-full px-6 py-5 text-lg lg:block">▶ Start game</button>
        </div>

        {/* Playlist picker */}
        <div className="mt-7 lg:mt-0">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Playlist</h2>
          <div className="mt-3">
            <GenrePill active={genre === "all"} onClick={() => setGenre("all")} label="🎧 All genres" count={total} />
          </div>
          {families === null && <p className="mt-3 text-sm text-muted">Loading genres…</p>}
          {(families ?? []).map((fam) => (
            <div key={fam.id} className="mt-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted" style={{ color: fam.accent }}>
                {fam.emoji} {fam.label}
              </h3>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {/* "All <family>" — plays across every sub-genre in the family. */}
                {fam.genres.length > 1 && (
                  <GenrePill
                    active={genre === `family:${fam.id}`}
                    onClick={() => setGenre(`family:${fam.id}`)}
                    label={`${fam.emoji} All ${fam.label}`}
                    count={fam.count}
                  />
                )}
                {fam.genres.map((g) => (
                  <GenrePill
                    key={g.genre}
                    active={genre === g.genre}
                    onClick={() => setGenre(g.genre)}
                    label={`${g.emoji} ${g.label}`}
                    count={g.count}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile start button — full width at the bottom of the stacked flow. */}
      <button onClick={onStart} className="btn-primary mt-8 w-full px-6 py-5 text-lg lg:hidden">▶ Start game</button>
    </motion.div>
  );
}

function Choice({ active, onClick, title, sub }: { active: boolean; onClick: () => void; title: string; sub: string }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left transition-all active:scale-[0.98] ${
        active ? "border-violet bg-violet/15 shadow-glow" : "border-line bg-surface2/50 hover:bg-surface2"
      }`}
    >
      <div className="font-display font-semibold">{title}</div>
      <div className="text-xs text-muted">{sub}</div>
    </button>
  );
}

function GenrePill({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-sm transition-all active:scale-[0.98] ${
        active ? "border-magenta bg-magenta/15 text-ink" : "border-line bg-surface2/50 text-muted hover:text-ink"
      }`}
    >
      <span className="truncate font-medium">{label}</span>
      <span className="ml-2 text-xs opacity-70">{count}</span>
    </button>
  );
}

// ---------------- Small shared pieces ----------------

function CenterMsg({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-[60dvh] max-w-md flex-col items-center justify-center text-center">
      {children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface2/60 p-3">
      <div className="text-xs uppercase tracking-wider text-muted">{label}</div>
      <div className="font-display text-lg font-bold">{value}</div>
    </div>
  );
}

function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-colors ${
            i < current ? "bg-violet" : i === current ? "bg-magenta" : "bg-line"
          }`}
        />
      ))}
    </div>
  );
}

function TimerRing({ remaining, total }: { remaining: number; total: number }) {
  const r = 16;
  const c = 2 * Math.PI * r;
  const frac = remaining / total;
  return (
    <div className="relative h-12 w-12">
      <svg className="h-12 w-12 -rotate-90" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r={r} fill="none" stroke="#2A2750" strokeWidth="4" />
        <circle
          cx="20" cy="20" r={r} fill="none" stroke="#FF2D87" strokeWidth="4"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - frac)}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-display text-sm font-bold tabular-nums">
        {Math.ceil(remaining)}
      </span>
    </div>
  );
}
