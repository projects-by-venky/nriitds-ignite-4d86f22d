-- Fix the security definer views by dropping them and using security invoker
DROP VIEW IF EXISTS public.research_projects_public;
DROP VIEW IF EXISTS public.events_public;

-- Recreate research_projects view with security invoker
CREATE VIEW public.research_projects_public
WITH (security_invoker = true)
AS
SELECT 
    id,
    title,
    summary,
    description,
    problem_statement,
    proposed_solution,
    tools_technologies,
    how_it_was_built,
    outcomes_impact,
    contributor_names,
    roll_numbers,
    year_section,
    designations,
    branch,
    department,
    category,
    contributor_type,
    status,
    approved_at,
    document_urls,
    image_urls,
    video_urls,
    external_links,
    created_at,
    updated_at,
    CASE 
        WHEN public.is_admin_or_faculty(auth.uid()) THEN contact_email
        ELSE NULL
    END as contact_email
FROM public.research_projects
WHERE status = 'approved';

-- Recreate events view with security invoker
CREATE VIEW public.events_public
WITH (security_invoker = true)
AS
SELECT 
    id,
    title,
    description,
    short_description,
    event_type,
    status,
    start_date,
    end_date,
    start_time,
    end_time,
    venue,
    organized_by,
    department,
    who_can_attend,
    poster_url,
    gallery_urls,
    registration_required,
    registration_link,
    registration_deadline,
    attachment_urls,
    schedule,
    is_published,
    created_at,
    updated_at,
    CASE WHEN public.is_admin_or_faculty(auth.uid()) THEN faculty_coordinator ELSE NULL END as faculty_coordinator,
    CASE WHEN public.is_admin_or_faculty(auth.uid()) THEN faculty_email ELSE NULL END as faculty_email,
    CASE WHEN public.is_admin_or_faculty(auth.uid()) THEN faculty_phone ELSE NULL END as faculty_phone,
    CASE WHEN public.is_admin_or_faculty(auth.uid()) THEN student_coordinator ELSE NULL END as student_coordinator,
    CASE WHEN public.is_admin_or_faculty(auth.uid()) THEN student_email ELSE NULL END as student_email,
    CASE WHEN public.is_admin_or_faculty(auth.uid()) THEN student_phone ELSE NULL END as student_phone
FROM public.events
WHERE is_published = true AND deleted_at IS NULL;