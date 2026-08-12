CREATE OR REPLACE FUNCTION public.is_username_available(_username TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT _username ~ '^[a-z0-9_-]{3,30}$'
     AND _username NOT IN ('login','signup','dashboard','settings','api','admin','auth','about','pricing','terms','privacy','help','support','explore','new','me','root','static','assets','public','robots','sitemap')
     AND NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.username = _username AND p.user_id IS DISTINCT FROM auth.uid());
$$;

GRANT EXECUTE ON FUNCTION public.is_username_available(TEXT) TO anon, authenticated;