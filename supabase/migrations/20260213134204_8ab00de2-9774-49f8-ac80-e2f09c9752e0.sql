
-- Fix research_projects INSERT policy
DROP POLICY IF EXISTS "Authenticated users can submit projects" ON public.research_projects;
CREATE POLICY "Authenticated users can submit projects"
ON public.research_projects
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- Fix syllabus_reviews INSERT policy - restrict to authenticated users
DROP POLICY IF EXISTS "Anyone can submit syllabus reviews" ON public.syllabus_reviews;
CREATE POLICY "Authenticated users can submit syllabus reviews"
ON public.syllabus_reviews
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);
