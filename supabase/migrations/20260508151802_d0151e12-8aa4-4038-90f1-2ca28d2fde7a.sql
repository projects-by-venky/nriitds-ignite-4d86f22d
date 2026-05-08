
DROP POLICY IF EXISTS "Authenticated users can upload research files" ON storage.objects;
CREATE POLICY "Admin/faculty can upload research files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'research-files' AND is_admin_or_faculty(auth.uid()));

DROP POLICY IF EXISTS "Anyone can view research files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view event files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view notes files" ON storage.objects;

DROP VIEW IF EXISTS public.events_public;
CREATE VIEW public.events_public
WITH (security_invoker = true) AS
SELECT
  id, title, description, short_description, event_type, status,
  start_date, end_date, start_time, end_time, venue, organized_by,
  department, who_can_attend, schedule, registration_required,
  registration_link, registration_deadline,
  faculty_coordinator, student_coordinator,
  poster_url, gallery_urls, attachment_urls,
  is_published, created_at, updated_at
FROM public.events
WHERE is_published = true AND deleted_at IS NULL;

GRANT SELECT ON public.events_public TO anon, authenticated;

DROP POLICY IF EXISTS "Anyone can view published non-deleted events" ON public.events;
DROP POLICY IF EXISTS "Public can view published events" ON public.events;

DROP VIEW IF EXISTS public.research_projects_public;
CREATE VIEW public.research_projects_public
WITH (security_invoker = true) AS
SELECT
  id, created_at, updated_at, title, category, summary, description,
  problem_statement, proposed_solution, tools_technologies, how_it_was_built,
  outcomes_impact, contributor_type, contributor_names, year_section,
  designations, branch, department, document_urls, image_urls, video_urls,
  external_links, status, approved_at
FROM public.research_projects
WHERE status = 'approved';

GRANT SELECT ON public.research_projects_public TO anon, authenticated;

DROP POLICY IF EXISTS "Anyone can view approved projects" ON public.research_projects;
DROP POLICY IF EXISTS "Public can view approved research projects" ON public.research_projects;

DROP POLICY IF EXISTS "Authenticated users can view student analytics" ON public.student_analytics;
CREATE POLICY "Admin/faculty can view student analytics"
ON public.student_analytics FOR SELECT
TO authenticated
USING (is_admin_or_faculty(auth.uid()));
