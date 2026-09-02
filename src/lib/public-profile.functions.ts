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

    const { data: profile } = await supabase
      .from("profiles")
      .select(
        "id, user_id, username, display_name, bio, avatar_url, location, website_url, email, phone, show_email, show_phone",
      )
      .eq("username", data.username)
      .eq("is_published", true)
      .maybeSingle();

    if (!profile) return null;

    const { data: links } = await supabase
      .from("links")
      .select("id, title, url, platform, display_order")
      .eq("profile_id", profile.id)
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    return {
      id: profile.id,
      user_id: profile.user_id,
      username: profile.username,
      display_name: profile.display_name,
      bio: profile.bio,
      avatar_url: profile.avatar_url,
      location: profile.location,
      website_url: profile.website_url,
      email: profile.show_email ? profile.email : null,
      phone: profile.show_phone ? profile.phone : null,
      links: links ?? [],
    };
  });
