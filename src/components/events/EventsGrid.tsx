import { Event } from "@/types/events";
import EventCard from "./EventCard";
import { Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface EventsGridProps {
  events: Event[];
  isLoading?: boolean;
}

const EventsGrid = ({ events, isLoading }: EventsGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-muted/50 rounded-lg h-64" />
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <Calendar className="w-16 h-16 text-muted-foreground/30 mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No Events Found
        </h3>
        <p className="text-muted-foreground max-w-md">
          There are no events scheduled for this month. Check back later or browse other months.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {events.map((event, index) => (
        <EventCard key={event.id} event={event} index={index} />
      ))}
    </div>
  );
};

export default EventsGrid;
