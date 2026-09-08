import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const bodySchema = z.object({
  username: z.string().min(1).max(50),
  kind: z.enum(["view", "demo_click", "repo_click"]),
  projectIds: z.array(z.string().uuid()).min(1).max(50),
});

export const Route = createFileRoute("/api/public/project-event")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return new Response("Bad request", { status: 400 });
        }
        const parsed = bodySchema.safeParse(body);
        if (!parsed.success) return new Response("Bad request", { status: 400 });

        const { username, kind, projectIds } = parsed.data;
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        // Only count activity on published profiles.
        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("id")
          .eq("username", username.toLowerCase())
          .eq("is_published", true)
          .maybeSingle();
        if (!profile) return new Response("Not found", { status: 404 });

        // Only count events for projects that really belong to this profile.
        const { data: projects } = await supabaseAdmin
          .from("projects")
          .select("id, title")
          .eq("profile_id", profile.id)
          .eq("is_visible", true)
          .in("id", projectIds);
        if (!projects || projects.length === 0) return new Response("Not found", { status: 404 });

        await supabaseAdmin.from("project_events").insert(
          projects.map((p) => ({
            profile_id: profile.id,
            project_id: p.id,
            project_title: p.title,
            kind,
          })),
        );
        return new Response("ok");
      },
    },
  },
});
