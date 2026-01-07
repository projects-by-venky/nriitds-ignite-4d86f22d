import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import EventsSection from "@/components/sections/EventsSection";
import { motion } from "framer-motion";
import { Calendar, Users, Trophy, Sparkles } from "lucide-react";

const Events = () => {
  const stats = [
    { icon: Calendar, value: "100+", label: "Annual Events" },
    { icon: Users, value: "10K+", label: "Participants" },
    { icon: Trophy, value: "50+", label: "Competitions" },
    { icon: Sparkles, value: "24/7", label: "Activities" },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        {/* Page Hero Header */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative py-24 bg-gradient-hero text-white overflow-hidden"
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
              className="text-5xl md:text-6xl font-bold text-center mb-6 bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent"
            >
              Campus Events & Activities
            </motion.h1>
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-center text-white/80 max-w-3xl mx-auto mb-16"
            >
              Stay connected with exciting events, workshops, and announcements
            </motion.p>
            
            {/* Stats */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-accent/50 hover:shadow-[0_0_30px_rgba(163,113,247,0.3)] transition-all duration-300"
                >
                  <stat.icon className="w-10 h-10 text-secondary mx-auto mb-3" />
                  <div className="text-4xl font-bold mb-2 text-primary">{stat.value}</div>
                  <div className="text-sm text-white/70">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>
        
        <EventsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Events;
