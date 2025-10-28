import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AboutSection from "@/components/sections/AboutSection";
import ChatBot from "@/components/ai/ChatBot";
import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        {/* Page Hero Header */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative py-20 bg-gradient-hero text-white overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(to right, hsl(217 91% 60% / 0.15) 1px, transparent 1px),
                               linear-gradient(to bottom, hsl(189 94% 43% / 0.15) 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }} />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.h1 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold text-center mb-6 bg-gradient-to-r from-secondary via-primary to-accent bg-clip-text text-transparent"
            >
              About NRI Institutions
            </motion.h1>
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-center text-white/80 max-w-3xl mx-auto"
            >
              Discover our legacy, mission, and the values that drive excellence in education
            </motion.p>
          </div>
        </motion.section>
        
        <AboutSection />
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default About;
