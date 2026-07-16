interface DiagramNode {
  imageSrc: string;
  label: string;
  /** position on a 480x480 canvas */
  x: number;
  y: number;
}

const NODE_POSITIONS: { x: number; y: number }[] = [
  { x: 240, y: 60 },  // top
  { x: 420, y: 240 }, // right
  { x: 240, y: 420 }, // bottom
  { x: 60, y: 240 },  // left
];

export function SystemDiagram({
  nodes,
}: {
  nodes: { imageSrc: string; label: string }[];
}) {
  const placed: DiagramNode[] = nodes
    .slice(0, 4)
    .map((n, i) => ({ ...n, ...NODE_POSITIONS[i] }));

  const CENTER = { x: 240, y: 240 };
  const NODE_R = 59; // unchanged — keeps product images large
  const HUB_R = 70; // unchanged — same footprint as the original hub

  return (
    <svg
      viewBox="0 0 480 480"
      className="h-full w-full"
      role="img"
      aria-label="Diagram of DIMATA's four connected product modules orbiting one central system"
    >
      <defs>
        <radialGradient id="dimata-glow-a" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.28" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="dimata-glow-b" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.3" />
          <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0" />
        </radialGradient>

        {/* frosted-glass core fill */}
        <linearGradient id="dimata-glass" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.85" />
          <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.55" />
        </linearGradient>

        <radialGradient id="dimata-shine" cx="32%" cy="26%" r="45%">
          <stop offset="0%" stopColor="white" stopOpacity="0.55" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>

        <filter id="dimata-blur-lg" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
        <filter id="dimata-glow-sm" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="dimata-card-shadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="3" stdDeviation="5" floodOpacity="0.16" />
        </filter>
      </defs>

      <style>
        {`
          @keyframes dimata-spin { to { transform: rotate(360deg); } }
          @keyframes dimata-spin-rev { to { transform: rotate(-360deg); } }
          @keyframes dimata-drift { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(10px,-8px); } }
          @keyframes dimata-shimmer { 0%, 100% { opacity: .5; } 50% { opacity: 1; } }
          @keyframes dimata-rise {
            from { opacity: 0; transform: translateY(6px) scale(.92); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          .dimata-status-ring { animation: dimata-spin 7s linear infinite; }
          .dimata-hub-ring { animation: dimata-spin-rev 22s linear infinite; transform-origin: 240px 240px; }
          .dimata-blob { animation: dimata-drift 9s ease-in-out infinite; }
          .dimata-shimmer { animation: dimata-shimmer 3s ease-in-out infinite; }
          .dimata-card { animation: dimata-rise .55s ease-out backwards; }
          @media (prefers-reduced-motion: reduce) {
            .dimata-status-ring, .dimata-hub-ring, .dimata-blob, .dimata-shimmer, .dimata-card { animation: none; }
          }
        `}
      </style>

      {/* ambient background glow — soft, drifting light instead of a hard grid */}
      <circle cx="150" cy="150" r="140" fill="url(#dimata-glow-a)" filter="url(#dimata-blur-lg)" className="dimata-blob" />
      <circle cx="340" cy="330" r="150" fill="url(#dimata-glow-b)" filter="url(#dimata-blur-lg)" style={{ animationDelay: "-4.5s" }} className="dimata-blob" />

      {/* orbital guide rings */}
      <circle cx="240" cy="240" r="180" className="fill-none stroke-foreground/[0.07]" strokeWidth="1" />
      <circle cx="240" cy="240" r="118" className="fill-none stroke-foreground/[0.07]" strokeWidth="1" strokeDasharray="2 6" />

      {/* straight connections from the hub to each module */}
      {placed.map((n, i) => {
        const path = `M${CENTER.x},${CENTER.y} L${n.x},${n.y}`;
        return (
          <g key={`link-${n.label}`}>
            <path d={path} className="stroke-foreground/[0.08]" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path
              d={path}
              className="stroke-primary/60"
              strokeWidth="1.25"
              strokeDasharray="1 7"
              strokeLinecap="round"
              fill="none"
            />
            <circle r="3.5" className="fill-primary" filter="url(#dimata-glow-sm)">
              <animateMotion path={path} dur="3.2s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
            </circle>
          </g>
        );
      })}

      {/* central hub — frosted glass orb */}
      <circle cx="240" cy="240" r={HUB_R + 30} fill="url(#dimata-glow-a)" className="dimata-shimmer" />
      <circle
        cx="240"
        cy="240"
        r={HUB_R + 9}
        className="fill-none stroke-primary/40"
        strokeWidth="1.5"
        strokeDasharray="1 6"
        style={{ transformOrigin: "240px 240px" }}
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 240 240"
          to="360 240 240"
          dur="26s"
          repeatCount="indefinite"
        />
      </circle>

      <g filter="url(#dimata-card-shadow)">
        <circle cx="240" cy="240" r={HUB_R} fill="url(#dimata-glass)" className="stroke-foreground/10" strokeWidth="1" />
        <circle cx="240" cy="240" r={HUB_R} fill="url(#dimata-shine)" />
      </g>

      <text
        x="240"
        y="234"
        textAnchor="middle"
        className="fill-primary-foreground font-mono text-[15px] font-bold tracking-[0.1em]"
      >
        DIMATA
      </text>
      <text
        x="240"
        y="250"
        textAnchor="middle"
        className="fill-primary-foreground/75 font-mono text-[10px] tracking-[0.25em]"
      >
        CORE
      </text>

      {/* module nodes — glass cards with a spinning status ring, images unchanged in size */}
      {placed.map(({ imageSrc, label, x, y }, i) => (
        <g key={label} className="dimata-card" style={{ animationDelay: `${0.12 + i * 0.1}s` }}>
          <circle
            cx={x}
            cy={y}
            r={NODE_R}
            fill="url(#dimata-glass)"
            className="stroke-foreground/10"
            strokeWidth="1"
            filter="url(#dimata-card-shadow)"
            opacity="0.14"
          />
          <circle cx={x} cy={y} r={NODE_R} className="fill-accent stroke-foreground/15" strokeWidth="1.5" />

          {/* spinning status ring — reads as "live" without adding any radius */}
          <circle
            cx={x}
            cy={y}
            r={NODE_R - 1.5}
            className="dimata-status-ring fill-none stroke-primary"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${Math.PI * 2 * (NODE_R - 1.5) * 0.16} ${Math.PI * 2 * (NODE_R - 1.5)}`}
            style={{ transformOrigin: `${x}px ${y}px`, animationDelay: `${i * -1.8}s` }}
          />

          <foreignObject x={x - NODE_R} y={y - NODE_R} width={NODE_R * 2} height={NODE_R * 2}>
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full">
              <img src={imageSrc} alt={label} className="h-full w-full object-contain" loading="lazy" />
            </div>
          </foreignObject>
        </g>
      ))}
    </svg>
  );
}
