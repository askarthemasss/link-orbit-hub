CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL DEFAULT ''::text,
  demo_url text,
  repo_url text,
  cover_path text,
  tags text[] NOT NULL DEFAULT '{}'::text[],
  display_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT projects_demo_url_scheme CHECK (demo_url IS NULL OR demo_url ~* '^https?://'),
  CONSTRAINT projects_repo_url_scheme CHECK (repo_url IS NULL OR repo_url ~* '^https?://'),
  CONSTRAINT projects_title_len CHECK (char_length(title) BETWEEN 1 AND 120),
  CONSTRAINT projects_description_len CHECK (char_length(description) <= 600)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT SELECT ON public.projects TO anon;
GRANT ALL ON public.projects TO service_role;

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners manage their projects"
ON public.projects FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = projects.profile_id AND p.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = projects.profile_id AND p.user_id = auth.uid()));

CREATE POLICY "Visible projects on published profiles are public"
ON public.projects FOR SELECT TO anon, authenticated
USING (is_visible = true AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = projects.profile_id AND p.is_published = true));

CREATE INDEX projects_profile_order_idx ON public.projects (profile_id, display_order);

CREATE TRIGGER projects_updated_at BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.project_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  project_title text NOT NULL DEFAULT ''::text,
  kind text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT project_events_kind CHECK (kind IN ('view', 'demo_click', 'repo_click'))
);

GRANT SELECT ON public.project_events TO authenticated;
GRANT ALL ON public.project_events TO service_role;

ALTER TABLE public.project_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners read their project events"
ON public.project_events FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = project_events.profile_id AND p.user_id = auth.uid()));

CREATE INDEX project_events_profile_idx ON public.project_events (profile_id, created_at DESC);
CREATE INDEX project_events_project_idx ON public.project_events (project_id);