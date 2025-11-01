import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PlacementsSection from "@/components/sections/PlacementsSection";
import ChatBot from "@/components/ai/ChatBot";

const Placements = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative pt-32 pb-16 bg-gradient-hero text-white overflow-hidden"
        >
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(to right, hsl(217 91% 60% / 0.15) 1px, transparent 1px),
                               linear-gradient(to bottom, hsl(189 94% 43% / 0.15) 1px, transparent 1px)`,
              backgroundSize: '80px 80px'
            }} />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-6xl font-black mb-6">
                Career <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Placements</span>
              </h1>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Building successful careers with top companies across industries
              </p>
            </motion.div>
          </div>
        </motion.section>

        <PlacementsSection />
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Placements;
