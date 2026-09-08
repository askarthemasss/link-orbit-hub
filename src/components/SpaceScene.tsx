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

      <div className="space-grid absolute inset-0" />
      <div className="space-orbit space-orbit-one absolute" />
      <div className="space-orbit space-orbit-two absolute" />

      <div className="space-black-hole absolute left-1/2 top-[43%] -translate-x-1/2 sm:left-[72%] sm:top-[44%]">
        <div className="relative size-[28rem] sm:size-[42rem] lg:size-[54rem]">
          <div className="space-jet absolute inset-0" />
          <div className="space-lensing absolute inset-0 rounded-full" />
          <div className="space-accretion-wide absolute inset-[12%] rounded-full" />
          <div className="space-accretion absolute inset-[22%] rounded-full" />
          <div className="space-photon-ring absolute inset-[31%] rounded-full" />
          <div className="space-horizon absolute inset-[35%] rounded-full" />
        </div>
      </div>
      <div className="space-vignette absolute inset-0" />
    </div>
  );
}
