import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { detectPlatform } from "@/lib/platforms";
import { normalizeUrl } from "@/lib/validation";
import { currentProfile, errorResult, jsonResult, notAuthed } from "./shared";

export default defineTool({
  name: "create_link",
  title: "Add a link",
  description: "Add a new link to the signed-in user's LTReee page. The platform icon is detected from the URL.",
  inputSchema: {
    title: z.string().trim().min(1).max(60).describe("Label shown on the button."),
    url: z.string().trim().min(1).describe("Destination URL (http/https)."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  handler: async ({ title, url }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthed;
    const normalized = normalizeUrl(url);
    if (!normalized) return errorResult("Enter a valid http:// or https:// URL.");
    const { supabase, profile } = await currentProfile(ctx);
    if (!profile) return errorResult("No profile yet — claim a username in the LTReee dashboard first.");
    const { count } = await supabase
      .from("links")
      .select("id", { count: "exact", head: true })
      .eq("profile_id", profile.id);
    const { data, error } = await supabase
      .from("links")
      .insert({
        profile_id: profile.id,
        title,
        url: normalized,
        platform: detectPlatform(normalized),
        display_order: count ?? 0,
      })
      .select()
      .single();
    if (error) return errorResult(error.message);
    return jsonResult({ link: data });
  },
});
