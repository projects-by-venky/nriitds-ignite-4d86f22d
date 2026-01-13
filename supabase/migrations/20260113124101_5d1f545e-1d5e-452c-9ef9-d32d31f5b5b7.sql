
-- Create syllabus_reviews table to store form submissions
CREATE TABLE public.syllabus_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  branch TEXT NOT NULL,
  semester TEXT NOT NULL,
  section TEXT NOT NULL,
  email TEXT NOT NULL,
  subject_type TEXT NOT NULL CHECK (subject_type IN ('Theory', 'Lab')),
  teacher_name TEXT NOT NULL,
  hours_planned INTEGER NOT NULL,
  hours_completed INTEGER NOT NULL,
  percentage_completion NUMERIC(5,2) NOT NULL,
  hours_required INTEGER NOT NULL,
  units_completed INTEGER NOT NULL,
  unit_in_progress TEXT NOT NULL,
  teaching_notes_digitization NUMERIC(5,2) NOT NULL,
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.syllabus_reviews ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert reviews (faculty don't need login)
CREATE POLICY "Anyone can submit syllabus reviews"
ON public.syllabus_reviews
FOR INSERT
WITH CHECK (true);

-- Allow anyone to view reviews (for admin purposes later)
CREATE POLICY "Anyone can view syllabus reviews"
ON public.syllabus_reviews
FOR SELECT
USING (true);

-- Create index for faster queries by branch/semester/section
CREATE INDEX idx_syllabus_reviews_branch_semester ON public.syllabus_reviews(branch, semester, section);
