-- Fix 1: Replace overly permissive public SELECT on student_analytics
DROP POLICY IF EXISTS "Anyone can view student analytics" ON public.student_analytics;

CREATE POLICY "Authenticated users can view student analytics"
ON public.student_analytics
FOR SELECT
TO authenticated
USING (true);

-- Fix 2: Add UPDATE and DELETE policies for research-files storage bucket
CREATE POLICY "Admin/faculty can update research files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'research-files' AND is_admin_or_faculty(auth.uid()));

CREATE POLICY "Admin/faculty can delete research files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'research-files' AND is_admin_or_faculty(auth.uid()));