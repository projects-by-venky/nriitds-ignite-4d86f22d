import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getBackendClient } from '@/integrations/backend/client';
import { useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Trash2, 
  RotateCcw, 
  Calendar, 
  MapPin, 
  Loader2,
  AlertTriangle,
  CheckCircle,
  Archive,
  Pencil
} from 'lucide-react';
import { Event, EVENT_STATUS_LABELS, EVENT_STATUS_COLORS, EVENT_TYPE_LABELS, ScheduleItem } from '@/types/events';

interface EventManageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Helper to parse schedule from JSON
const parseSchedule = (schedule: unknown): ScheduleItem[] | null => {
  if (!schedule) return null;
  if (Array.isArray(schedule)) {
    return schedule as ScheduleItem[];
  }
  if (typeof schedule === 'string') {
    try {
      return JSON.parse(schedule);
    } catch {
      return null;
    }
  }
  return null;
};

const EventManageDialog = ({ open, onOpenChange }: EventManageDialogProps) => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'active' | 'deleted'>('active');
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch all events including deleted ones for admin
  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const supabase = getBackendClient();
      
      // For admin/faculty, fetch all events
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: false });
      
      if (error) throw error;
      
      // Parse schedule for each event
      const parsedEvents = (data || []).map(event => ({
        ...event,
        schedule: parseSchedule(event.schedule),
      })) as Event[];
      
      setEvents(parsedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: 'Failed to load events',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch events when dialog opens
  useEffect(() => {
    if (open) {
      fetchEvents();
    }
  }, [open]);

  // Filter events based on search and tab
  const filteredEvents = useMemo(() => {
    let filtered = events;
    
    // Filter by tab
    if (activeTab === 'active') {
      filtered = filtered.filter(e => !e.deleted_at);
    } else {
      filtered = filtered.filter(e => e.deleted_at);
    }
    
    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(e => 
        e.title.toLowerCase().includes(query) ||
        e.venue.toLowerCase().includes(query) ||
        e.organized_by.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [events, activeTab, searchQuery]);

  // Soft delete event
  const handleSoftDelete = async (event: Event) => {
    setIsProcessing(true);
    try {
      const supabase = getBackendClient();
      
      const { error } = await supabase
        .from('events')
        .update({ 
          deleted_at: new Date().toISOString(),
          deleted_by: user?.id 
        })
        .eq('id', event.id);
      
      if (error) throw error;
      
      toast({
        title: 'Event removed',
        description: 'The event has been archived and hidden from students.',
      });
      
      // Refresh events
      await fetchEvents();
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setEventToDelete(null);
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: 'Failed to remove event',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Restore deleted event
  const handleRestore = async (event: Event) => {
    setIsProcessing(true);
    try {
      const supabase = getBackendClient();
      
      const { error } = await supabase
        .from('events')
        .update({ 
          deleted_at: null,
          deleted_by: null 
        })
        .eq('id', event.id);
      
      if (error) throw error;
      
      toast({
        title: 'Event restored',
        description: 'The event is now visible again.',
      });
      
      // Refresh events
      await fetchEvents();
      queryClient.invalidateQueries({ queryKey: ['events'] });
    } catch (error) {
      console.error('Error restoring event:', error);
      toast({
        title: 'Failed to restore event',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Permanently delete event (admin only)
  const handlePermanentDelete = async (event: Event) => {
    if (!isAdmin) return;
    
    setIsProcessing(true);
    try {
      const supabase = getBackendClient();
      
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', event.id);
      
      if (error) throw error;
      
      toast({
        title: 'Event permanently deleted',
        description: 'The event has been permanently removed.',
      });
      
      await fetchEvents();
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setEventToDelete(null);
    } catch (error) {
      console.error('Error permanently deleting event:', error);
      toast({
        title: 'Failed to delete event',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const activeCount = events.filter(e => !e.deleted_at).length;
  const deletedCount = events.filter(e => e.deleted_at).length;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[85vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl">Manage Events</DialogTitle>
            <DialogDescription>
              View, archive, or restore events. Archived events are hidden from students.
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 pt-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'active' | 'deleted')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="active" className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Active ({activeCount})
                </TabsTrigger>
                <TabsTrigger value="deleted" className="gap-2">
                  <Archive className="h-4 w-4" />
                  Archived ({deletedCount})
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[400px] mt-4">
                {isLoading ? (
                  <div className="flex items-center justify-center h-48">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredEvents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-center">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                      <Calendar className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">
                      {activeTab === 'active' ? 'No active events found' : 'No archived events'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 pr-4">
                    <AnimatePresence>
                      {filteredEvents.map((event, index) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: index * 0.05 }}
                          className={`p-4 rounded-xl border transition-all ${
                            event.deleted_at 
                              ? 'bg-muted/50 border-border/50' 
                              : 'bg-card hover:bg-accent/5 border-border'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h3 className={`font-semibold truncate ${event.deleted_at ? 'text-muted-foreground' : ''}`}>
                                  {event.title}
                                </h3>
                                <Badge 
                                  variant="secondary" 
                                  className={`text-xs ${EVENT_STATUS_COLORS[event.status]}`}
                                >
                                  {EVENT_STATUS_LABELS[event.status]}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {EVENT_TYPE_LABELS[event.event_type]}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {format(new Date(event.start_date), 'MMM d, yyyy')}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5" />
                                  {event.venue}
                                </span>
                              </div>
                              
                              <p className="text-xs text-muted-foreground mt-1">
                                By {event.organized_by}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              {event.deleted_at ? (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleRestore(event)}
                                    disabled={isProcessing}
                                    className="gap-1.5"
                                  >
                                    <RotateCcw className="h-3.5 w-3.5" />
                                    Restore
                                  </Button>
                                  {isAdmin && (
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => setEventToDelete(event)}
                                      disabled={isProcessing}
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  )}
                                </>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      onOpenChange(false);
                                      navigate(`/events/edit/${event.id}`);
                                    }}
                                    disabled={isProcessing}
                                    className="gap-1.5"
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setEventToDelete(event)}
                                    disabled={isProcessing}
                                    className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Remove
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </ScrollArea>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!eventToDelete} onOpenChange={() => setEventToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              {eventToDelete?.deleted_at ? 'Permanently Delete Event?' : 'Remove Event?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {eventToDelete?.deleted_at ? (
                <>
                  This will <span className="font-semibold text-destructive">permanently delete</span> "{eventToDelete.title}". 
                  This action cannot be undone.
                </>
              ) : (
                <>
                  Are you sure you want to remove "{eventToDelete?.title}"? 
                  This will hide it from students but it can be restored later.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (eventToDelete) {
                  if (eventToDelete.deleted_at) {
                    handlePermanentDelete(eventToDelete);
                  } else {
                    handleSoftDelete(eventToDelete);
                  }
                }
              }}
              disabled={isProcessing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : eventToDelete?.deleted_at ? (
                'Delete Permanently'
              ) : (
                'Remove Event'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EventManageDialog;
