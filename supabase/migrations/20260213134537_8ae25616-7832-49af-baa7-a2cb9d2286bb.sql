
-- Add RLS policies to events table to restrict public view access
-- Only allow anonymous/authenticated users to see published, non-deleted events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published events" ON public.events;

CREATE POLICY "Public can view published events"
ON public.events
FOR SELECT
USING (is_published = true AND deleted_at IS NULL);

-- Add RLS policies to research_projects table to restrict public view access
-- Only allow access to approved projects
ALTER TABLE public.research_projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view approved research projects" ON public.research_projects;

CREATE POLICY "Public can view approved research projects"
ON public.research_projects
FOR SELECT
USING (status = 'approved'::approval_status);
