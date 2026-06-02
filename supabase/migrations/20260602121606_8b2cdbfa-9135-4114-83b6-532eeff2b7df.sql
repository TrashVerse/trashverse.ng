
-- Admin access codes: each admin needs a personal access code to sign in.
CREATE TABLE public.admin_credentials (
  user_id uuid PRIMARY KEY,
  access_code text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_credentials TO authenticated;
GRANT ALL ON public.admin_credentials TO service_role;

ALTER TABLE public.admin_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_creds_admin_all" ON public.admin_credentials
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Self-verify (so an admin can verify their own code at login time).
CREATE POLICY "admin_creds_self_select" ON public.admin_credentials
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER admin_credentials_set_updated_at
BEFORE UPDATE ON public.admin_credentials
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Admin login logs.
CREATE TABLE public.admin_login_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  email text,
  success boolean NOT NULL DEFAULT true,
  reason text,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.admin_login_logs TO authenticated;
GRANT ALL ON public.admin_login_logs TO service_role;

ALTER TABLE public.admin_login_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_logs_admin_select" ON public.admin_login_logs
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Any authenticated user attempting admin login can record their own attempt.
CREATE POLICY "admin_logs_insert_own" ON public.admin_login_logs
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Enforce max 5 admins.
CREATE OR REPLACE FUNCTION public.enforce_max_admins()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role = 'admin' THEN
    IF (SELECT count(*) FROM public.user_roles WHERE role = 'admin') >= 5 THEN
      RAISE EXCEPTION 'Maximum of 5 admins allowed';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER enforce_max_admins_trg
BEFORE INSERT ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.enforce_max_admins();
