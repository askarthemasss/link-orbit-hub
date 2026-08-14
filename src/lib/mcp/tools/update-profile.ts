import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { currentProfile, errorResult, jsonResult, notAuthed } from "./shared";

export default defineTool({
  name: "update_profile",
  title: "Update my LinkOrbit profile",
  description: "Update the signed-in user's display name, bio, location, website URL or published state. Only provided fields change.",
  inputSchema: {
    display_name: z.string().trim().max(60).optional().describe("Public display name."),
    bio: z.string().trim().max(280).optional().describe("Short bio shown under the name."),
    location: z.string().trim().max(80).nullable().optional().describe("Location text, or null to clear."),
    website_url: z.string().trim().url().startsWith("http").nullable().optional().describe("Website URL (http/https), or null to clear."),
    is_published: z.boolean().optional().describe("Whether the public page is live."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthed;
    const { supabase, profile } = await currentProfile(ctx);
    if (!profile) return errorResult("No profile yet — claim a username in the LinkOrbit dashboard first.");
    const patch: {
      display_name?: string;
      bio?: string;
      location?: string | null;
      website_url?: string | null;
      is_published?: boolean;
    } = {};
    if (input.display_name !== undefined) patch.display_name = input.display_name;
    if (input.bio !== undefined) patch.bio = input.bio;
    if (input.location !== undefined) patch.location = input.location;
    if (input.website_url !== undefined) patch.website_url = input.website_url;
    if (input.is_published !== undefined) patch.is_published = input.is_published;
    if (Object.keys(patch).length === 0) return errorResult("Provide at least one field to update.");
    const { data, error } = await supabase.from("profiles").update(patch).eq("id", profile.id).select().single();
    if (error) return errorResult(error.message);
    return jsonResult({ profile: data });
  },
});
