import { useMemo } from "react";

type Star = { top: number; left: number; size: number; delay: number; duration: number; opacity: number };

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

type Node = { x: number; y: number; r: number; delay: number };
type Edge = [number, number];

/**
 * Lightweight CSS-only star field plus a faint node-and-edge constellation.
 * No canvas, no particle library. Sits behind content at low opacity and
 * respects prefers-reduced-motion (animations neutralised in styles.css).
 */
export function StarBackground({ density = 45 }: { density?: number }) {
  const stars = useMemo<Star[]>(() => {
    const rand = seeded(20260812);
    return Array.from({ length: density }, () => ({
      top: rand() * 100,
      left: rand() * 100,
      size: rand() < 0.85 ? 1 : 2,
      delay: rand() * 6,
      duration: 4 + rand() * 6,
      opacity: 0.25 + rand() * 0.45,
    }));
  }, [density]);

  const { nodes, edges } = useMemo(() => {
    const rand = seeded(20260101);
    const nodes: Node[] = Array.from({ length: 9 }, () => ({
      x: 4 + rand() * 92,
      y: 6 + rand() * 88,
      r: 2.5 + rand() * 2.5,
      delay: rand() * 8,
    }));
    const edges: Edge[] = [];
    for (let i = 0; i < nodes.length; i++) {
      // Connect each node to its nearest unconnected neighbour.
      let best = -1;
      let bestDist = Infinity;
      for (let j = 0; j < nodes.length; j++) {
        if (i === j || edges.some(([a, b]) => (a === i && b === j) || (a === j && b === i)))
          continue;
        const d = (nodes[i]!.x - nodes[j]!.x) ** 2 + (nodes[i]!.y - nodes[j]!.y) ** 2;
        if (d < bestDist) {
          bestDist = d;
          best = j;
        }
      }
      if (best >= 0 && bestDist < 2500) edges.push([i, best]);
    }
    return { nodes, edges };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 nebula-bg" />
      <div className="absolute inset-0 star-field">
        {stars.map((star, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-foreground"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
              animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
            }}
          />
        ))}
      </div>
      <svg
        className="absolute inset-0 size-full text-foreground"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {edges.map(([a, b], i) => (
          <line
            key={`e${i}`}
            x1={nodes[a]!.x}
            y1={nodes[a]!.y}
            x2={nodes[b]!.x}
            y2={nodes[b]!.y}
            stroke="currentColor"
            strokeWidth="0.06"
            opacity="0.12"
          />
        ))}
        {nodes.map((node, i) => (
          <circle
            key={`n${i}`}
            cx={node.x}
            cy={node.y}
            r={node.r / 7}
            fill="currentColor"
            opacity="0.28"
            style={{ animation: `twinkle 9s ease-in-out ${node.delay}s infinite` }}
          />
        ))}
      </svg>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background/80" />
    </div>
  );
}
