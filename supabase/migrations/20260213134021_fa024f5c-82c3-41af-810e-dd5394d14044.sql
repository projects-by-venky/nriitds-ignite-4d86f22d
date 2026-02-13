
-- 1. Replace overly permissive research_projects INSERT policy with authenticated-only
DROP POLICY IF EXISTS "Anyone can submit projects" ON public.research_projects;

CREATE POLICY "Authenticated users can submit projects"
ON public.research_projects
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 2. Add admin/faculty UPDATE policy for research project management
CREATE POLICY "Admin/faculty can update research projects"
ON public.research_projects
FOR UPDATE
TO authenticated
USING (public.is_admin_or_faculty(auth.uid()));

-- 3. Add admin/faculty DELETE policy for research project management
CREATE POLICY "Admin/faculty can delete research projects"
ON public.research_projects
FOR DELETE
TO authenticated
USING (public.is_admin_or_faculty(auth.uid()));

-- 4. Add admin/faculty SELECT policy to see all projects (including pending/rejected)
CREATE POLICY "Admin/faculty can view all projects"
ON public.research_projects
FOR SELECT
TO authenticated
USING (public.is_admin_or_faculty(auth.uid()));
