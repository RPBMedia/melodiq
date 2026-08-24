"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// First-run "how to play" intro. Gated by a localStorage flag so it shows once
// per device — no schema change. It also re-opens on demand: any element can
// fire `window.dispatchEvent(new Event(HOWTO_EVENT))` (see HowToPlayButton).

const SEEN_KEY = "melodiq:onboarded:v1";
export const HOWTO_EVENT = "melodiq:howtoplay";

const STEPS = [
  { icon: "🎧", title: "Hear the clip", body: "Each round plays a 30-second preview. Listen for the hook." },
  { icon: "🎯", title: "Name that tune", body: "Tap the right title — or type it. Trust your gut." },
  { icon: "⚡", title: "Faster = more points", body: "The quicker you answer, the higher you score. 10 tracks per game." },
  { icon: "🔥", title: "Come back daily", body: "The Daily Challenge builds your streak, earns XP, and grows your record collection." },
];

export function Onboarding() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  // Open on first run; also listen for a manual re-open request.
  useEffect(() => {
    try {
      if (!localStorage.getItem(SEEN_KEY)) setOpen(true);
    } catch {
      /* private mode / storage disabled — just skip the intro */
    }
    const reopen = () => {
      setStep(0);
      setOpen(true);
    };
    window.addEventListener(HOWTO_EVENT, reopen);
    return () => window.removeEventListener(HOWTO_EVENT, reopen);
  }, []);

  const close = useCallback(() => {
    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  }, []);

  // Escape to dismiss.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  const isLast = step === STEPS.length - 1;
  const s = STEPS[step];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="onboarding-title"
          onClick={close}
        >
          <motion.div
            className="card w-full max-w-sm p-7 text-center"
            initial={{ y: 24, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end">
              <button
                onClick={close}
                className="text-sm text-muted hover:text-ink"
                aria-label="Skip the intro"
              >
                Skip
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-violet/15 text-5xl">
                  <span aria-hidden>{s.icon}</span>
                </div>
                <h2 id="onboarding-title" className="mt-5 font-display text-2xl font-bold">
                  {s.title}
                </h2>
                <p className="mt-2 text-muted">{s.body}</p>
              </motion.div>
            </AnimatePresence>

            {/* progress dots */}
            <div className="mt-6 flex justify-center gap-2" aria-hidden>
              {STEPS.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === step ? "w-6 bg-magenta" : "w-1.5 bg-line"
                  }`}
                />
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={() => (isLast ? close() : setStep((n) => n + 1))}
                className="btn-primary px-6 py-4 text-lg"
              >
                {isLast ? "Let’s play ▶" : "Next"}
              </button>
              {step > 0 && !isLast && (
                <button onClick={() => setStep((n) => n - 1)} className="text-sm text-muted hover:text-ink">
                  Back
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// A ghost button that (re)opens the intro. Lives anywhere under a mounted
// <Onboarding /> — they talk via a window event, so no shared state needed.
export function HowToPlayButton({ className = "" }: { className?: string }) {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event(HOWTO_EVENT))}
      className={`text-sm text-muted hover:text-ink ${className}`}
    >
      How to play
    </button>
  );
}
