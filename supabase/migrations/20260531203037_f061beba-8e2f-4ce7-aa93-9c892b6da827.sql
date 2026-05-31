
-- Add search_path to set_updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Revoke execute from public/anon, keep authenticated for has_role only
revoke execute on function public.has_role(uuid, public.app_role) from public, anon;
grant execute on function public.has_role(uuid, public.app_role) to authenticated;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.award_pickup_credits() from public, anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;
