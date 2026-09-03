-- Fix 1: profiles_email_phone_exposure
-- Revoke broad anon column access on profiles; re-grant only safe public columns.
REVOKE SELECT (email, phone) ON public.profiles FROM anon;

-- Ensure anon can only read non-sensitive columns directly
GRANT SELECT (id, username, display_name, bio, avatar_url, location, website_url, is_published, created_at) ON public.profiles TO anon;

-- Fix 2: public_contacts_no_publish_check
-- Public contacts are only readable when the profile is published and the owner opted in.
DROP POLICY IF EXISTS "Opt-in contacts are public" ON public.public_contacts;

CREATE POLICY "Published opt-in contacts are public"
ON public.public_contacts
FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = public_contacts.profile_id
      AND p.is_published = true
      AND (
        (p.show_email = true AND public_contacts.email IS NOT NULL)
        OR (p.show_phone = true AND public_contacts.phone IS NOT NULL)
      )
  )
);