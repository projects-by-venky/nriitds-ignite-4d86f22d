-- Fix 1: Restrict syllabus_reviews access to authenticated users only
DROP POLICY IF EXISTS "Anyone can view syllabus reviews" ON public.syllabus_reviews;

CREATE POLICY "Authenticated users can view syllabus reviews"
ON public.syllabus_reviews
FOR SELECT
TO authenticated
USING (true);

-- Fix 2: Restrict research project contact email visibility
-- Create a view that hides contact_email for non-admin/faculty
CREATE OR REPLACE VIEW public.research_projects_public AS
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
    -- Only show contact_email to admin/faculty
    CASE 
        WHEN public.is_admin_or_faculty(auth.uid()) THEN contact_email
        ELSE NULL
    END as contact_email
FROM public.research_projects
WHERE status = 'approved';

-- Fix 3: Update profiles policy to only allow viewing own profile
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (user_id = auth.uid());

-- Allow admin/faculty to view all profiles for management purposes
CREATE POLICY "Admin/faculty can view all profiles"
ON public.profiles
FOR SELECT
USING (public.is_admin_or_faculty(auth.uid()));

-- Fix 4: Create a safe events view that hides contact info for public
CREATE OR REPLACE VIEW public.events_public AS
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
    -- Only show contact info to admin/faculty
    CASE WHEN public.is_admin_or_faculty(auth.uid()) THEN faculty_coordinator ELSE NULL END as faculty_coordinator,
    CASE WHEN public.is_admin_or_faculty(auth.uid()) THEN faculty_email ELSE NULL END as faculty_email,
    CASE WHEN public.is_admin_or_faculty(auth.uid()) THEN faculty_phone ELSE NULL END as faculty_phone,
    CASE WHEN public.is_admin_or_faculty(auth.uid()) THEN student_coordinator ELSE NULL END as student_coordinator,
    CASE WHEN public.is_admin_or_faculty(auth.uid()) THEN student_email ELSE NULL END as student_email,
    CASE WHEN public.is_admin_or_faculty(auth.uid()) THEN student_phone ELSE NULL END as student_phone
FROM public.events
WHERE is_published = true AND deleted_at IS NULL;

-- Fix 5: Add update/delete policies for syllabus_reviews (teachers can edit their own)
CREATE POLICY "Teachers can update own reviews"
ON public.syllabus_reviews
FOR UPDATE
TO authenticated
USING (email = (SELECT email FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Teachers can delete own reviews"
ON public.syllabus_reviews
FOR DELETE
TO authenticated
USING (email = (SELECT email FROM public.profiles WHERE user_id = auth.uid()));