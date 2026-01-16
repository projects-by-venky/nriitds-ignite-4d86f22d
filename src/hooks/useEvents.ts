import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBackendClient } from '@/integrations/backend/client';
import { Event, EventInsert, EventType, EventStatus, ScheduleItem } from '@/types/events';

export const useEvents = (month?: Date) => {
  return useQuery({
    queryKey: ['events', month?.toISOString()],
    queryFn: async () => {
      const supabase = getBackendClient();

      let query = supabase
        .from('events')
        .select('*')
        .eq('is_published', true)
        .order('start_date', { ascending: true });

      if (month) {
        const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
        const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
        
        query = query
          .gte('start_date', startOfMonth.toISOString().split('T')[0])
          .lte('start_date', endOfMonth.toISOString().split('T')[0]);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map(event => ({
        ...event,
        event_type: event.event_type as EventType,
        status: event.status as EventStatus,
        schedule: (Array.isArray(event.schedule) ? event.schedule : []) as unknown as ScheduleItem[],
      })) as Event[];
    },
  });
};

export const useEvent = (id: string) => {
  return useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const supabase = getBackendClient();

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return {
        ...data,
        event_type: data.event_type as EventType,
        status: data.status as EventStatus,
        schedule: (Array.isArray(data.schedule) ? data.schedule : []) as unknown as ScheduleItem[],
      } as Event;
    },
    enabled: !!id,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (event: EventInsert) => {
      const supabase = getBackendClient();

      // Convert schedule to JSON-compatible format
      const insertData: Record<string, unknown> = {
        ...event,
        schedule: event.schedule ? JSON.parse(JSON.stringify(event.schedule)) : [],
      };

      const { data, error } = await supabase
        .from('events')
        .insert(insertData as never)
        .select()
        .single();

      if (error) throw error;
      
      return {
        ...data,
        event_type: data.event_type as EventType,
        status: data.status as EventStatus,
        schedule: (Array.isArray(data.schedule) ? data.schedule : []) as unknown as ScheduleItem[],
      } as Event;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...event }: Partial<EventInsert> & { id: string }) => {
      const supabase = getBackendClient();

      const updateData: Record<string, unknown> = {
        ...event,
        schedule: event.schedule ? JSON.parse(JSON.stringify(event.schedule)) : undefined,
      };

      const { data, error } = await supabase
        .from('events')
        .update(updateData as never)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      return {
        ...data,
        event_type: data.event_type as EventType,
        status: data.status as EventStatus,
        schedule: (Array.isArray(data.schedule) ? data.schedule : []) as unknown as ScheduleItem[],
      } as Event;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', variables.id] });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = getBackendClient();

      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};
