-- 1. Public, opt-in contact mirror
CREATE TABLE IF NOT EXISTS public.public_contacts (
  profile_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  email text,
  phone text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.public_contacts TO anon, authenticated;
GRANT ALL ON public.public_contacts TO service_role;

ALTER TABLE public.public_contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Opt-in contacts are public" ON public.public_contacts;
CREATE POLICY "Opt-in contacts are public"
  ON public.public_contacts FOR SELECT TO anon, authenticated USING (true);

-- 2. Keep the mirror in sync; only published + opted-in values are ever written
CREATE OR REPLACE FUNCTION public.sync_public_contacts()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email text;
  v_phone text;
BEGIN
  v_email := CASE WHEN NEW.is_published AND NEW.show_email THEN NEW.email END;
  v_phone := CASE WHEN NEW.is_published AND NEW.show_phone THEN NEW.phone END;

  IF v_email IS NULL AND v_phone IS NULL THEN
    DELETE FROM public.public_contacts WHERE profile_id = NEW.id;
  ELSE
    INSERT INTO public.public_contacts (profile_id, email, phone, updated_at)
    VALUES (NEW.id, v_email, v_phone, now())
    ON CONFLICT (profile_id)
    DO UPDATE SET email = EXCLUDED.email, phone = EXCLUDED.phone, updated_at = now();
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sync_public_contacts_trg ON public.profiles;
CREATE TRIGGER sync_public_contacts_trg
AFTER INSERT OR UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.sync_public_contacts();

-- Backfill
INSERT INTO public.public_contacts (profile_id, email, phone)
SELECT p.id,
       CASE WHEN p.is_published AND p.show_email THEN p.email END,
       CASE WHEN p.is_published AND p.show_phone THEN p.phone END
FROM public.profiles p
WHERE (p.is_published AND p.show_email AND p.email IS NOT NULL)
   OR (p.is_published AND p.show_phone AND p.phone IS NOT NULL)
ON CONFLICT (profile_id) DO UPDATE
  SET email = EXCLUDED.email, phone = EXCLUDED.phone, updated_at = now();

-- 3. Anonymous visitors get row + column limited access to profiles
REVOKE SELECT ON public.profiles FROM anon;
GRANT SELECT (id, user_id, username, display_name, bio, avatar_url, location, website_url, is_published, created_at, updated_at)
  ON public.profiles TO anon;

DROP POLICY IF EXISTS "Published profiles are public" ON public.profiles;
CREATE POLICY "Published profiles are public"
  ON public.profiles FOR SELECT TO anon USING (is_published = true);

-- 4. Rebuild the public view as SECURITY INVOKER
DROP VIEW IF EXISTS public.public_profiles;
CREATE VIEW public.public_profiles
WITH (security_invoker = on) AS
SELECT
  p.id,
  p.user_id,
  p.username,
  p.display_name,
  p.bio,
  p.avatar_url,
  p.location,
  p.website_url,
  p.is_published,
  c.email,
  c.phone
FROM public.profiles p
LEFT JOIN public.public_contacts c ON c.profile_id = p.id
WHERE p.is_published = true;

GRANT SELECT ON public.public_profiles TO anon, authenticated;
GRANT ALL ON public.public_profiles TO service_role;