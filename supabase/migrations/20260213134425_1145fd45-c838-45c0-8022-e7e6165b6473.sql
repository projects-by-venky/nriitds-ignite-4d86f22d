
-- 1. Drop and recreate events_public with SECURITY INVOKER
DROP VIEW IF EXISTS public.events_public CASCADE;

CREATE VIEW public.events_public WITH (security_invoker=on) AS
SELECT
    id,
    event_type,
    status,
    start_date,
    end_date,
    start_time,
    end_time,
    registration_required,
    registration_deadline,
    schedule,
    is_published,
    created_at,
    updated_at,
    CASE WHEN public.is_admin_or_faculty(auth.uid()) THEN student_coordinator ELSE NULL END as student_coordinator,
    CASE WHEN public.is_admin_or_faculty(auth.uid()) THEN student_email ELSE NULL END as student_email,
    CASE WHEN public.is_admin_or_faculty(auth.uid()) THEN student_phone ELSE NULL END as student_phone,
    title,
    description,
    short_description,
    CASE WHEN public.is_admin_or_faculty(auth.uid()) THEN faculty_coordinator ELSE NULL END as faculty_coordinator,
    CASE WHEN public.is_admin_or_faculty(auth.uid()) THEN faculty_email ELSE NULL END as faculty_email,
    CASE WHEN public.is_admin_or_faculty(auth.uid()) THEN faculty_phone ELSE NULL END as faculty_phone,
    venue,
    organized_by,
    department,
    who_can_attend,
    poster_url,
    gallery_urls,
    registration_link,
    attachment_urls
FROM public.events
WHERE is_published = true AND deleted_at IS NULL;

-- 2. Drop and recreate research_projects_public with SECURITY INVOKER
DROP VIEW IF EXISTS public.research_projects_public CASCADE;

CREATE VIEW public.research_projects_public WITH (security_invoker=on) AS
SELECT
    id,
    category,
    contributor_type,
    status,
    approved_at,
    external_links,
    created_at,
    updated_at,
    tools_technologies,
    how_it_was_built,
    outcomes_impact,
    contributor_names,
    roll_numbers,
    year_section,
    designations,
    branch,
    department,
    document_urls,
    image_urls,
    video_urls,
    CASE WHEN public.is_admin_or_faculty(auth.uid()) THEN contact_email ELSE NULL END as contact_email,
    title,
    summary,
    description,
    problem_statement,
    proposed_solution
FROM public.research_projects
WHERE status = 'approved'::approval_status;
