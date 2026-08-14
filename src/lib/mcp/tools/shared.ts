import type { ToolContext } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

export const notAuthed = {
  content: [{ type: "text" as const, text: "Not authenticated. Connect your LinkOrbit account first." }],
  isError: true,
};

export function errorResult(message: string) {
  return { content: [{ type: "text" as const, text: message }], isError: true };
}

export function jsonResult(value: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }],
    structuredContent: value as Record<string, unknown>,
  };
}

/** Resolves the signed-in user's profile row, or null when they haven't claimed a username. */
export async function currentProfile(ctx: ToolContext) {
  const supabase = supabaseForUser(ctx);
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", ctx.getUserId()!)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return { supabase, profile: data };
}
