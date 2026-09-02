ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS phone text;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_email_format_chk
  CHECK (email IS NULL OR email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$') NOT VALID;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_phone_format_chk
  CHECK (phone IS NULL OR phone ~ '^\+?[0-9 ()-]{5,20}$') NOT VALID;