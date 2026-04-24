"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Manual-scroll lyrics viewer.
 * - User scrolls the lyrics themselves.
 * - The line whose center is closest to the viewport's vertical center is
 *   highlighted; all other lines are dimmed.
 * - No audio sync, no auto-scroll, no timed progression.
 */
export function LyricsViewer({ lyrics }: { lyrics: string }) {
  const lines = lyrics
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trim());

  const containerRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function recompute() {
      const c = containerRef.current;
      if (!c) return;
      const rect = c.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;

      let bestIdx = 0;
      let bestDist = Infinity;
      for (let i = 0; i < lineRefs.current.length; i++) {
        const line = lineRefs.current[i];
        if (!line) continue;
        const lr = line.getBoundingClientRect();
        const lineCenter = lr.top + lr.height / 2;
        const d = Math.abs(lineCenter - centerY);
        if (d < bestDist) {
          bestDist = d;
          bestIdx = i;
        }
      }
      setActiveIdx(bestIdx);
    }

    recompute();
    el.addEventListener("scroll", recompute, { passive: true });
    window.addEventListener("resize", recompute);
    return () => {
      el.removeEventListener("scroll", recompute);
      window.removeEventListener("resize", recompute);
    };
  }, [lyrics]);

  if (lines.length === 0) {
    return (
      <p className="text-ink-700/70 italic">No lyrics.</p>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative h-[70vh] overflow-y-auto rounded-2xl bg-ink-800 text-white px-6 py-10 sm:py-16 scroll-smooth"
    >
      {/* Soft fade overlays top + bottom */}
      <div
        aria-hidden
        className="pointer-events-none sticky top-0 -mt-10 h-16 bg-gradient-to-b from-ink-800 to-transparent z-10"
      />
      <div className="py-[35vh] space-y-5 text-center">
        {lines.map((line, i) => {
          const active = i === activeIdx;
          const blank = line.length === 0;
          return (
            <p
              key={i}
              ref={(el) => {
                lineRefs.current[i] = el;
              }}
              className={`transition-all duration-200 ease-out ${
                blank ? "h-6" : ""
              } ${
                active
                  ? "text-2xl sm:text-3xl font-semibold text-sunrise-400 opacity-100 scale-[1.04]"
                  : "text-lg sm:text-xl text-white/40 opacity-60"
              }`}
            >
              {blank ? " " : line}
            </p>
          );
        })}
      </div>
      <div
        aria-hidden
        className="pointer-events-none sticky bottom-0 -mb-10 h-16 bg-gradient-to-t from-ink-800 to-transparent z-10"
      />
    </div>
  );
}
