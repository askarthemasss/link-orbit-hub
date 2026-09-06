import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const LAYOUTS = ["vertical", "horizontal", "grid", "icons"] as const;
const THEMES = ["dark", "light", "transparent"] as const;

const bodySchema = z.object({
  username: z.string().min(1).max(50),
  linkId: z.string().uuid(),
  layout: z.enum(LAYOUTS),
  theme: z.enum(THEMES),
});

export const Route = createFileRoute("/api/public/embed-click")({
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

        const { username, linkId, layout, theme } = parsed.data;
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("id")
          .eq("username", username.toLowerCase())
          .eq("is_published", true)
          .maybeSingle();
        if (!profile) return new Response("Not found", { status: 404 });

        // Only count clicks for links that actually belong to this profile.
        const { data: link } = await supabaseAdmin
          .from("links")
          .select("id")
          .eq("id", linkId)
          .eq("profile_id", profile.id)
          .eq("is_private", false)
          .maybeSingle();
        if (!link) return new Response("Not found", { status: 404 });

        await supabaseAdmin.from("embed_clicks" as never).insert({
          profile_id: profile.id,
          link_id: linkId,
          layout,
          theme,
        } as never);
        return new Response("ok");
      },
    },
  },
});
