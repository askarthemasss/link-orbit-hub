import { defineTool } from "@lovable.dev/mcp-js";
import { currentProfile, jsonResult, notAuthed } from "./shared";

export default defineTool({
  name: "get_profile",
  title: "Get my LinkOrbit profile",
  description: "Return the signed-in user's LinkOrbit profile: username, display name, bio, location, website and publish state.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthed;
    const { profile } = await currentProfile(ctx);
    if (!profile) return jsonResult({ profile: null, hint: "No profile yet — claim a username in the LinkOrbit dashboard." });
    return jsonResult({ profile });
  },
});
