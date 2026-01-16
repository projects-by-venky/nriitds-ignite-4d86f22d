-- Create enum for event types
CREATE TYPE public.event_type AS ENUM (
  'festival',
  'workshop',
  'seminar',
  'sports',
  'cultural',
  'technical',
  'other'
);

-- Create enum for event status
CREATE TYPE public.event_status AS ENUM (
  'draft',
  'upcoming',
  'ongoing',
  'completed',
  'cancelled'
);

-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  event_type public.event_type NOT NULL DEFAULT 'other',
  status public.event_status NOT NULL DEFAULT 'upcoming',
  
  -- Date and time
  start_date DATE NOT NULL,
  end_date DATE,
  start_time TIME,
  end_time TIME,
  
  -- Location
  venue TEXT NOT NULL,
  
  -- Organizer info
  organized_by TEXT NOT NULL,
  department TEXT,
  
  -- Event details
  who_can_attend TEXT DEFAULT 'Open to all',
  schedule JSONB DEFAULT '[]'::jsonb,
  
  -- Registration
  registration_required BOOLEAN DEFAULT false,
  registration_link TEXT,
  registration_deadline TIMESTAMP WITH TIME ZONE,
  
  -- Contact info
  faculty_coordinator TEXT,
  faculty_email TEXT,
  faculty_phone TEXT,
  student_coordinator TEXT,
  student_email TEXT,
  student_phone TEXT,
  
  -- Media
  poster_url TEXT,
  gallery_urls TEXT[] DEFAULT '{}'::text[],
  attachment_urls TEXT[] DEFAULT '{}'::text[],
  
  -- Visibility
  is_published BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (anyone can view published events)
CREATE POLICY "Anyone can view published events"
ON public.events
FOR SELECT
USING (is_published = true);

-- Create policy for inserting events (anyone for now, will be restricted to auth users later)
CREATE POLICY "Anyone can create events"
ON public.events
FOR INSERT
WITH CHECK (true);

-- Create policy for updating events
CREATE POLICY "Anyone can update events"
ON public.events
FOR UPDATE
USING (true);

-- Create policy for deleting events
CREATE POLICY "Anyone can delete events"
ON public.events
FOR DELETE
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW
EXECUTE FUNCTION public.update_events_updated_at();

-- Create storage bucket for event files
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-files', 'event-files', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for event files
CREATE POLICY "Anyone can view event files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'event-files');

CREATE POLICY "Anyone can upload event files"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'event-files');

CREATE POLICY "Anyone can update event files"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'event-files');

CREATE POLICY "Anyone can delete event files"
ON storage.objects
FOR DELETE
USING (bucket_id = 'event-files');