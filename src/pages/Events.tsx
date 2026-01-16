import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useEvents } from "@/hooks/useEvents";
import EventsGrid from "@/components/events/EventsGrid";
import EventCalendar from "@/components/events/EventCalendar";
import ViewToggle from "@/components/events/ViewToggle";
import MonthSelector from "@/components/events/MonthSelector";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Calendar, Users, Trophy, Sparkles, Plus } from "lucide-react";

type ViewType = 'card' | 'calendar';

const Events = () => {
  const [viewType, setViewType] = useState<ViewType>('card');
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  
  const { data: events = [], isLoading } = useEvents(selectedMonth);

  const stats = [
    { icon: Calendar, value: "100+", label: "Annual Events" },
    { icon: Users, value: "10K+", label: "Participants" },
    { icon: Trophy, value: "50+", label: "Competitions" },
    { icon: Sparkles, value: "24/7", label: "Activities" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Page Hero Header */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative py-20 md:py-24 bg-gradient-hero text-white overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(to right, hsl(217 91% 60% / 0.15) 1px, transparent 1px),
                               linear-gradient(to bottom, hsl(189 94% 43% / 0.15) 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }} />
          </div>
          
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.h1 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4 bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent"
            >
              College Events
            </motion.h1>
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-center text-white/80 max-w-3xl mx-auto mb-12"
            >
              Stay updated with all academic, cultural, and technical events at NRIIT
            </motion.p>
            
            {/* Stats */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="text-center p-4 md:p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-accent/50 hover:shadow-[0_0_30px_rgba(163,113,247,0.3)] transition-all duration-300"
                >
                  <stat.icon className="w-8 h-8 md:w-10 md:h-10 text-secondary mx-auto mb-2 md:mb-3" />
                  <div className="text-2xl md:text-4xl font-bold mb-1 md:mb-2 text-primary">{stat.value}</div>
                  <div className="text-xs md:text-sm text-white/70">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>
        
        {/* Events Content */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            {/* Controls */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8"
            >
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <ViewToggle currentView={viewType} onViewChange={setViewType} />
                <MonthSelector selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
              </div>
              
              {/* Add Event Button - Visible to all for now */}
              <Link to="/events/upload">
                <Button className="gap-2 shadow-lg shadow-primary/20">
                  <Plus className="h-4 w-4" />
                  Add New Event
                </Button>
              </Link>
            </motion.div>

            {/* View Content */}
            <motion.div
              key={viewType}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {viewType === 'card' ? (
                <EventsGrid events={events} isLoading={isLoading} />
              ) : (
                <EventCalendar 
                  events={events} 
                  selectedMonth={selectedMonth}
                  onMonthChange={setSelectedMonth}
                />
              )}
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Events;
