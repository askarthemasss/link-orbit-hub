/** Project covers live in the private avatars bucket, served through a cached public route. */
export function coverSrc(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `/api/public/project-cover/${path.split("/").map(encodeURIComponent).join("/")}`;
}
