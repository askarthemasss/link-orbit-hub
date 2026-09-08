import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/project-cover/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = (params as { _splat?: string })._splat ?? "";
        // Only allow "<uuid>/projects/<filename>" shaped paths.
        if (!/^[0-9a-f-]{36}\/projects\/[A-Za-z0-9._-]+$/i.test(path)) {
          return new Response("Not found", { status: 404 });
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const ownerId = path.split("/")[0] ?? "";

        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("id, is_published")
          .eq("user_id", ownerId)
          .maybeSingle();
        if (!profile || !profile.is_published) return new Response("Not found", { status: 404 });

        // The cover must belong to a visible project on that published profile.
        const { data: project } = await supabaseAdmin
          .from("projects")
          .select("id")
          .eq("profile_id", profile.id)
          .eq("cover_path", path)
          .eq("is_visible", true)
          .maybeSingle();
        if (!project) return new Response("Not found", { status: 404 });

        const { data, error } = await supabaseAdmin.storage.from("avatars").download(path);
        if (error || !data) return new Response("Not found", { status: 404 });
        return new Response(await data.arrayBuffer(), {
          headers: {
            "content-type": data.type || "image/jpeg",
            "cache-control": "public, max-age=300, stale-while-revalidate=86400",
          },
        });
      },
    },
  },
});
