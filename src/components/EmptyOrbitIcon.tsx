export function EmptyOrbitIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="10" className="fill-secondary stroke-primary/40" strokeWidth="2" />
      <ellipse
        cx="32"
        cy="32"
        rx="26"
        ry="10"
        className="stroke-primary/30"
        strokeWidth="2"
        transform="rotate(-30 32 32)"
      />
      <circle cx="52" cy="20" r="3" className="fill-primary/60" />
      <circle cx="12" cy="44" r="2" className="fill-primary/40" />
    </svg>
  );
}
