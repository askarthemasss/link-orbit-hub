UPDATE public.profiles SET website_url = NULL WHERE website_url IS NOT NULL AND website_url !~* '^https?://';

ALTER TABLE public.profiles
  ADD CONSTRAINT website_url_safe CHECK (website_url IS NULL OR website_url ~* '^https?://');

DROP FUNCTION IF EXISTS public.is_username_available(text);