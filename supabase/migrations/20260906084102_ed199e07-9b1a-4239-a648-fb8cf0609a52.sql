ALTER TABLE public.links ADD COLUMN IF NOT EXISTS is_private boolean NOT NULL DEFAULT false;

DROP POLICY IF EXISTS "Active links on published profiles are public" ON public.links;
CREATE POLICY "Active links on published profiles are public"
ON public.links FOR SELECT TO anon, authenticated
USING (
  is_active = true
  AND is_private = false
  AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = links.profile_id AND p.is_published = true)
);