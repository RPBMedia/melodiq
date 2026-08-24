"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Visualizer } from "./Visualizer";
import { Logo } from "./Logo";
import { roundSecondsForMode, pointsForModeElapsed, SURVIVAL_LIVES, YEAR_MIN } from "@/lib/scoring";
import { buildShareText } from "@/lib/share";
import { availableHintLevels, hintsCost, HINT_LADDER, type HintKind } from "@/lib/hints";

type Round = {
  order: number;
  songId: string;
  previewUrl: string | null;
  coverColor: string;
  artist: string;
  options: { title: string; artist: string }[];
};

type Mode = "multiple" | "typing"; // Classic input style
export type Variant = "classic" | "survival" | "speed" | "year"; // game type
type Phase =
  | "setup"
  | "loading"
  | "ready"
  | "playing"
  | "checking"
  | "revealed"
  | "finished"
  | "error";

type Reveal = { correct: boolean; points: number; answer: string; artist: string; year: number | null };

function hintChipText(kind: HintKind, value: string): string {
  switch (kind) {
    case "genre":
      return `Genre · ${value}`;
    case "decade":
      return `Decade · ${value}`;
    case "initials":
      return `Artist · ${value}`;
    case "firstLetter":
      return `Title · ${value}`;
    case "removeOption":
      return "Removed a wrong option";
  }
}

const HINT_STYLE = { color: "#FBBF24", borderColor: "rgba(251,191,36,0.5)", background: "rgba(251,191,36,0.12)" };

