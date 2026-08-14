/** The clean, shareable domain for published LinkOrbit pages. */
export const PUBLIC_SITE_HOST = "link-orbit.lovable.app";
export const PUBLIC_SITE_ORIGIN = `https://${PUBLIC_SITE_HOST}`;

/** Absolute, shareable URL for a username. */
export function profileUrl(username: string) {
  return `${PUBLIC_SITE_ORIGIN}/${username}`;
}

/** Same URL without the scheme, for display. */
export function profileUrlDisplay(username: string) {
  return `${PUBLIC_SITE_HOST}/${username}`;
}
