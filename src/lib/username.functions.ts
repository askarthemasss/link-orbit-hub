import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const RESERVED = [
  "login","signup","dashboard","settings","api","admin","auth","about","pricing",
  "terms","privacy","help","support","explore","new","me","root","static","assets",
  "public","robots","sitemap",
];

export const checkUsernameAvailability = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ username: z.string().max(64) }).parse(data))
  .handler(async ({ data, context }) => {
    const username = data.username.toLowerCase().trim();
    if (!/^[a-z0-9_-]{3,30}$/.test(username) || RESERVED.includes(username)) {
      return { available: false };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("profiles")
      .select("user_id")
      .eq("username", username)
      .limit(1);
    if (error) throw new Error("Could not check that username right now.");
    const taken = (rows ?? []).some((r) => r.user_id !== context.userId);
    return { available: !taken };
  });
