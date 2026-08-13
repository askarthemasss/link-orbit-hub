import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/avatar/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = (params as { _splat?: string })._splat ?? "";
        // Only allow "<uuid>/<filename>" shaped paths.
        if (!/^[0-9a-f-]{36}\/[A-Za-z0-9._-]+$/i.test(path)) {
          return new Response("Not found", { status: 404 });
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        // Only serve avatars that belong to a published profile referencing this exact file.
        const ownerId = path.split("/")[0];
        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("avatar_url, is_published")
          .eq("user_id", ownerId)
          .maybeSingle();
        if (!profile || !profile.is_published || !profile.avatar_url?.includes(path)) {
          return new Response("Not found", { status: 404 });
        }
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
