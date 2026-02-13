
-- 1. Add constraints to syllabus_reviews for server-side validation
ALTER TABLE public.syllabus_reviews
  ADD CONSTRAINT email_length CHECK (length(email) <= 255),
  ADD CONSTRAINT teacher_name_length CHECK (length(teacher_name) <= 200),
  ADD CONSTRAINT unit_length CHECK (length(unit_in_progress) <= 100),
  ADD CONSTRAINT comments_length CHECK (comments IS NULL OR length(comments) <= 2000),
  ADD CONSTRAINT hours_positive CHECK (hours_planned >= 0 AND hours_completed >= 0 AND hours_required >= 0),
  ADD CONSTRAINT percentage_range CHECK (percentage_completion >= 0 AND percentage_completion <= 100),
  ADD CONSTRAINT units_positive CHECK (units_completed >= 0),
  ADD CONSTRAINT digitization_range CHECK (teaching_notes_digitization >= 0 AND teaching_notes_digitization <= 100),
  ADD CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- 2. Add constraints to profiles table
ALTER TABLE public.profiles
  ADD CONSTRAINT check_full_name_length CHECK (full_name IS NULL OR length(full_name) <= 100),
  ADD CONSTRAINT check_department_length CHECK (department IS NULL OR length(department) <= 100);

-- 3. Restrict storage upload policies - event-files
DROP POLICY IF EXISTS "Anyone can upload event files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update event files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete event files" ON storage.objects;

CREATE POLICY "Admin/faculty can upload event files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'event-files' AND public.is_admin_or_faculty(auth.uid()));

CREATE POLICY "Admin/faculty can update event files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'event-files' AND public.is_admin_or_faculty(auth.uid()));

CREATE POLICY "Admin/faculty can delete event files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'event-files' AND public.is_admin_or_faculty(auth.uid()));

-- 4. Restrict storage upload policies - research-files
DROP POLICY IF EXISTS "Anyone can upload research files" ON storage.objects;

CREATE POLICY "Authenticated users can upload research files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'research-files');
