import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://ltreee.app";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/link-in-bio", changefreq: "monthly", priority: "0.9" },
          { path: "/linktree-alternative", changefreq: "monthly", priority: "0.9" },
          { path: "/developers", changefreq: "monthly", priority: "0.9" },
          { path: "/free-link-in-bio", changefreq: "monthly", priority: "0.9" },
          { path: "/instagram-bio-link", changefreq: "monthly", priority: "0.9" },
          { path: "/examples", changefreq: "monthly", priority: "0.8" },
        ];

        const { createClient } = await import("@supabase/supabase-js");
        const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
        const supabase = createClient(process.env["SUPABASE_URL"]!, key, {
          auth: { persistSession: false, autoRefreshToken: false },
          global: {
            fetch: (input, init) => {
              const headers = new Headers(init?.headers);
              if (key.startsWith("sb_") && headers.get("Authorization") === "Bearer " + key)
                headers.delete("Authorization");
              headers.set("apikey", key);
              return fetch(input, { ...init, headers });
            },
          },
        });

        const pageSize = 1000;
        const usernames: string[] = [];
        for (let offset = 0; ; offset += pageSize) {
          const { data, error } = await supabase
            .from("public_profiles")
            .select("username")
            .eq("is_published", true)
            .order("username")
            .range(offset, offset + pageSize - 1);
          if (error) break;
          for (const p of (data ?? []) as { username: string }[]) {
            usernames.push(p.username);
            entries.push({
              path: `/${encodeURIComponent(p.username)}`,
              changefreq: "weekly" as const,
              priority: "0.7",
            });
          }
          if (!data || data.length < pageSize) break;
        }

        // Arena pages are separate, self-canonical URLs — include them for profiles
        // that actually have visible projects.
        if (usernames.length > 0) {
          const { data: arenaProfiles } = await supabase
            .from("public_profiles")
            .select("id, username")
            .eq("is_published", true);
          const idByUsername = new Map(
            ((arenaProfiles ?? []) as { id: string; username: string }[]).map((p) => [p.id, p.username]),
          );
          const { data: projects } = await supabase
            .from("projects")
            .select("profile_id")
            .eq("is_visible", true);
          const withProjects = new Set(
            ((projects ?? []) as { profile_id: string }[])
              .map((p) => idByUsername.get(p.profile_id))
              .filter(Boolean) as string[],
          );
          for (const username of usernames) {
            if (!withProjects.has(username)) continue;
            entries.push({
              path: `/${encodeURIComponent(username)}?view=arena`,
              changefreq: "weekly" as const,
              priority: "0.8",
            });
          }
        }



        const today = new Date().toISOString().slice(0, 10);
        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            `    <lastmod>${e.lastmod ?? today}</lastmod>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
