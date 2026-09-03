import { defineTool } from "@lovable.dev/mcp-js";
import { currentProfile, jsonResult, notAuthed } from "./shared";

export default defineTool({
  name: "list_links",
  title: "List my links",
  description: "List all links on the signed-in user's LTReee page, in display order.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthed;
    const { supabase, profile } = await currentProfile(ctx);
    if (!profile) return jsonResult({ links: [], hint: "No profile yet — claim a username in the LTReee dashboard." });
    const { data, error } = await supabase
      .from("links")
      .select("*")
      .eq("profile_id", profile.id)
      .order("display_order", { ascending: true });
    if (error) return { content: [{ type: "text" as const, text: error.message }], isError: true };
    return jsonResult({ links: data ?? [] });
  },
});
