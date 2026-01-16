export type EventType = 'festival' | 'workshop' | 'seminar' | 'sports' | 'cultural' | 'technical' | 'other';
export type EventStatus = 'draft' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface ScheduleItem {
  time: string;
  activity: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  short_description?: string;
  event_type: EventType;
  status: EventStatus;
  start_date: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  venue: string;
  organized_by: string;
  department?: string;
  who_can_attend?: string;
  schedule?: ScheduleItem[];
  registration_required?: boolean;
  registration_link?: string;
  registration_deadline?: string;
  faculty_coordinator?: string;
  faculty_email?: string;
  faculty_phone?: string;
  student_coordinator?: string;
  student_email?: string;
  student_phone?: string;
  poster_url?: string;
  gallery_urls?: string[];
  attachment_urls?: string[];
  is_published?: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface EventInsert {
  title: string;
  description: string;
  short_description?: string;
  event_type: EventType;
  status?: EventStatus;
  start_date: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  venue: string;
  organized_by: string;
  department?: string;
  who_can_attend?: string;
  schedule?: ScheduleItem[];
  registration_required?: boolean;
  registration_link?: string;
  registration_deadline?: string;
  faculty_coordinator?: string;
  faculty_email?: string;
  faculty_phone?: string;
  student_coordinator?: string;
  student_email?: string;
  student_phone?: string;
  poster_url?: string;
  gallery_urls?: string[];
  attachment_urls?: string[];
  is_published?: boolean;
}

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  festival: 'Festival',
  workshop: 'Workshop',
  seminar: 'Seminar',
  sports: 'Sports',
  cultural: 'Cultural',
  technical: 'Technical',
  other: 'Other'
};

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  draft: 'Draft',
  upcoming: 'Upcoming',
  ongoing: 'Ongoing',
  completed: 'Completed',
  cancelled: 'Cancelled'
};

export const EVENT_TYPE_COLORS: Record<EventType, string> = {
  festival: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  workshop: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  seminar: 'bg-green-500/20 text-green-400 border-green-500/30',
  sports: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  cultural: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  technical: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  other: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
};

export const EVENT_STATUS_COLORS: Record<EventStatus, string> = {
  draft: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  upcoming: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  ongoing: 'bg-green-500/20 text-green-400 border-green-500/30',
  completed: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30'
};
