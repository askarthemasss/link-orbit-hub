/** Avatars live in a private bucket and are served through a cached public route. */
export function avatarSrc(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `/api/public/avatar/${path.split("/").map(encodeURIComponent).join("/")}`;
}
