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
    const patch = Object.fromEntries(Object.entries(input).filter(([, v]) => v !== undefined));
    if (Object.keys(patch).length === 0) return errorResult("Provide at least one field to update.");
    const { data, error } = await supabase.from("profiles").update(patch).eq("id", profile.id).select().single();
    if (error) return errorResult(error.message);
    return jsonResult({ profile: data });
  },
});
