import { auth, defineMcp } from "@lovable.dev/mcp-js";
import getProfile from "./tools/get-profile";
import updateProfile from "./tools/update-profile";
import listLinks from "./tools/list-links";
import createLink from "./tools/create-link";
import updateLink from "./tools/update-link";
import deleteLink from "./tools/delete-link";

const projectRef = import.meta.env['VITE_SUPABASE_PROJECT_ID'] ?? "project-ref-unset";

export default defineMcp({
  name: "link-orbit-hub",
  title: "Link Orbit Hub",
  version: "0.1.0",
  instructions:
    "Tools for LTReee, a link-in-bio page builder. Read and edit the signed-in user's profile (username, display name, bio, location, website, published state) and the links on their page. Use `get_profile` and `list_links` first; link ids come from `list_links`.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [getProfile, updateProfile, listLinks, createLink, updateLink, deleteLink] as unknown as Parameters<typeof defineMcp>[0]["tools"],
});
