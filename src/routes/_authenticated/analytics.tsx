import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { BarChart3 } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { getEmbedStats, type EmbedStats } from "@/lib/embed-stats.functions";
import { getArenaStats, type ArenaStats } from "@/lib/arena-stats.functions";

export const Route = createFileRoute("/_authenticated/analytics")({
  head: () => ({
    meta: [
      { title: "Embed stats — LTReee" },
      { name: "description", content: "See how often your link embed is viewed and which layouts and themes are most popular." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AnalyticsPage,
});

function Bar({ label, count, max }: { label: string; count: number; max: number }) {
  const pct = max > 0 ? Math.max(4, Math.round((count / max) * 100)) : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="capitalize">{label}</span>
        <span className="text-muted-foreground">{count}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-secondary">
        <div className="h-2 rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function AnalyticsContent() {
  const { data: stats } = useSuspenseQuery<EmbedStats>({
    queryKey: ["embed-stats"],
    queryFn: () => getEmbedStats(),
  });

  if (stats.total === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
        <BarChart3 className="size-8 text-muted-foreground" aria-hidden="true" />
        <p className="font-medium">No embed views yet</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Once you paste your embed code into a website, every visit will show up here.
        </p>
        <Link to="/embed" className="text-sm text-primary underline underline-offset-4">
          Build your embed
        </Link>
      </div>
    );
  }

  const maxLayout = Math.max(...stats.byLayout.map((l) => l.count));
  const maxTheme = Math.max(...stats.byTheme.map((t) => t.count));
  const maxDaily = Math.max(...stats.daily.map((d) => d.count));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total views", value: stats.total },
          { label: "Link clicks", value: stats.totalClicks },
          { label: "Last 30 days", value: stats.last30Days },
          { label: "Last 7 days", value: stats.last7Days },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border p-4">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-3xl font-semibold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border p-4">
        <h2 className="mb-3 text-sm font-medium">Views — last 30 days</h2>
        <div className="flex h-28 items-end gap-1" role="img" aria-label="Daily embed views chart">
          {stats.daily.map((d) => (
            <div
              key={d.date}
              title={`${d.date}: ${d.count}`}
              className="flex-1 rounded-sm bg-primary/80"
              style={{ height: maxDaily > 0 ? `${Math.max(3, (d.count / maxDaily) * 100)}%` : "3%" }}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-3 rounded-xl border border-border p-4">
          <h2 className="text-sm font-medium">Popular layouts</h2>
          {stats.byLayout.map((l) => (
            <Bar key={l.layout} label={l.layout} count={l.count} max={maxLayout} />
          ))}
        </div>
        <div className="space-y-3 rounded-xl border border-border p-4">
          <h2 className="text-sm font-medium">Popular themes</h2>
          {stats.byTheme.map((t) => (
            <Bar key={t.theme} label={t.theme} count={t.count} max={maxTheme} />
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border p-4">
        <h2 className="mb-3 text-sm font-medium">Top links by clicks</h2>
        {stats.topLinks.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No clicks yet — clicks show up here once visitors tap links inside your embed.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {stats.topLinks.map((link) => (
              <li key={link.linkId} className="flex items-center justify-between gap-4 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{link.title}</p>
                  {link.url && (
                    <p className="truncate text-xs text-muted-foreground">{link.url}</p>
                  )}
                </div>
                <span className="shrink-0 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
                  {link.clicks} {link.clicks === 1 ? "click" : "clicks"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function ArenaSection() {
  const { data: stats } = useSuspenseQuery<ArenaStats>({
    queryKey: ["arena-stats"],
    queryFn: () => getArenaStats(),
  });

  return (
    <section className="mt-10 space-y-4" aria-labelledby="arena-stats-heading">
      <div>
        <h2 id="arena-stats-heading" className="text-lg font-semibold">
          Developer&apos;s Arena
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          How many people look at your projects, and which ones they open.
        </p>
      </div>

      {stats.views === 0 && stats.clicks === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-12 text-center">
          <p className="font-medium">No project activity yet</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Add projects to your Arena and share your page — views and clicks appear here.
          </p>
          <Link to="/arena" className="text-sm text-primary underline underline-offset-4">
            Build your Arena
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Project views", value: stats.views },
              { label: "Project clicks", value: stats.clicks },
              {
                label: "Click-through",
                value: stats.views > 0 ? `${Math.round((stats.clicks / stats.views) * 100)}%` : "—",
              },
              { label: "Last 7 days", value: stats.last7Days },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-border p-4">
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="mt-1 text-3xl font-semibold">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-border p-4">
            <h3 className="mb-3 text-sm font-medium">Projects by attention</h3>
            <ul className="divide-y divide-border">
              {stats.topProjects.map((p) => (
                <li key={p.projectId} className="flex items-center justify-between gap-4 py-2.5">
                  <p className="min-w-0 truncate text-sm font-medium">{p.title}</p>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {p.views} views · {p.demoClicks} demo · {p.repoClicks} code
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </section>
  );
}

function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Embed stats</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          How often your embedded links are viewed, and which layouts and themes people use.
        </p>
      </div>
      <AnalyticsContent />
      <ArenaSection />
    </DashboardLayout>
  );
}
