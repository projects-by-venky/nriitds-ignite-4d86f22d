import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CoursesSection from "@/components/sections/CoursesSection";
import ChatBot from "@/components/ai/ChatBot";
import { motion } from "framer-motion";
import { BookOpen, Code, Beaker, Building2, Brain, Heart } from "lucide-react";

const Courses = () => {
  const highlights = [
    { icon: BookOpen, label: "50+ Programs", color: "primary" },
    { icon: Code, label: "Industry-Ready Skills", color: "secondary" },
    { icon: Beaker, label: "Research Labs", color: "accent" },
    { icon: Building2, label: "Modern Infrastructure", color: "primary" },
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
          
          <div className="absolute top-10 right-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-secondary/20 rounded-full blur-[100px]" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.h1 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold text-center mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
            >
              Explore Our Programs
            </motion.h1>
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-center text-white/80 max-w-3xl mx-auto mb-12"
            >
              Comprehensive academic programs designed to shape future leaders and innovators
            </motion.p>
            
            {/* Highlights */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              {highlights.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  className="flex flex-col items-center gap-3 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(37,99,235,0.3)] transition-all duration-300"
                >
                  <item.icon className="w-8 h-8 text-secondary" />
                  <span className="text-sm font-semibold text-center">{item.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>
        
        <CoursesSection />
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Courses;
