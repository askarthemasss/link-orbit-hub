const BLOCKED_PROTOCOLS = ["javascript:", "data:", "file:", "vbscript:", "blob:"];

export const RESERVED_USERNAMES = [
  "login","signup","dashboard","settings","api","admin","auth","about","pricing",
  "terms","privacy","help","support","explore","new","me","root","static","assets",
  "public","robots","sitemap",
];

export function normalizeUsername(value: string): string {
  return value.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9_-]/g, "");
}

export function usernameError(value: string): string | null {
  if (!value) return "Pick a username";
  if (value.length < 3) return "At least 3 characters";
  if (value.length > 30) return "At most 30 characters";
  if (!/^[a-z0-9_-]+$/.test(value)) return "Only letters, numbers, hyphens and underscores";
  if (RESERVED_USERNAMES.includes(value)) return "That username is reserved";
  return null;
}

/** Returns a safe, normalized https URL or null when the input is unusable. */
export function normalizeUrl(raw: string): string | null {
  const input = raw.trim();
  if (!input) return null;
  const lower = input.toLowerCase();
  if (BLOCKED_PROTOCOLS.some((p) => lower.startsWith(p))) return null;
  const candidate = /^https?:\/\//i.test(input) ? input : `https://${input}`;
  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (!url.hostname.includes(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function prettyUrl(url: string): string {
  try {
    const u = new URL(url);
    return (u.hostname.replace(/^www\./, "") + (u.pathname === "/" ? "" : u.pathname)).replace(/\/$/, "");
  } catch {
    return url;
  }
}
