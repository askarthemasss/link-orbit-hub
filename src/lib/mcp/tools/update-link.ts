import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { detectPlatform } from "@/lib/platforms";
import { normalizeUrl } from "@/lib/validation";
import { currentProfile, errorResult, jsonResult, notAuthed } from "./shared";

export default defineTool({
  name: "update_link",
  title: "Update a link",
  description: "Change the title, URL, visibility or position of one of the signed-in user's links.",
  inputSchema: {
    id: z.string().uuid().describe("Link id from list_links."),
    title: z.string().trim().min(1).max(60).optional(),
    url: z.string().trim().min(1).optional().describe("New destination URL (http/https)."),
    is_active: z.boolean().optional().describe("Whether the link is visible on the public page."),
    display_order: z.number().int().min(0).optional(),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ id, url, ...rest }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthed;
    const { supabase, profile } = await currentProfile(ctx);
    if (!profile) return errorResult("No profile yet — claim a username in the LinkOrbit dashboard first.");
    const patch: Record<string, unknown> = Object.fromEntries(
      Object.entries(rest).filter(([, v]) => v !== undefined),
    );
    if (url !== undefined) {
      const normalized = normalizeUrl(url);
      if (!normalized) return errorResult("Enter a valid http:// or https:// URL.");
      patch.url = normalized;
      patch.platform = detectPlatform(normalized);
    }
    if (Object.keys(patch).length === 0) return errorResult("Provide at least one field to update.");
    const { data, error } = await supabase
      .from("links")
      .update(patch)
      .eq("id", id)
      .eq("profile_id", profile.id)
      .select()
      .maybeSingle();
    if (error) return errorResult(error.message);
    if (!data) return errorResult("No link with that id on your page.");
    return jsonResult({ link: data });
  },
});