export function GamePlayer({
  daily = false,
  initialVariant = "classic",
  stageId,
}: {
  daily?: boolean;
  initialVariant?: Variant;
  stageId?: string;
}) {
  const isStage = !!stageId;
  const [phase, setPhase] = useState<Phase>(daily || isStage ? "loading" : "setup");
  const [error, setError] = useState<string | null>(null);

  // setup choices
  const [variant, setVariant] = useState<Variant>(initialVariant);
  const [mode, setMode] = useState<Mode>("multiple");
  const [genre, setGenre] = useState<string>("all");
  const [count, setCount] = useState<number>(10);

  // The authoritative mode of the game in progress (echoed by the server at
  // start): "multiple" | "typing" | "survival" | "speed". Drives timer/curve/lives.
  const [playMode, setPlayMode] = useState<string>("multiple");
  const [lives, setLives] = useState<number>(SURVIVAL_LIVES);
  const livesRef = useRef<number>(SURVIVAL_LIVES);

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
  const YEAR_MAX = new Date().getUTCFullYear();
  const YEAR_MID = Math.round((YEAR_MIN + YEAR_MAX) / 2);
  const [yearGuess, setYearGuess] = useState<number>(YEAR_MID);
  const [reveal, setReveal] = useState<Reveal | null>(null);
  const answeredRef = useRef(false);

  // hints (single-player Classic modes only)
  const [hints, setHints] = useState<{ level: number; kind: HintKind; value: string; cost: number }[]>([]);
  const [removedOption, setRemovedOption] = useState<string | null>(null);
  const [hintBusy, setHintBusy] = useState(false);

  // share
  const [shareState, setShareState] = useState<"idle" | "copied">("idle");

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
    newAchievements: { id: string; name: string; description: string; icon: string }[];
    newRecords: number;
    gameId: string;
    genre: string | null;
    journeyResult: {
      journeyId: string;
      stageId: string;
      stageTitle: string;
      stars: number;
      bestStars: number;
      isNewBest: boolean;
      nextStageId: string | null;
      nextStageTitle: string | null;
    } | null;
  } | null>(null);

  const round = rounds[idx];
  const roundSeconds = roundSecondsForMode(playMode);
  const remaining = Math.max(0, roundSeconds - elapsedMs / 1000);
  // Net of hint spend — what a correct answer is actually worth right now.
  const liveScore = Math.max(0, pointsForModeElapsed(playMode, elapsedMs / 1000) - hintsCost(hints.length));
  const isSurvival = playMode === "survival";
  const isYear = playMode === "year";
  // Only Classic "typing" uses the text input; every other mode is multiple-choice.
  const inputStyle: Mode = playMode === "typing" ? "typing" : "multiple";
  // Hints — single-player Classic only; ladder bought in order.
  const hintLevelsAvailable = availableHintLevels(playMode);
  const nextHint = hints.length < hintLevelsAvailable ? HINT_LADDER[hints.length] : null;

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
      // Classic sends its input style (multiple/typing); Survival/Speed send
      // the variant as the mode (both are multiple-choice server-side). A
      // Journey stage sends its stageId and the server fixes the rest.
      const requestMode = variant === "classic" ? mode : variant;
      const res = daily
        ? await fetch("/api/daily", { method: "POST" })
        : await fetch("/api/game/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(isStage ? { stageId } : { genre, mode: requestMode, count }),
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
      livesRef.current = SURVIVAL_LIVES;
      setLives(SURVIVAL_LIVES);
      // Server echoes the authoritative mode; the Daily is always multiple-choice.
      setPlayMode(daily ? "multiple" : data.mode ?? "multiple");
      if (daily) setMode("multiple");
      setPhase("ready");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setPhase("error");
    }
  }, [genre, mode, count, daily, variant, isStage, stageId]);

  // The Daily Challenge auto-starts (no setup screen). Guard so React's
  // dev double-invoke can't fire two starts.
  const autoStartedRef = useRef(false);
  useEffect(() => {
    if ((daily || isStage) && !autoStartedRef.current) {
      autoStartedRef.current = true;
      void startGame();
    }
  }, [daily, isStage, startGame]);

  // ----- Answer the current round (server scores it) -----
  const answer = useCallback(
    async (guess: string | null, year: number | null = null) => {
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
          body: JSON.stringify({ gameId, order: round.order, guessedTitle: guess, guessedYear: year }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not score that round.");
        setReveal({
          correct: data.correct,
          points: data.points,
          answer: data.answer,
          artist: data.artist,
          year: data.year ?? null,
        });
        setRunningScore((s) => s + data.points);
        // Survival: a wrong answer costs a life.
        if (playMode === "survival" && !data.correct) {
          livesRef.current = Math.max(0, livesRef.current - 1);
          setLives(livesRef.current);
        }
        setPhase("revealed");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Scoring failed.");
        setPhase("error");
      }
    },
    [round, gameId, stopClock, playMode],
  );

  // ----- Buy the next hint (server reveals + records it) -----
  const useHint = useCallback(async () => {
    if (!round || !gameId || hintBusy) return;
    if (hints.length >= availableHintLevels(playMode)) return;
    setHintBusy(true);
    try {
      const res = await fetch("/api/game/round/hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, order: round.order, options: round.options.map((o) => o.title) }),
      });
      const data = await res.json();
      if (res.ok) {
        setHints((h) => [...h, { level: data.level, kind: data.kind, value: data.value, cost: data.cost }]);
        if (data.kind === "removeOption") setRemovedOption(data.value);
      }
    } finally {
      setHintBusy(false);
    }
  }, [round, gameId, hints.length, playMode, hintBusy]);

  // ----- Clock loop while playing -----
  useEffect(() => {
    if (phase !== "playing") return;
    const capMs = roundSecondsForMode(playMode) * 1000;
    const loop = () => {
      const e = performance.now() - startRef.current;
      setElapsedMs(e);
      if (e >= capMs) {
        void answer(null); // time's up -> miss
        return;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return stopClock;
  }, [phase, answer, stopClock, playMode]);

  // ----- Begin a round: tell the server, then play -----
  const playRound = useCallback(() => {
    if (!round || !gameId) return;
    answeredRef.current = false;
    setPicked(null);
    setTyped("");
    setYearGuess(YEAR_MID);
    setHints([]);
    setRemovedOption(null);
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
  }, [round, gameId, YEAR_MID]);

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
          newAchievements: data.newAchievements ?? [],
          newRecords: data.newRecords ?? 0,
          gameId: data.gameId ?? gameId,
          genre: data.genre ?? null,
          journeyResult: data.journeyResult ?? null,
        });
      } else {
        setError(data.error || "Could not save your score.");
      }
    } catch {
      setError("Could not save your score. Check your connection.");
    }
  }, [gameId]);

  const next = useCallback(() => {
    // Survival ends when lives run out (or the deep stack is exhausted).
    if (playMode === "survival" && livesRef.current <= 0) {
      void finishGame();
      return;
    }
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
  }, [idx, rounds.length, finishGame, playMode]);

  // ---------- Render ----------
  if (phase === "setup") {
    return (
      <SetupScreen
        variant={variant}
        setVariant={setVariant}
        mode={mode}
        setMode={setMode}
        genre={genre}
        setGenre={setGenre}
        count={count}
        setCount={setCount}
        onStart={startGame}
      />
    );
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
    const isSurvivalResult = playMode === "survival";
    const isSpeedResult = playMode === "speed";
    const journey = finalResult?.journeyResult ?? null;
    const pillText = journey
      ? `Journey · ${journey.stageTitle}`
      : isDailyResult
        ? "Daily Challenge complete"
        : isSurvivalResult
          ? "Survival run"
          : isSpeedResult
            ? "Speed round"
            : playMode === "year"
              ? "Guess the Year"
              : "Game complete";

    const handleShare = async () => {
      if (!finalResult) return;
      const url = `${window.location.origin}/s/${finalResult.gameId}`;
      const text = buildShareText({
        score,
        correctCount: correct,
        totalRounds: total,
        genre: finalResult.genre,
        isDaily: isDailyResult,
      });
      // Native share sheet where available (mobile); otherwise copy the link.
      if (navigator.share) {
        try {
          await navigator.share({ title: "MelodIQ", text, url });
          return;
        } catch {
          return; // user dismissed the sheet
        }
      }
      try {
        await navigator.clipboard.writeText(`${text} ${url}`);
        setShareState("copied");
        setTimeout(() => setShareState("idle"), 2000);
      } catch {
        setError("Couldn't copy the link — long-press to copy from the address bar.");
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card mx-auto max-w-md p-7 text-center"
      >
        <p className="pill mx-auto">{pillText}</p>
        <h2 className="mt-4 font-display text-2xl font-bold">
          {isSurvivalResult ? "Run over." : "Nice ears."}
        </h2>
        <div className="my-6">
          <div className="grad-text font-display text-6xl font-bold tabular-nums">{score}</div>
          <div className="text-sm text-muted">
            {isSurvivalResult ? `${correct} track${correct === 1 ? "" : "s"} identified` : `out of ${total * 100} points`}
          </div>
        </div>

        {/* Journey stars */}
        {journey && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4"
          >
            <div className="font-display text-4xl tracking-widest" aria-label={`${journey.stars} of 3 stars`}>
              {"★".repeat(journey.stars)}
              <span className="text-line">{"★".repeat(3 - journey.stars)}</span>
            </div>
            <p className="mt-1 text-xs text-muted">
              {journey.stars === 0
                ? "Get 5 right for your first star."
                : journey.isNewBest
                  ? journey.stars === 3
                    ? "Mastered! ⭐ New best."
                    : "New best on this stage!"
                  : `Best: ${"★".repeat(journey.bestStars)}`}
            </p>
          </motion.div>
        )}

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

        {/* Newly unlocked achievements */}
        {finalResult && finalResult.newAchievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 rounded-2xl border border-violet/40 bg-violet/10 p-4"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-violet">
              Achievement{finalResult.newAchievements.length > 1 ? "s" : ""} unlocked!
            </p>
            <div className="mt-2 flex flex-col gap-2">
              {finalResult.newAchievements.map((a) => (
                <div key={a.id} className="flex items-center gap-3 text-left">
                  <span className="text-2xl" aria-hidden>{a.icon}</span>
                  <div>
                    <div className="font-display text-sm font-semibold">{a.name}</div>
                    <div className="text-xs text-muted">{a.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {finalResult && finalResult.newRecords > 0 && (
          <Link
            href="/collection"
            className="mb-4 flex items-center justify-center gap-2 rounded-2xl border border-good/40 bg-good/10 py-3 text-sm font-semibold text-good hover:bg-good/15"
          >
            💿 {finalResult.newRecords} new record{finalResult.newRecords > 1 ? "s" : ""} added to your Collection
          </Link>
        )}

        <div className="grid grid-cols-2 gap-3 text-left">
          <Stat label={isSurvivalResult ? "Tracks nailed" : "Correct"} value={isSurvivalResult ? `${correct}` : `${correct}/${total}`} />
          <Stat
            label={isDailyResult ? "Daily streak" : isSurvivalResult ? "Lives left" : "Score rate"}
            value={
              isDailyResult
                ? `🔥 ${finalResult?.dailyStreak ?? 1}`
                : isSurvivalResult
                  ? `${"❤️".repeat(lives) || "—"}`
                  : `${pct}%`
            }
          />
        </div>
        {error && <p className="mt-4 text-sm text-bad">{error}</p>}
        <div className="mt-7 flex flex-col gap-3">
          {finalResult?.gameId && (
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 rounded-2xl border border-violet/50 bg-violet/15 px-6 py-4 font-semibold text-ink hover:bg-violet/25"
            >
              {shareState === "copied" ? "✓ Link copied!" : "📣 Share your score"}
            </button>
          )}
          {journey ? (
            <>
              {journey.nextStageId ? (
                <Link href={`/play?stage=${journey.nextStageId}`} className="btn-primary px-6 py-4">
                  Next stage: {journey.nextStageTitle} →
                </Link>
              ) : journey.stars === 0 ? (
                <Link href={`/play?stage=${journey.stageId}`} className="btn-primary px-6 py-4">
                  Try this stage again
                </Link>
              ) : (
                <Link href={`/journeys/${journey.journeyId}`} className="btn-primary px-6 py-4">
                  Back to the map
                </Link>
              )}
              <Link href={`/journeys/${journey.journeyId}`} className="btn-ghost px-6 py-3">
                Journey map
              </Link>
            </>
          ) : (
            <>
              {isDailyResult ? (
                <Link href="/dashboard" className="btn-primary px-6 py-4">Back to dashboard</Link>
              ) : (
                <button onClick={() => setPhase("setup")} className="btn-primary px-6 py-4">Play again</button>
              )}
              <Link href="/leaderboard" className="btn-ghost px-6 py-3">View leaderboard</Link>
              {!isDailyResult && (
                <Link href="/dashboard" className="text-sm text-muted hover:text-ink">Back to dashboard</Link>
              )}
            </>
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

      {isSurvival ? (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted">Track {idx + 1}</span>
          <span className="text-lg tracking-tight" aria-label={`${lives} lives left`}>
            {"❤️".repeat(lives)}
            {"🖤".repeat(SURVIVAL_LIVES - lives)}
          </span>
        </div>
      ) : (
        <ProgressDots total={rounds.length} current={idx} />
      )}

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
            <span className="pill">{isSurvival ? `Track ${idx + 1}` : `Round ${idx + 1} / ${rounds.length}`}</span>
            {isPlaying && <TimerRing remaining={remaining} total={roundSeconds} />}
          </div>

          <div className="my-5 flex flex-col items-center">
            <Visualizer active={isPlaying} />
            {isPlaying && (
              <div className="mt-3 text-center">
                {isYear ? (
                  <div className="text-sm font-semibold text-cyan">🗓️ Guess the release year</div>
                ) : (
                  <>
                    <div className={`font-display text-4xl font-bold tabular-nums ${scoreClass}`}>+{liveScore}</div>
                    <div className="text-xs text-muted">points if correct now</div>
                  </>
                )}
              </div>
            )}
            {isChecking && <p className="mt-3 text-sm text-muted">Checking…</p>}
            {phase === "ready" && (
              <p className="mt-3 text-center text-sm text-muted">
                {round?.previewUrl
                  ? isYear
                    ? "Tap play, then guess the year it was released."
                    : "Tap play, then name the track as fast as you can."
                  : "No preview audio set — guess from the clues. (Add previews with npm run fetch:previews.)"}
              </p>
            )}
          </div>

          {phase === "ready" && (
            <button onClick={playRound} className="btn-primary w-full px-6 py-4 text-base">▶ Play clip</button>
          )}

          {/* Hints — single-player Classic only. Revealed chips + the next-step button. */}
          {hintLevelsAvailable > 0 && (isPlaying || isRevealed) && (hints.length > 0 || isPlaying) && (
            <div className="mb-3 flex flex-col gap-2">
              {hints.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {hints.map((h) => (
                    <span key={h.level} className="rounded-full border px-3 py-1 text-xs font-medium" style={HINT_STYLE}>
                      💡 {hintChipText(h.kind, h.value)}
                    </span>
                  ))}
                </div>
              )}
              {isPlaying && nextHint && (
                <button
                  onClick={useHint}
                  disabled={hintBusy}
                  className="self-start rounded-2xl border px-4 py-2 text-sm font-semibold transition hover:brightness-110 disabled:opacity-50"
                  style={HINT_STYLE}
                >
                  💡 {nextHint.label} (−{nextHint.cost} pts)
                </button>
              )}
            </div>
          )}

          {/* Multiple-choice mode */}
          {!isYear && inputStyle === "multiple" && (isPlaying || isChecking || isRevealed) && round && (
            <div className="grid gap-3">
              {round.options.map((opt) => {
                const isAnswer = isRevealed && reveal?.answer === opt.title;
                const isPicked = opt.title === picked;
                const isRemoved = !isRevealed && opt.title === removedOption;
                let cls = "btn-ghost";
                if (isRevealed) {
                  if (isAnswer) cls = "btn border border-good bg-good/20 text-good";
                  else if (isPicked) cls = "btn border border-bad bg-bad/20 text-bad";
                  else cls = "btn border border-line bg-surface2/40 text-muted";
                } else if (isRemoved) {
                  cls = "btn border border-line bg-surface2/30 text-muted line-through opacity-40";
                }
                return (
                  <button
                    key={`${opt.title}—${opt.artist}`}
                    disabled={!isPlaying || isRemoved}
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
          {inputStyle === "typing" && (isPlaying || isChecking || isRevealed) && (
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

          {/* Guess the Year mode */}
          {isYear && (isPlaying || isChecking || isRevealed) && (
            <div className="grid gap-4">
              <div className="text-center font-display text-5xl font-bold tabular-nums text-cyan">
                {yearGuess}
              </div>
              <input
                type="range"
                min={YEAR_MIN}
                max={YEAR_MAX}
                step={1}
                value={yearGuess}
                disabled={!isPlaying}
                onChange={(e) => setYearGuess(Number(e.target.value))}
                className="w-full accent-cyan"
                aria-label="Guess the release year"
              />
              <div className="flex justify-between text-xs tabular-nums text-muted">
                <span>{YEAR_MIN}</span>
                <span>{YEAR_MAX}</span>
              </div>
              {isPlaying && (
                <button onClick={() => answer(null, yearGuess)} className="btn-primary w-full px-6 py-4">
                  Submit year
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
              <p className="font-display text-lg font-semibold text-good">
                {isYear ? "Nailed the year!" : "Correct!"} +{reveal.points} points
              </p>
            ) : reveal.points > 0 ? (
              <p className="font-display text-lg font-semibold text-cyan">Close! +{reveal.points} points</p>
            ) : (
              <p className="font-display text-lg font-semibold text-bad">
                {picked || (isYear && isRevealed) ? "Not quite." : "Time's up."} +0 points
              </p>
            )}
            <p className="mt-1 text-sm text-muted">
              It was{" "}
              {isYear && reveal.year != null && (
                <>
                  <span className="font-medium text-cyan">{reveal.year}</span> —{" "}
                </>
              )}
              <span className="font-medium text-ink">{reveal.answer}</span> by {reveal.artist}.
            </p>
            {isSurvival && lives <= 0 && (
              <p className="mt-2 font-display text-sm font-semibold text-bad">💀 Out of lives — that&rsquo;s the run.</p>
            )}
            {isSurvival && lives > 0 && !reveal.correct && (
              <p className="mt-2 text-sm text-muted">{lives} life{lives === 1 ? "" : "s"} left.</p>
            )}
            <button onClick={next} className="btn-primary mt-4 w-full px-6 py-4">
              {idx + 1 >= rounds.length || (isSurvival && lives <= 0) ? "See results" : "Next song →"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------- Setup screen ----------------

const VARIANTS: { id: Variant; title: string; sub: string; emoji: string }[] = [
  { id: "classic", title: "Classic", sub: "10–30 tracks, 30s each", emoji: "🎧" },
  { id: "survival", title: "Survival", sub: "3 lives · how far can you go?", emoji: "💀" },
  { id: "speed", title: "Speed", sub: "Name it in the first seconds", emoji: "⚡" },
  { id: "year", title: "Guess the Year", sub: "Name the release year", emoji: "🗓️" },
];

function SetupScreen({
  variant,
  setVariant,
  mode,
  setMode,
  genre,
  setGenre,
  count,
  setCount,
  onStart,
}: {
  variant: Variant;
  setVariant: (v: Variant) => void;
  mode: Mode;
  setMode: (m: Mode) => void;
  genre: string;
  setGenre: (g: string) => void;
  count: number;
  setCount: (n: number) => void;
  onStart: () => void;
}) {
  const isClassic = variant === "classic";
  const subtitle =
    variant === "survival"
      ? "3 lives · difficulty ramps · play until you miss three."
      : variant === "speed"
        ? "10 tracks · 12s each · the first seconds are worth the most."
        : variant === "year"
          ? "10 clips · guess the release year · closer = more points."
          : `${count} songs · 30 seconds each · faster = more points.`;
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
      <p className="mt-1 text-muted">{subtitle}</p>

      {/* On desktop: config rail on the left, the big playlist picker fills the rest. */}
      <div className="mt-7 lg:grid lg:grid-cols-[minmax(260px,300px)_1fr] lg:gap-10">
        {/* Config rail */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Mode</h2>
          <div className="mt-3 grid grid-cols-1 gap-3">
            {VARIANTS.map((v) => (
              <Choice
                key={v.id}
                active={variant === v.id}
                onClick={() => setVariant(v.id)}
                title={`${v.emoji} ${v.title}`}
                sub={v.sub}
              />
            ))}
          </div>

          {/* Classic-only: input style + game length. Survival/Speed are fixed. */}
          {isClassic && (
            <>
              <h2 className="mt-7 text-sm font-semibold uppercase tracking-wider text-muted">How to answer</h2>
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
            </>
          )}

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
