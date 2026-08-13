"use client";

import { useEffect, useRef } from "react";

/**
 * The signature element: a row of spectrum bars that dance while a clip plays.
 * When a real <audio> element is actively playing a CORS-friendly source we
 * drive the bars from live Web Audio frequency data. Otherwise (silent/mock
 * rounds, blocked autoplay, cross-origin) we fall back to a smooth synthetic
 * spectrum so every round still feels alive.
 */
export function Visualizer({
  active,
  audioEl,
  bars = 28,
}: {
  active: boolean;
  audioEl?: HTMLAudioElement | null;
  bars?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  // Typed as Uint8Array<ArrayBuffer> (not the default ArrayBufferLike) so it
  // matches AnalyserNode.getByteFrequencyData's parameter in the current DOM lib.
  const dataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);

  // Keep the latest audio element reference for the animation loop.
  audioElRef.current = audioEl ?? null;

  // Attach a Web Audio analyser once we have a real element.
  useEffect(() => {
    if (!audioEl || analyserRef.current) return;
    try {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      const src = ctx.createMediaElementSource(audioEl);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      src.connect(analyser);
      analyser.connect(ctx.destination);
      ctxRef.current = ctx;
      analyserRef.current = analyser;
      dataRef.current = new Uint8Array(analyser.frequencyBinCount);
    } catch {
      // Autoplay/CORS restrictions — synthetic fallback will handle it.
    }
  }, [audioEl]);

  // Resume a suspended context when a round starts (browsers start it paused).
  useEffect(() => {
    if (active) ctxRef.current?.resume().catch(() => {});
  }, [active]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const children = Array.from(el.children) as HTMLElement[];
    let t = 0;

    const tick = () => {
      t += 0.08;
      const analyser = analyserRef.current;
      const data = dataRef.current;
      const audio = audioElRef.current;
      const realPlaying =
        active && !!analyser && !!data && !!audio && !audio.paused && !!audio.currentSrc;

      if (realPlaying && analyser && data) analyser.getByteFrequencyData(data);

      children.forEach((bar, i) => {
        let h: number;
        if (!active) {
          h = 14;
        } else if (realPlaying && data) {
          h = 14 + (data[i % data.length] / 255) * 80;
        } else {
          const v =
            Math.sin(t + i * 0.5) * 0.5 +
            Math.sin(t * 1.7 + i) * 0.3 +
            Math.sin(t * 0.6 + i * 0.2) * 0.2;
          h = 16 + (v + 1) * 30;
        }
        bar.style.height = `${Math.max(6, h)}px`;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="flex items-end justify-center gap-[3px] h-28"
    >
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className="w-[5px] rounded-full bg-gradient-to-t from-magenta via-violet to-cyan transition-[height] duration-75"
          style={{ height: 14, opacity: active ? 1 : 0.4 }}
        />
      ))}
    </div>
  );
}
