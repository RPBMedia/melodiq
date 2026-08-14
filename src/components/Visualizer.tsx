"use client";

import { useEffect, useRef } from "react";

/**
 * The signature element: a row of spectrum bars that dance while a clip plays.
 *
 * Driven by a smooth SYNTHETIC spectrum rather than live Web Audio on purpose:
 * routing an <audio> element through `createMediaElementSource` makes the Web
 * Audio graph output SILENCE for any cross-origin source whose CDN omits CORS
 * headers (e.g. Deezer previews). Playing the audio natively guarantees sound
 * for every preview provider; the bars animate in sympathy without touching the
 * audio path.
 */
export function Visualizer({
  active,
  bars = 28,
}: {
  active: boolean;
  bars?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const children = Array.from(el.children) as HTMLElement[];
    let t = 0;

    const tick = () => {
      t += 0.08;
      children.forEach((bar, i) => {
        let h: number;
        if (!active) {
          h = 14;
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
