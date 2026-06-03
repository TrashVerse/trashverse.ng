-- 1. Lock down profiles.total_credits: revoke broad UPDATE, grant column-level UPDATE only on safe columns
REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (full_name, phone, updated_at) ON public.profiles TO authenticated;
-- Admin/service operations still work via existing policies + service_role grants
GRANT UPDATE ON public.profiles TO service_role;

-- 2. Fix pickup credit fraud: always recalculate credits_awarded from waste_categories on approval/completion
CREATE OR REPLACE FUNCTION public.award_pickup_credits()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  new_balance numeric;
  calculated numeric;
begin
  if new.status in ('approved','completed') and old.status not in ('approved','completed') then
    -- Always recalculate from trusted source; ignore any client-supplied credits_awarded
    if new.category_id is not null then
      select round(new.estimated_weight_kg * wc.credits_per_kg, 2)
        into calculated
      from public.waste_categories wc where wc.id = new.category_id;
      new.credits_awarded = coalesce(calculated, 0);
    else
      new.credits_awarded = 0;
    end if;

    update public.profiles
      set total_credits = total_credits + coalesce(new.credits_awarded, 0)
      where id = new.user_id
      returning total_credits into new_balance;

    insert into public.credit_ledger (user_id, pickup_request_id, amount, balance_after, reason)
    values (
      new.user_id,
      new.id,
      coalesce(new.credits_awarded, 0),
      coalesce(new_balance, 0),
      'Pickup ' || new.status
    );

    new.reviewed_at = now();
  end if;
  return new;
end;
$function$;

-- 3. Restrict EXECUTE on SECURITY DEFINER has_role to authenticated only (used in RLS via auth.uid())
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- 4. Tighten agent_applications public insert: enforce minimal validation rather than blanket true
DROP POLICY IF EXISTS agent_apps_public_insert ON public.agent_applications;
CREATE POLICY agent_apps_public_insert ON public.agent_applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(full_name) BETWEEN 2 AND 120
    AND char_length(email) BETWEEN 5 AND 255
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND char_length(phone) BETWEEN 5 AND 30
    AND char_length(city) BETWEEN 2 AND 120
    AND (experience IS NULL OR char_length(experience) <= 2000)
    AND (why IS NULL OR char_length(why) <= 2000)
  );
