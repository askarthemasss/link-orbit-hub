import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useLinks, useProfile } from "@/hooks/useLTReee";
import { PUBLIC_SITE_ORIGIN } from "@/lib/site-url";
import {
  EMBED_LAYOUTS,
  EMBED_THEMES,
  EmbedLinks,
  embedHeight,
  type EmbedLayout,
  type EmbedTheme,
} from "@/components/EmbedLinks";

export const Route = createFileRoute("/_authenticated/embed")({
  head: () => ({
    meta: [
      { title: "Embed your links — LTReee" },
      {
        name: "description",
        content: "Build an embeddable links widget and paste it into your own website or portfolio.",
      },
      { property: "og:title", content: "Embed your links — LTReee" },
      {
        property: "og:description",
        content: "Build an embeddable links widget and paste it into your own website or portfolio.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: EmbedBuilderPage,
});

function EmbedBuilderPage() {
  const profileQuery = useProfile();
  const profile = profileQuery.data;
  const linksQuery = useLinks(profile?.id);
  const allLinks = useMemo(
    () => (linksQuery.data ?? []).filter((l) => l.is_active),
    [linksQuery.data],
  );

  const [layout, setLayout] = useState<EmbedLayout>("vertical");
  const [theme, setTheme] = useState<EmbedTheme>("dark");
  const [excluded, setExcluded] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const selected = allLinks.filter((l) => !excluded.includes(l.id));
  const height = embedHeight(layout, selected.length);

  const embedUrl = profile
    ? `${PUBLIC_SITE_ORIGIN}/embed/${profile.username}?layout=${layout}&theme=${theme}` +
      (selected.length !== allLinks.length
        ? `&links=${selected.map((l) => l.id).join(",")}`
        : "")
    : "";

  const snippet = `<iframe src="${embedUrl}" title="My links" width="100%" height="${height}" style="border:0;overflow:hidden" loading="lazy"></iframe>`;

  if (profileQuery.isLoading) {
    return (
      <DashboardLayout>
        <div className="grid place-items-center py-24 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" aria-hidden="true" />
          <span className="sr-only">Loading</span>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-md rounded-2xl glass p-6 text-center">
          <h1 className="font-display text-xl font-semibold">Create your page first</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Once you've claimed your link and added a few links, you can embed them anywhere.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="space-y-6">
          <header>
            <h1 className="font-display text-2xl font-semibold">Embed your links</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Pick the links, the shape and the colours, then paste the code into your own website.
            </p>
          </header>

          <section className="rounded-2xl glass p-5 sm:p-6" aria-labelledby="embed-links-heading">
            <h2 id="embed-links-heading" className="text-base font-semibold">
              Links to include
            </h2>
            {allLinks.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Add and show some links on your page first — they'll appear here.
              </p>
            ) : (
              <ul className="mt-4 space-y-2">
                {allLinks.map((link) => {
                  const on = !excluded.includes(link.id);
                  return (
                    <li
                      key={link.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card/60 px-3 py-2.5"
                    >
                      <span className="min-w-0 flex-1 truncate text-sm font-medium">{link.title}</span>
                      <Switch
                        checked={on}
                        aria-label={`${on ? "Remove" : "Include"} ${link.title} in the embed`}
                        onCheckedChange={(checked) =>
                          setExcluded((prev) =>
                            checked ? prev.filter((id) => id !== link.id) : [...prev, link.id],
                          )
                        }
                      />
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className="rounded-2xl glass p-5 sm:p-6" aria-labelledby="embed-layout-heading">
            <h2 id="embed-layout-heading" className="text-base font-semibold">
              Layout
            </h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {EMBED_LAYOUTS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setLayout(option.id)}
                  aria-pressed={layout === option.id}
                  className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                    layout === option.id
                      ? "border-primary bg-secondary"
                      : "border-border bg-card/60 hover:bg-secondary/60"
                  }`}
                >
                  <span className="block text-sm font-medium">{option.label}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{option.hint}</span>
                </button>
              ))}
            </div>

            <h2 className="mt-6 text-base font-semibold">Theme</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {EMBED_THEMES.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setTheme(option.id)}
                  aria-pressed={theme === option.id}
                  className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                    theme === option.id
                      ? "border-primary bg-secondary"
                      : "border-border bg-card/60 hover:bg-secondary/60"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Transparent lets your own page background show through the widget.
            </p>
          </section>

          <section className="rounded-2xl glass p-5 sm:p-6" aria-labelledby="embed-code-heading">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="embed-code-heading" className="text-base font-semibold">
                Your embed code
              </h2>
              <Button
                size="sm"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(snippet);
                    setCopied(true);
                    toast.success("Embed code copied");
                    setTimeout(() => setCopied(false), 2000);
                  } catch {
                    toast.error("Could not copy the code");
                  }
                }}
              >
                {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
                {copied ? "Copied" : "Copy code"}
              </Button>
            </div>
            <Label htmlFor="embed-snippet" className="sr-only">
              Embed code
            </Label>
            <textarea
              id="embed-snippet"
              readOnly
              rows={4}
              value={snippet}
              onFocus={(e) => e.currentTarget.select()}
              className="mt-4 w-full resize-none rounded-xl border border-border bg-secondary/40 p-3 font-mono text-xs text-foreground"
            />
            <p className="mt-3 text-xs text-muted-foreground">
              {profile.is_published
                ? "Paste this wherever you can add HTML on your site."
                : "Publish your page first — the widget only shows links from a published page."}
            </p>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl glass p-4">
            <p className="mb-3 text-sm font-medium">Live preview</p>
            <div
              className={`overflow-hidden rounded-xl border border-border ${
                theme === "light" ? "light bg-background" : "dark bg-background"
              }`}
            >
              <EmbedLinks links={selected} layout={layout} theme={theme === "transparent" ? "dark" : theme} />
            </div>
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
}
