import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { format, isSameDay, startOfMonth, endOfMonth, addMonths, subMonths } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Event, 
  EVENT_TYPE_LABELS, 
  EVENT_TYPE_COLORS, 
  EVENT_STATUS_COLORS 
} from "@/types/events";

interface EventCalendarProps {
  events: Event[];
  selectedMonth: Date;
  onMonthChange: (date: Date) => void;
}

const EventCalendar = ({ events, selectedMonth, onMonthChange }: EventCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.start_date), date));
  };

  // Get all dates that have events
  const eventDates = events.map(event => new Date(event.start_date));

  // Custom modifiers for calendar
  const modifiers = {
    hasEvent: eventDates,
  };

  const modifiersStyles = {
    hasEvent: {
      backgroundColor: 'hsl(var(--primary) / 0.2)',
      borderRadius: '50%',
      fontWeight: 'bold',
    },
  };

  // Selected date events
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  const formatTime = (time?: string) => {
    if (!time) return null;
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return format(date, 'h:mm a');
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Calendar */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" />
              {format(selectedMonth, 'MMMM yyyy')}
            </CardTitle>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onMonthChange(subMonths(selectedMonth, 1))}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onMonthChange(addMonths(selectedMonth, 1))}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            month={selectedMonth}
            onMonthChange={onMonthChange}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            className="rounded-md"
          />
        </CardContent>
      </Card>

      {/* Selected Date Events */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">
            {selectedDate 
              ? format(selectedDate, 'EEEE, MMMM d, yyyy')
              : 'Select a date'
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {selectedDate ? (
              selectedDateEvents.length > 0 ? (
                <motion.div
                  key={selectedDate.toISOString()}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  {selectedDateEvents.map((event) => (
                    <Link 
                      key={event.id} 
                      to={`/events/${event.id}`}
                      className="block"
                    >
                      <motion.div
                        whileHover={{ x: 4 }}
                        className="p-4 rounded-lg border border-border/50 bg-muted/30 hover:border-primary/50 hover:bg-muted/50 transition-all cursor-pointer group"
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h4 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {event.title}
                          </h4>
                          <Badge className={`${EVENT_TYPE_COLORS[event.event_type]} border text-xs flex-shrink-0`}>
                            {EVENT_TYPE_LABELS[event.event_type]}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1 text-sm text-muted-foreground">
                          {event.start_time && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-3.5 h-3.5" />
                              <span>
                                {formatTime(event.start_time)}
                                {event.end_time && ` - ${formatTime(event.end_time)}`}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5" />
                            <span className="truncate">{event.venue}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-end mt-3 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          View Details <ArrowRight className="ml-1 w-3 h-3" />
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="no-events"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <CalendarIcon className="w-12 h-12 text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground">No events on this date</p>
                </motion.div>
              )
            ) : (
              <motion.div
                key="select-date"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <CalendarIcon className="w-12 h-12 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">
                  Click on a date to see events
                </p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Highlighted dates have events
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventCalendar;
