import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type ArenaStats = {
  views: number;
  clicks: number;
  last7Days: number;
  topProjects: {
    projectId: string;
    title: string;
    views: number;
    demoClicks: number;
    repoClicks: number;
  }[];
};

const empty: ArenaStats = { views: 0, clicks: 0, last7Days: 0, topProjects: [] };

export const getArenaStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ArenaStats> => {
    const { data: profile } = await context.supabase
      .from("profiles")
      .select("id")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (!profile) return empty;

    const { data: rows } = await context.supabase
      .from("project_events")
      .select("project_id, project_title, kind, created_at")
      .eq("profile_id", profile.id);

    const events = rows ?? [];
    if (events.length === 0) return empty;

    const day = 24 * 60 * 60 * 1000;
    const now = Date.now();

    const byProject = new Map<
      string,
      { projectId: string; title: string; views: number; demoClicks: number; repoClicks: number }
    >();

    let views = 0;
    let clicks = 0;
    let last7Days = 0;

    for (const e of events) {
      const key = e.project_id ?? `deleted:${e.project_title}`;
      const entry =
        byProject.get(key) ??
        {
          projectId: key,
          title: e.project_title || "Removed project",
          views: 0,
          demoClicks: 0,
          repoClicks: 0,
        };
      if (e.kind === "view") {
        views++;
        entry.views++;
      } else if (e.kind === "demo_click") {
        clicks++;
        entry.demoClicks++;
      } else if (e.kind === "repo_click") {
        clicks++;
        entry.repoClicks++;
      }
      if (now - new Date(e.created_at).getTime() < 7 * day) last7Days++;
      byProject.set(key, entry);
    }

    const topProjects = [...byProject.values()]
      .sort((a, b) => b.demoClicks + b.repoClicks - (a.demoClicks + a.repoClicks) || b.views - a.views)
      .slice(0, 10);

    return { views, clicks, last7Days, topProjects };
  });
