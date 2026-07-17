"use client";

/**
 * AnimatedBackgroundDustMotes — Variant G: "Dust motes"
 * ------------------------------------------------------------------
 * A handful of tiny, faint dots drifting slowly upward and sideways,
 * fading in and out — like dust in a light beam. Much sparser and
 * quieter than the particle-network variant (no connecting lines, no
 * canvas/JS — pure CSS keyframes on a few small spans). Reads as
 * texture, not as "a system," so it works behind dense content too.
 *
 * Usage: mount as the first child inside a `relative isolate
 * overflow-hidden` section (the `isolate` is required or the -z-10
 * layer escapes to the page root and becomes invisible).
 *
 *   <section className="relative isolate overflow-hidden bg-background">
 *     <AnimatedBackgroundDustMotes />
 *     ...section content...
 *   </section>
 */
const MOTES = [
  { left: "8%", size: 5, duration: 22, delay: 0 },
  { left: "22%", size: 3, duration: 28, delay: 4 },
  { left: "38%", size: 6, duration: 25, delay: 2 },
  { left: "55%", size: 3, duration: 30, delay: 7 },
  { left: "68%", size: 5, duration: 24, delay: 1 },
  { left: "80%", size: 4, duration: 27, delay: 5 },
  { left: "92%", size: 3, duration: 26, delay: 9 },
];

export function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {MOTES.map((m, i) => (
        <span
          key={i}
          className="dimata-mote absolute rounded-full bg-primary/75"
          style={{
            left: m.left,
            bottom: "-5%",
            width: m.size,
            height: m.size,
            animationDuration: `${m.duration}s`,
            animationDelay: `${m.delay}s`,
          }}
        />
      ))}

      <style>{`
        @keyframes dimata-mote-rise {
          0%   { transform: translate(0, 0); opacity: 0; }
          10%  { opacity: 0.6; }
          90%  { opacity: 0.5; }
          100% { transform: translate(3%, -115vh); opacity: 0; }
        }
        .dimata-mote {
          animation-name: dimata-mote-rise;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .dimata-mote { animation: none; opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
