/**
 * Deep-space backdrop for the Developer's Arena: layered parallax starfield,
 * faint nebula haze and a black hole with an accretion ring and lensing glow.
 * Pure CSS/SVG — no canvas, no libraries. Motion is neutralised by the
 * prefers-reduced-motion rule in styles.css.
 */
export function SpaceScene() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 space-deep" />
      <div className="absolute inset-0 space-nebula" />

      <div className="absolute inset-0 space-stars space-stars-far" />
      <div className="absolute inset-0 space-stars space-stars-mid" />
      <div className="absolute inset-0 space-stars space-stars-near" />

      {/* Black hole */}
      <div className="absolute left-1/2 top-[62%] -translate-x-1/2 sm:left-[78%] sm:top-[70%]">
        <div className="relative size-[22rem] sm:size-[30rem]">
          <div className="absolute inset-0 rounded-full space-lensing" />
          <div className="absolute inset-[18%] rounded-full space-accretion" />
          <div className="absolute inset-[30%] rounded-full space-horizon" />
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/30 to-background/85" />
    </div>
  );
}
