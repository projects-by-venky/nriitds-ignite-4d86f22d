
-- Create announcements table
CREATE TABLE public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  branch TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  target_audience TEXT NOT NULL DEFAULT 'all' CHECK (target_audience IN ('all', 'students', 'faculty')),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active announcements"
ON public.announcements FOR SELECT
USING (is_active = true);

CREATE POLICY "Admin can manage announcements"
ON public.announcements FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "HOD/Faculty can insert announcements"
ON public.announcements FOR INSERT
WITH CHECK (public.is_admin_or_faculty(auth.uid()));

CREATE POLICY "HOD/Faculty can update own announcements"
ON public.announcements FOR UPDATE
USING (created_by = auth.uid() AND public.is_admin_or_faculty(auth.uid()));

CREATE POLICY "HOD/Faculty can delete own announcements"
ON public.announcements FOR DELETE
USING (created_by = auth.uid() AND public.is_admin_or_faculty(auth.uid()));

-- Create notes table
CREATE TABLE public.notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  branch TEXT NOT NULL,
  subject TEXT NOT NULL,
  semester TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  uploaded_by_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active notes"
ON public.notes FOR SELECT
USING (is_active = true);

CREATE POLICY "Admin can manage notes"
ON public.notes FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "HOD/Faculty can insert notes"
ON public.notes FOR INSERT
WITH CHECK (public.is_admin_or_faculty(auth.uid()));

CREATE POLICY "HOD/Faculty can update own notes"
ON public.notes FOR UPDATE
USING (uploaded_by = auth.uid() AND public.is_admin_or_faculty(auth.uid()));

CREATE POLICY "HOD/Faculty can delete own notes"
ON public.notes FOR DELETE
USING (uploaded_by = auth.uid() AND public.is_admin_or_faculty(auth.uid()));

-- Update is_admin_or_faculty to include hod
CREATE OR REPLACE FUNCTION public.is_admin_or_faculty(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role IN ('admin', 'faculty', 'hod')
    )
$$;

-- Create is_hod function
CREATE OR REPLACE FUNCTION public.is_hod(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = 'hod'
    )
$$;

-- Create get_user_branch function
CREATE OR REPLACE FUNCTION public.get_user_branch(_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT department
    FROM public.profiles
    WHERE user_id = _user_id
    LIMIT 1
$$;

-- Update get_user_role to handle hod priority
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT role::TEXT
    FROM public.user_roles
    WHERE user_id = _user_id
    ORDER BY 
        CASE role 
            WHEN 'admin' THEN 1 
            WHEN 'hod' THEN 2
            WHEN 'faculty' THEN 3 
            WHEN 'student' THEN 4 
        END
    LIMIT 1
$$;

-- Storage bucket for notes
INSERT INTO storage.buckets (id, name, public) VALUES ('notes-files', 'notes-files', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view notes files"
ON storage.objects FOR SELECT
USING (bucket_id = 'notes-files');

CREATE POLICY "HOD/Faculty can upload notes files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'notes-files' AND public.is_admin_or_faculty(auth.uid()));

CREATE POLICY "HOD/Faculty can update notes files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'notes-files' AND public.is_admin_or_faculty(auth.uid()));

CREATE POLICY "HOD/Faculty can delete notes files"
ON storage.objects FOR DELETE
USING (bucket_id = 'notes-files' AND public.is_admin_or_faculty(auth.uid()));
