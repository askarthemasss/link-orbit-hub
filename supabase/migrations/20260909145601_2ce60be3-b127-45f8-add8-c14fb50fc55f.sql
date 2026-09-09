-- Defense in depth: anonymous visitors may only read non-sensitive profile columns.
REVOKE SELECT ON public.profiles FROM anon;

GRANT SELECT (
  id, user_id, username, display_name, bio, avatar_url,
  location, website_url, is_published, show_email, show_phone,
  created_at, updated_at
) ON public.profiles TO anon;

-- email and phone are intentionally NOT granted to anon; public contact
-- details are exposed only via public.public_contacts / public.public_profiles.
