import type { LucideIcon } from "lucide-react";

interface DiagramNode {
  icon: LucideIcon;
  label: string;
  /** position on a 480x480 canvas */
  x: number;
  y: number;
}

const NODE_POSITIONS: { x: number; y: number }[] = [
  { x: 240, y: 70 }, // top
  { x: 410, y: 240 }, // right
  { x: 240, y: 410 }, // bottom
  { x: 70, y: 240 }, // left
];

export function SystemDiagram({
  nodes,
}: {
  nodes: { icon: LucideIcon; label: string }[];
}) {
  const placed: DiagramNode[] = nodes
    .slice(0, 4)
    .map((n, i) => ({ ...n, ...NODE_POSITIONS[i] }));

  const CENTER = { x: 240, y: 240 };

  return (
    <svg
      viewBox="0 0 480 480"
      className="h-full w-full"
      role="img"
      aria-label="Diagram of DIMATA's four connected product modules feeding into one central system"
    >
      <style>
        {`
          @keyframes dimata-flow { to { stroke-dashoffset: -24; } }
          @keyframes dimata-pulse-ring { 0% { opacity: .45; transform: scale(1); } 100% { opacity: 0; transform: scale(1.9); } }
          .dimata-edge { animation: dimata-flow 1.6s linear infinite; }
          .dimata-ring { animation: dimata-pulse-ring 2.6s ease-out infinite; transform-origin: 240px 240px; }
          @media (prefers-reduced-motion: reduce) {
            .dimata-edge, .dimata-ring { animation: none; }
          }
        `}
      </style>

      {/* faint concentric guides */}
      <circle cx="240" cy="240" r="150" className="fill-none stroke-hero-foreground/10" strokeWidth="1" />
      <circle cx="240" cy="240" r="95" className="fill-none stroke-hero-foreground/10" strokeWidth="1" />

      {/* connectors */}
      {placed.map((n, i) => (
        <line
          key={`edge-${n.label}`}
          x1={CENTER.x}
          y1={CENTER.y}
          x2={n.x}
          y2={n.y}
          className="dimata-edge stroke-primary/70"
          strokeWidth="1.5"
          strokeDasharray="4 8"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}

      {/* pulse rings behind the hub */}
      <circle cx="240" cy="240" r="46" className="dimata-ring fill-none stroke-primary/60" strokeWidth="1.5" />

      {/* central hub */}
      <circle cx="240" cy="240" r="42" className="fill-black stroke-hero-foreground/25" strokeWidth="1" />
      <text
        x="240"
        y="236"
        textAnchor="middle"
        className="fill-hero-foreground font-mono text-[11px] font-semibold tracking-[0.08em]"
      >
        DIMATA
      </text>
      <text
        x="240"
        y="252"
        textAnchor="middle"
        className="fill-hero-foreground/50 font-mono text-[8px] tracking-[0.12em]"
      >
        CORE
      </text>

      {/* module nodes */}
      {placed.map(({ icon: Icon, label, x, y }) => (
        <g key={label}>
          <circle cx={x} cy={y} r="30" className="fill-hero stroke-hero-foreground/20" strokeWidth="1" />
          <foreignObject x={x - 12} y={y - 12} width="24" height="24">
            <div className="flex h-6 w-6 items-center justify-center text-hero-foreground">
              <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
            </div>
          </foreignObject>
          <text
            x={x}
            y={y + 44}
            textAnchor="middle"
            className="fill-hero-foreground/70 font-mono text-[9px] tracking-[0.06em]"
          >
            {label.toUpperCase()}
          </text>
        </g>
      ))}
    </svg>
  );
}
