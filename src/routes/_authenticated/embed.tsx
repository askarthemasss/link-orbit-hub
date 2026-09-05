import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, Check, Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const activeLinks = useMemo(
    () => (linksQuery.data ?? []).filter((l) => l.is_active),
    [linksQuery.data],
  );

  const [layout, setLayout] = useState<EmbedLayout>("vertical");
  const [theme, setTheme] = useState<EmbedTheme>("dark");
  const [excluded, setExcluded] = useState<string[]>([]);
  const [order, setOrder] = useState<string[]>([]);
  const [responsive, setResponsive] = useState(true);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [copied, setCopied] = useState(false);

  // Keep the order list in sync with the available links.
  useEffect(() => {
    const ids = activeLinks.map((l) => l.id);
    setOrder((prev) => {
      const kept = prev.filter((id) => ids.includes(id));
      const added = ids.filter((id) => !kept.includes(id));
      const next = [...kept, ...added];
      return next.length === prev.length && next.every((id, i) => id === prev[i]) ? prev : next;
    });
  }, [activeLinks]);

  const ordered = useMemo(
    () => order.map((id) => activeLinks.find((l) => l.id === id)!).filter(Boolean),
    [order, activeLinks],
  );
  const selected = ordered.filter((l) => !excluded.includes(l.id));

  const suggestedHeight = embedHeight(layout, selected.length);
  const finalHeight = Number(height) > 0 ? Number(height) : suggestedHeight;
  const finalWidth = !responsive && Number(width) > 0 ? `${Number(width)}` : "100%";

  const isCustomOrder = selected.some((l, i) => activeLinks[i]?.id !== l.id);
  const embedUrl = profile
    ? `${PUBLIC_SITE_ORIGIN}/embed/${profile.username}?layout=${layout}&theme=${theme}` +
      (selected.length !== activeLinks.length || isCustomOrder
        ? `&links=${selected.map((l) => l.id).join(",")}`
        : "")
    : "";

  const style = responsive
    ? "border:0;overflow:hidden;max-width:100%"
    : "border:0;overflow:hidden;max-width:100%";
  const snippet = `<iframe src="${embedUrl}" title="My links" width="${finalWidth}" height="${finalHeight}" style="${style}" loading="lazy"></iframe>`;

  function move(id: string, delta: number) {
    setOrder((prev) => {
      const i = prev.indexOf(id);
      const j = i + delta;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      const [item] = next.splice(i, 1);
      next.splice(j, 0, item!);
      return next;
    });
  }

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
      <div className="space-y-6">
        <header>
          <h1 className="font-display text-2xl font-semibold">Embed your links</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Pick the links, the order, the shape and the size, then paste the code into your own website.
          </p>
        </header>

        <section className="rounded-2xl glass p-4 sm:p-5" aria-labelledby="embed-preview-heading">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 id="embed-preview-heading" className="text-base font-semibold">
              Live preview
            </h2>
            <p className="text-xs text-muted-foreground">
              {responsive ? "Full width" : `${Number(width) || 400}px wide`} · {finalHeight}px tall
            </p>
          </div>
          <div className="overflow-x-auto">
            <div
              className={`overflow-hidden rounded-xl border border-border ${
                theme === "light" ? "light bg-background" : "dark bg-background"
              }`}
              style={
                responsive
                  ? { width: "100%" }
                  : { width: `${Number(width) || 400}px`, maxWidth: "100%" }
              }
            >
              <EmbedLinks
                links={selected}
                layout={layout}
                theme={theme === "transparent" ? "dark" : theme}
              />
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl glass p-5 sm:p-6" aria-labelledby="embed-links-heading">
            <h2 id="embed-links-heading" className="text-base font-semibold">
              Links and order
            </h2>
            {activeLinks.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Add and show some links on your page first — they'll appear here.
              </p>
            ) : (
              <ul className="mt-4 space-y-2">
                {ordered.map((link, index) => {
                  const on = !excluded.includes(link.id);
                  return (
                    <li
                      key={link.id}
                      className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-xl border border-border bg-card/60 px-3 py-2.5"
                    >
                      <span className="min-w-0 truncate text-sm font-medium">{link.title}</span>
                      <div className="flex shrink-0 items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          disabled={index === 0}
                          aria-label={`Move ${link.title} up`}
                          onClick={() => move(link.id, -1)}
                        >
                          <ArrowUp className="size-4" aria-hidden="true" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          disabled={index === ordered.length - 1}
                          aria-label={`Move ${link.title} down`}
                          onClick={() => move(link.id, 1)}
                        >
                          <ArrowDown className="size-4" aria-hidden="true" />
                        </Button>
                        <Switch
                          checked={on}
                          aria-label={`${on ? "Remove" : "Include"} ${link.title} in the embed`}
                          onCheckedChange={(checked) =>
                            setExcluded((prev) =>
                              checked ? prev.filter((id) => id !== link.id) : [...prev, link.id],
                            )
                          }
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <div className="space-y-6">
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

            <section className="rounded-2xl glass p-5 sm:p-6" aria-labelledby="embed-size-heading">
              <h2 id="embed-size-heading" className="text-base font-semibold">
                Size
              </h2>
              <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-border bg-card/60 px-3 py-2.5">
                <div className="min-w-0">
                  <p className="text-sm font-medium">Full width (responsive)</p>
                  <p className="text-xs text-muted-foreground">
                    The widget fills whatever space it has on your site.
                  </p>
                </div>
                <Switch
                  checked={responsive}
                  aria-label="Make the widget full width"
                  onCheckedChange={setResponsive}
                />
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="embed-width">Width (px, optional)</Label>
                  <Input
                    id="embed-width"
                    inputMode="numeric"
                    placeholder="400"
                    value={width}
                    disabled={responsive}
                    onChange={(e) => setWidth(e.target.value.replace(/[^0-9]/g, ""))}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="embed-height">Height (px, optional)</Label>
                  <Input
                    id="embed-height"
                    inputMode="numeric"
                    placeholder={String(suggestedHeight)}
                    value={height}
                    onChange={(e) => setHeight(e.target.value.replace(/[^0-9]/g, ""))}
                    className="mt-1.5"
                  />
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Leave these empty and we'll pick a size that fits your links.
              </p>
            </section>
          </div>
        </div>

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
    </DashboardLayout>
  );
}
