import { useMemo } from "react";

type Star = { top: number; left: number; size: number; delay: number; duration: number; opacity: number };

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

/**
 * Lightweight CSS-only star field. No canvas, no particle library.
 * Sits behind content at low opacity and respects prefers-reduced-motion
 * (animations are neutralised globally in styles.css).
 */
export function StarBackground({ density = 70 }: { density?: number }) {
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
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background/80" />
    </div>
  );
}
