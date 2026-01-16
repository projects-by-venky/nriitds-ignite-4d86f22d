import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { 
  Event, 
  EVENT_TYPE_LABELS, 
  EVENT_STATUS_LABELS, 
  EVENT_TYPE_COLORS, 
  EVENT_STATUS_COLORS 
} from "@/types/events";

interface EventCardProps {
  event: Event;
  index?: number;
}

const EventCard = ({ event, index = 0 }: EventCardProps) => {
  const formatTime = (time?: string) => {
    if (!time) return null;
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return format(date, 'h:mm a');
  };

  const formatDateRange = () => {
    const start = format(new Date(event.start_date), 'MMM d, yyyy');
    if (event.end_date && event.end_date !== event.start_date) {
      const end = format(new Date(event.end_date), 'MMM d, yyyy');
      return `${start} - ${end}`;
    }
    return start;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link to={`/events/${event.id}`}>
        <Card className="overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
          {/* Event Poster */}
          {event.poster_url && (
            <div className="relative h-48 overflow-hidden">
              <img
                src={event.poster_url}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
              <div className="absolute bottom-3 left-3 flex gap-2">
                <Badge className={`${EVENT_TYPE_COLORS[event.event_type]} border`}>
                  {EVENT_TYPE_LABELS[event.event_type]}
                </Badge>
                <Badge className={`${EVENT_STATUS_COLORS[event.status]} border`}>
                  {EVENT_STATUS_LABELS[event.status]}
                </Badge>
              </div>
            </div>
          )}

          <CardContent className={event.poster_url ? "p-5" : "p-5 pt-5"}>
            {/* Badges if no poster */}
            {!event.poster_url && (
              <div className="flex gap-2 mb-3">
                <Badge className={`${EVENT_TYPE_COLORS[event.event_type]} border`}>
                  {EVENT_TYPE_LABELS[event.event_type]}
                </Badge>
                <Badge className={`${EVENT_STATUS_COLORS[event.status]} border`}>
                  {EVENT_STATUS_LABELS[event.status]}
                </Badge>
              </div>
            )}

            {/* Title */}
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
              {event.title}
            </h3>

            {/* Short description */}
            <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
              {event.short_description || event.description}
            </p>

            {/* Event details */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="truncate">{formatDateRange()}</span>
              </div>
              
              {(event.start_time || event.end_time) && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>
                    {formatTime(event.start_time)}
                    {event.end_time && ` - ${formatTime(event.end_time)}`}
                  </span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="truncate">{event.venue}</span>
              </div>
            </div>

            {/* View Details Button */}
            <Button 
              variant="ghost" 
              className="mt-4 w-full justify-center group-hover:bg-primary/10 group-hover:text-primary"
            >
              View Details
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

export default EventCard;
