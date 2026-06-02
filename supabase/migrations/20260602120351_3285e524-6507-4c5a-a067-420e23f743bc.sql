
-- Trash Coach posts
CREATE TABLE public.coach_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.coach_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.coach_posts TO authenticated;
GRANT ALL ON public.coach_posts TO service_role;
ALTER TABLE public.coach_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY coach_posts_public_read ON public.coach_posts FOR SELECT USING (true);
CREATE POLICY coach_posts_admin_write ON public.coach_posts FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER coach_posts_updated_at BEFORE UPDATE ON public.coach_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Field agent applications
CREATE TABLE public.agent_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  city text NOT NULL,
  experience text,
  why text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agent_applications TO authenticated;
GRANT INSERT ON public.agent_applications TO anon;
GRANT ALL ON public.agent_applications TO service_role;
ALTER TABLE public.agent_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY agent_apps_public_insert ON public.agent_applications FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY agent_apps_admin_read ON public.agent_applications FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY agent_apps_admin_update ON public.agent_applications FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to record payouts (decrement credits + log ledger)
CREATE POLICY profiles_admin_update ON public.profiles FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY ledger_admin_insert ON public.credit_ledger FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
