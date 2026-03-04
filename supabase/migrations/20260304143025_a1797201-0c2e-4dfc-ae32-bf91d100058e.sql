
-- Student analytics table for attendance and results tracking
CREATE TABLE public.student_analytics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    roll_number text NOT NULL,
    name text NOT NULL,
    branch text NOT NULL,
    semester text NOT NULL DEFAULT '1-1',
    section text NOT NULL DEFAULT 'A',
    monthly_attendance jsonb NOT NULL DEFAULT '{}'::jsonb,
    monthly_results jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index for fast roll number + branch lookups
CREATE INDEX idx_student_analytics_roll_branch ON public.student_analytics(roll_number, branch);
CREATE INDEX idx_student_analytics_branch ON public.student_analytics(branch);

-- Enable RLS
ALTER TABLE public.student_analytics ENABLE ROW LEVEL SECURITY;

-- Anyone can view student analytics (read-only for students)
CREATE POLICY "Anyone can view student analytics"
ON public.student_analytics FOR SELECT
USING (true);

-- Admin can manage all student analytics
CREATE POLICY "Admin can manage student analytics"
ON public.student_analytics FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- HOD/Faculty can insert student analytics for their branch
CREATE POLICY "HOD/Faculty can insert student analytics"
ON public.student_analytics FOR INSERT
WITH CHECK (is_admin_or_faculty(auth.uid()));

-- HOD/Faculty can update student analytics
CREATE POLICY "HOD/Faculty can update student analytics"
ON public.student_analytics FOR UPDATE
USING (is_admin_or_faculty(auth.uid()));

-- HOD/Faculty can delete student analytics
CREATE POLICY "HOD/Faculty can delete student analytics"
ON public.student_analytics FOR DELETE
USING (is_admin_or_faculty(auth.uid()));
