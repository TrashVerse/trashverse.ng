
-- 1. Credit ledger table
CREATE TABLE public.credit_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  pickup_request_id uuid,
  amount numeric NOT NULL,
  balance_after numeric NOT NULL,
  reason text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_credit_ledger_user_created ON public.credit_ledger(user_id, created_at DESC);

GRANT SELECT, INSERT ON public.credit_ledger TO authenticated;
GRANT ALL ON public.credit_ledger TO service_role;

ALTER TABLE public.credit_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY ledger_select_own ON public.credit_ledger
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY ledger_admin_select ON public.credit_ledger
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'supervisor'::app_role));

-- 2. Update award trigger to also write ledger entry
CREATE OR REPLACE FUNCTION public.award_pickup_credits()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
declare
  new_balance numeric;
begin
  if new.status in ('approved','completed') and old.status not in ('approved','completed') then
    if coalesce(new.credits_awarded, 0) = 0 and new.category_id is not null then
      select round(new.estimated_weight_kg * wc.credits_per_kg, 2)
        into new.credits_awarded
      from public.waste_categories wc where wc.id = new.category_id;
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

-- 3. Allow admins to view all profiles (for user management)
CREATE POLICY profiles_admin_select ON public.profiles
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 4. Allow admins to view all user_roles (existing policy covers ALL for admin via has_role, but roles_select_own restricts non-admins). Confirm admins can also list. roles_admin_all already grants SELECT for admins.
