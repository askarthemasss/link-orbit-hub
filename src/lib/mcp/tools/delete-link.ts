import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { currentProfile, errorResult, jsonResult, notAuthed } from "./shared";

export default defineTool({
  name: "delete_link",
  title: "Delete a link",
  description: "Permanently remove one of the signed-in user's links from their Novanodes page.",
  inputSchema: { id: z.string().uuid().describe("Link id from list_links.") },
  annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ id }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthed;
    const { supabase, profile } = await currentProfile(ctx);
    if (!profile) return errorResult("No profile yet — claim a username in the Novanodes dashboard first.");
    const { data, error } = await supabase
      .from("links")
      .delete()
      .eq("id", id)
      .eq("profile_id", profile.id)
      .select()
      .maybeSingle();
    if (error) return errorResult(error.message);
    if (!data) return errorResult("No link with that id on your page.");
    return jsonResult({ deleted: data });
  },
});
