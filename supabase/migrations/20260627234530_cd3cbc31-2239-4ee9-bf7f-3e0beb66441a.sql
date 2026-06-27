-- 1) Remove agent access from credit_ledger; keep admin + owner read.
DROP POLICY IF EXISTS ledger_admin_select ON public.credit_ledger;
CREATE POLICY ledger_admin_select ON public.credit_ledger
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 2) Add WITH CHECK to pickups_update_own_pending so users can't escalate status/credits.
DROP POLICY IF EXISTS pickups_update_own_pending ON public.pickup_requests;
CREATE POLICY pickups_update_own_pending ON public.pickup_requests
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'pending'
    AND credits_awarded = 0
    AND reviewed_by IS NULL
    AND reviewed_at IS NULL
  );
