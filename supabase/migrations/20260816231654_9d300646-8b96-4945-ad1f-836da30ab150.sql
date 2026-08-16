ALTER TABLE public.links DROP CONSTRAINT IF EXISTS links_url_safe;
ALTER TABLE public.links ADD CONSTRAINT links_url_safe CHECK (url ~* '^https?://[^\s]+$');
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS website_url_safe;
ALTER TABLE public.profiles ADD CONSTRAINT website_url_safe CHECK (website_url IS NULL OR website_url = '' OR website_url ~* '^https?://[^\s]+$');