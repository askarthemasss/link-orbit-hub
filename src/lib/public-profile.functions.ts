import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type PublicLink = {
  id: string;
  title: string;
  url: string;
  platform: string;
  display_order: number;
};

export type PublicProfile = {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string | null;
  location: string | null;
  website_url: string | null;
  email: string | null;
  phone: string | null;
  links: PublicLink[];
};

export const getPublicProfile = createServerFn({ method: "GET" })
  .inputValidator((data: { username: string }) => ({
    username: String(data.username ?? "").toLowerCase(),
  }))
  .handler(async ({ data }): Promise<PublicProfile | null> => {
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const supabase = createClient<Database>(process.env["SUPABASE_URL"]!, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });

    // Reads go through the public_profiles view, which only exposes published
    // rows and nulls email/phone unless the owner enabled the matching toggle.
    const { data: profile } = await supabase
      .from("public_profiles" as never)
      .select(
        "id, user_id, username, display_name, bio, avatar_url, location, website_url, email, phone",
      )
      .eq("username", data.username)
      .maybeSingle();

    if (!profile) return null;
    const row = profile as unknown as {
      id: string;
      user_id: string;
      username: string;
      display_name: string;
      bio: string;
      avatar_url: string | null;
      location: string | null;
      website_url: string | null;
      email: string | null;
      phone: string | null;
    };

    const { data: links } = await supabase
      .from("links")
      .select("id, title, url, platform, display_order")
      .eq("profile_id", row.id)
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    return {
      id: row.id,
      user_id: row.user_id,
      username: row.username,
      display_name: row.display_name,
      bio: row.bio,
      avatar_url: row.avatar_url,
      location: row.location,
      website_url: row.website_url,
      email: row.email,
      phone: row.phone,
      links: links ?? [],
    };
  });
