import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const LAYOUTS = ["vertical", "horizontal", "grid", "icons"] as const;
const THEMES = ["dark", "light", "transparent"] as const;

const bodySchema = z.object({
  username: z.string().min(1).max(50),
  layout: z.enum(LAYOUTS),
  theme: z.enum(THEMES),
});

export const Route = createFileRoute("/api/public/embed-track")({
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

        const { username, layout, theme } = parsed.data;
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        // Only count embeds for published profiles.
        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("id")
          .eq("username", username.toLowerCase())
          .eq("is_published", true)
          .maybeSingle();
        if (!profile) return new Response("Not found", { status: 404 });

        await supabaseAdmin.from("embed_views" as never).insert({
          profile_id: profile.id,
          layout,
          theme,
        } as never);
        return new Response("ok");
      },
    },
  },
});
