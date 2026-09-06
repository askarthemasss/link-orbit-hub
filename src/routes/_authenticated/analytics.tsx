import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { BarChart3 } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { getEmbedStats, type EmbedStats } from "@/lib/embed-stats.functions";

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
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total views", value: stats.total },
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
    </div>
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
    </DashboardLayout>
  );
}
