import { platformIcon } from "@/lib/platforms";
import { prettyUrl } from "@/lib/validation";

export type EmbedLayout = "vertical" | "horizontal" | "grid" | "icons";
export type EmbedTheme = "dark" | "light" | "transparent";

export const EMBED_LAYOUTS: { id: EmbedLayout; label: string; hint: string }[] = [
  { id: "vertical", label: "Vertical", hint: "Stacked buttons, great for sidebars" },
  { id: "horizontal", label: "Horizontal", hint: "A single row of pills, great for headers" },
  { id: "grid", label: "Square grid", hint: "Tiles with icon and title" },
  { id: "icons", label: "Icons only", hint: "Compact icon strip" },
];

export const EMBED_THEMES: { id: EmbedTheme; label: string }[] = [
  { id: "dark", label: "Dark" },
  { id: "light", label: "Light" },
  { id: "transparent", label: "Transparent" },
];

export type EmbedLink = { id: string; title: string; url: string; platform: string };

/** Suggested iframe height in px for a layout and link count. */
export function embedHeight(layout: EmbedLayout, count: number): number {
  const n = Math.max(count, 1);
  if (layout === "vertical") return 24 + n * 56;
  if (layout === "grid") return 24 + Math.ceil(n / 3) * 104;
  if (layout === "icons") return 72;
  return 96;
}

export function EmbedLinks({
  links,
  layout,
  theme,
}: {
  links: EmbedLink[];
  layout: EmbedLayout;
  theme: EmbedTheme;
}) {
  const surface =
    theme === "transparent" ? "bg-transparent" : "bg-background";

  if (links.length === 0) {
    return (
      <div className={`${surface} flex h-full w-full items-center justify-center p-4`}>
        <p className="text-sm text-muted-foreground">No links selected yet.</p>
      </div>
    );
  }

  const base =
    "group inline-flex items-center gap-2 rounded-xl border border-border bg-card/70 text-card-foreground transition-colors hover:bg-secondary";

  return (
    <div className={`${surface} h-full w-full p-3`}>
      {layout === "vertical" && (
        <ul className="flex flex-col gap-2">
          {links.map((link) => {
            const Icon = platformIcon(link.platform);
            return (
              <li key={link.id}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className={`${base} w-full px-3 py-3`}
                >
                  <Icon className="size-4 shrink-0 text-primary" aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{link.title}</span>
                  <span className="hidden truncate text-xs text-muted-foreground sm:block">
                    {prettyUrl(link.url)}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      )}

      {layout === "horizontal" && (
        <ul className="flex flex-wrap items-center gap-2">
          {links.map((link) => {
            const Icon = platformIcon(link.platform);
            return (
              <li key={link.id}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className={`${base} px-3 py-2`}
                >
                  <Icon className="size-4 text-primary" aria-hidden="true" />
                  <span className="max-w-[10rem] truncate text-sm font-medium">{link.title}</span>
                </a>
              </li>
            );
          })}
        </ul>
      )}

      {layout === "grid" && (
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {links.map((link) => {
            const Icon = platformIcon(link.platform);
            return (
              <li key={link.id}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className={`${base} aspect-square w-full flex-col justify-center gap-1.5 p-2 text-center`}
                >
                  <Icon className="size-5 text-primary" aria-hidden="true" />
                  <span className="w-full truncate text-xs font-medium">{link.title}</span>
                </a>
              </li>
            );
          })}
        </ul>
      )}

      {layout === "icons" && (
        <ul className="flex flex-wrap items-center gap-2">
          {links.map((link) => {
            const Icon = platformIcon(link.platform);
            return (
              <li key={link.id}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  aria-label={link.title}
                  title={link.title}
                  className={`${base} size-11 justify-center p-0`}
                >
                  <Icon className="size-5 text-primary" aria-hidden="true" />
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
