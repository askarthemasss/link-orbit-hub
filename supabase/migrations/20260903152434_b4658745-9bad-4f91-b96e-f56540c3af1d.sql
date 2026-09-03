create or replace view public.public_profiles as
select
  id,
  user_id,
  username,
  display_name,
  bio,
  avatar_url,
  location,
  website_url,
  is_published,
  case when show_email then email end as email,
  case when show_phone then phone end as phone
from public.profiles
where is_published = true;

grant select on public.public_profiles to anon, authenticated;
grant all on public.public_profiles to service_role;

drop policy "Published profiles are public" on public.profiles;