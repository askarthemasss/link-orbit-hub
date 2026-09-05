import { useEffect } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { getPublicProfile } from "@/lib/public-profile.functions";
import {
  EmbedLinks,
  type EmbedLayout,
  type EmbedTheme,
} from "@/components/EmbedLinks";
import { normalizeUrl } from "@/lib/validation";

type EmbedSearch = { layout: EmbedLayout; theme: EmbedTheme; links?: string };

const LAYOUTS: EmbedLayout[] = ["vertical", "horizontal", "grid", "icons"];
const THEMES: EmbedTheme[] = ["dark", "light", "transparent"];

export const Route = createFileRoute("/embed/$username")({
  validateSearch: (search: Record<string, unknown>): EmbedSearch => ({
    layout: LAYOUTS.includes(search["layout"] as EmbedLayout)
      ? (search["layout"] as EmbedLayout)
      : "vertical",
    theme: THEMES.includes(search["theme"] as EmbedTheme)
      ? (search["theme"] as EmbedTheme)
      : "dark",
    ...(typeof search["links"] === "string" && search["links"]
      ? { links: search["links"] as string }
      : {}),
  }),
  loaderDeps: ({ search }) => ({ links: search.links }),
  loader: async ({ params }) => {
    const profile = await getPublicProfile({ data: { username: params.username } });
    if (!profile) throw notFound();
    return { profile };
  },
  head: () => ({
    meta: [
      { title: "Links embed — LTReee" },
      { name: "description", content: "Embeddable link widget powered by LTReee." },
      { property: "og:title", content: "Links embed — LTReee" },
      { property: "og:description", content: "Embeddable link widget powered by LTReee." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: EmbedPage,
});

function EmbedPage() {
  const { profile } = Route.useLoaderData();
  const { layout, theme, links: selected } = Route.useSearch();

  const chosen = (selected ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  const available = (profile.links ?? []).filter((link) => Boolean(normalizeUrl(link.url)));
  const links = chosen.length
    ? (chosen
        .map((id) => available.find((link) => link.id === id))
        .filter(Boolean) as typeof available)
    : available;

  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("embed-frame");
    if (theme === "transparent") {
      html.style.background = "transparent";
      document.body.style.background = "transparent";
    }
    return () => {
      html.classList.remove("embed-frame");
      html.style.background = "";
      document.body.style.background = "";
    };
  }, [theme]);

  return (
    <div className={theme === "light" ? "light" : "dark"}>
      <main className={`min-h-screen w-full ${theme === "transparent" ? "" : "bg-background"}`}>
        <h1 className="sr-only">{profile.display_name || profile.username} links</h1>
        <EmbedLinks links={links} layout={layout} theme={theme} />
      </main>
    </div>
  );
}
