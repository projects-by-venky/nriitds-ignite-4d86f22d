-- Create enum for contributor types
CREATE TYPE public.contributor_type AS ENUM ('student', 'faculty');

-- Create enum for project categories
CREATE TYPE public.project_category AS ENUM ('research', 'project', 'innovation');

-- Create enum for approval status
CREATE TYPE public.approval_status AS ENUM ('pending', 'approved', 'rejected');

-- Create research_projects table
CREATE TABLE public.research_projects (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    
    -- Basic Info
    title TEXT NOT NULL,
    category project_category NOT NULL,
    summary TEXT NOT NULL,
    description TEXT NOT NULL,
    
    -- Problem & Solution
    problem_statement TEXT NOT NULL,
    proposed_solution TEXT NOT NULL,
    
    -- Technical Details
    tools_technologies TEXT[] NOT NULL DEFAULT '{}',
    how_it_was_built TEXT NOT NULL,
    outcomes_impact TEXT NOT NULL,
    
    -- Contributor Info
    contributor_type contributor_type NOT NULL,
    contributor_names TEXT[] NOT NULL,
    
    -- Student-specific fields (nullable for faculty)
    roll_numbers TEXT[],
    year_section TEXT,
    
    -- Faculty-specific fields (nullable for students)
    designations TEXT[],
    
    -- Common fields
    branch TEXT NOT NULL,
    department TEXT NOT NULL,
    
    -- Media & Resources
    document_urls TEXT[] DEFAULT '{}',
    image_urls TEXT[] DEFAULT '{}',
    video_urls TEXT[] DEFAULT '{}',
    external_links JSONB DEFAULT '[]',
    
    -- Approval
    status approval_status NOT NULL DEFAULT 'pending',
    approved_by UUID,
    approved_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    
    -- Contact
    contact_email TEXT NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.research_projects ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view approved projects
CREATE POLICY "Anyone can view approved projects" 
ON public.research_projects 
FOR SELECT 
USING (status = 'approved');

-- Policy: Anyone can submit projects (will be pending)
CREATE POLICY "Anyone can submit projects" 
ON public.research_projects 
FOR INSERT 
WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_research_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_research_projects_updated_at
BEFORE UPDATE ON public.research_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_research_projects_updated_at();

-- Create storage bucket for research files
INSERT INTO storage.buckets (id, name, public) VALUES ('research-files', 'research-files', true);

-- Storage policies for research files
CREATE POLICY "Anyone can view research files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'research-files');

CREATE POLICY "Anyone can upload research files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'research-files');

-- Add index for faster queries
CREATE INDEX idx_research_projects_status ON public.research_projects(status);
CREATE INDEX idx_research_projects_contributor_type ON public.research_projects(contributor_type);
CREATE INDEX idx_research_projects_category ON public.research_projects(category);