import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type EmbedStats = {
  total: number;
  last30Days: number;
  last7Days: number;
  totalClicks: number;
  byLayout: { layout: string; count: number }[];
  byTheme: { theme: string; count: number }[];
  daily: { date: string; count: number }[];
  topLinks: { linkId: string; title: string; url: string; clicks: number }[];
};

export const getEmbedStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<EmbedStats> => {
    const { data: profile } = await context.supabase
      .from("profiles")
      .select("id")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (!profile) {
      return {
        total: 0, last30Days: 0, last7Days: 0, totalClicks: 0,
        byLayout: [], byTheme: [], daily: [], topLinks: [],
      };
    }

    const { data: rows } = await context.supabase
      .from("embed_views" as never)
      .select("layout, theme, created_at")
      .eq("profile_id", profile.id);

    const views = (rows ?? []) as unknown as {
      layout: string;
      theme: string;
      created_at: string;
    }[];

    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    const count = (pred: (v: (typeof views)[number]) => boolean) =>
      views.filter(pred).length;

    const group = (key: "layout" | "theme") => {
      const map = new Map<string, number>();
      for (const v of views) map.set(v[key], (map.get(v[key]) ?? 0) + 1);
      return [...map.entries()]
        .map(([k, c]) => ({ [key]: k, count: c }) as never)
        .sort((a: { count: number }, b: { count: number }) => b.count - a.count);
    };

    // Daily counts for the last 30 days.
    const dailyMap = new Map<string, number>();
    for (let i = 29; i >= 0; i--) {
      dailyMap.set(new Date(now - i * day).toISOString().slice(0, 10), 0);
    }
    for (const v of views) {
      const d = v.created_at.slice(0, 10);
      if (dailyMap.has(d)) dailyMap.set(d, (dailyMap.get(d) ?? 0) + 1);
    }

    // Click stats: join clicks to link titles/urls.
    const { data: clickRows } = await context.supabase
      .from("embed_clicks" as never)
      .select("link_id")
      .eq("profile_id", profile.id);
    const clicks = (clickRows ?? []) as unknown as { link_id: string }[];

    const { data: linkRows } = await context.supabase
      .from("links")
      .select("id, title, url")
      .eq("profile_id", profile.id);
    const linkMeta = new Map(
      (linkRows ?? []).map((l) => [l.id, { title: l.title, url: l.url }]),
    );

    const clickMap = new Map<string, number>();
    for (const c of clicks) clickMap.set(c.link_id, (clickMap.get(c.link_id) ?? 0) + 1);
    const topLinks = [...clickMap.entries()]
      .map(([linkId, clicks]) => ({
        linkId,
        title: linkMeta.get(linkId)?.title ?? "Deleted link",
        url: linkMeta.get(linkId)?.url ?? "",
        clicks,
      }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10);

    return {
      total: views.length,
      last30Days: count((v) => now - new Date(v.created_at).getTime() < 30 * day),
      last7Days: count((v) => now - new Date(v.created_at).getTime() < 7 * day),
      totalClicks: clicks.length,
      byLayout: group("layout"),
      byTheme: group("theme"),
      daily: [...dailyMap.entries()].map(([date, count]) => ({ date, count })),
      topLinks,
    };
  });
