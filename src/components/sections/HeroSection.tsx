import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import FloatingParticles from "@/components/3d/FloatingParticles";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero text-white">
      {/* 3D Floating Particles Background */}
      <FloatingParticles />
      
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, hsl(217 91% 60% / 0.15) 1px, transparent 1px),
                           linear-gradient(to bottom, hsl(189 94% 43% / 0.15) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }} />
      </div>
      
      {/* Glowing Orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse delay-1000" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary/10 backdrop-blur-md border-2 border-primary/30 mb-12 shadow-[0_0_30px_hsl(217_91%_60%_/_0.5)]"
          >
            <Sparkles className="w-5 h-5 text-secondary animate-pulse" />
            <span className="text-base font-bold tracking-wide text-white">Shaping Minds. Building Futures.</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, type: "spring" }}
            className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight"
          >
            <span className="block text-white">
              Empowering Innovation.
            </span>
            <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mt-2">
              Inspiring Excellence.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-xl md:text-2xl text-white/80 mb-16 max-w-4xl mx-auto leading-relaxed font-light"
            style={{ textShadow: '0 0 20px hsl(182 59% 56% / 0.3)' }}
          >
            Shaping the future through technology, creativity, and purpose.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px hsl(217 91% 60% / 0.8)" }}
              whileTap={{ scale: 0.98 }}
              className="bg-primary text-white px-10 py-5 rounded-xl font-bold text-lg shadow-[0_0_30px_hsl(217_91%_60%_/_0.5)] transition-all duration-300 flex items-center gap-3"
            >
              lets see
              <ArrowRight className="w-6 h-6" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px hsl(182 59% 56% / 0.6)" }}
              whileTap={{ scale: 0.98 }}
              className="bg-transparent border-2 border-secondary text-secondary px-10 py-5 rounded-xl font-bold text-lg hover:bg-secondary/10 transition-all duration-300"
            >
              Join Our Community
            </motion.button>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-12 mt-32 pt-16 border-t border-white/20"
          >
            {[
              { value: "10,000+", label: "Students", color: "primary" },
              { value: "50+", label: "Programs", color: "secondary" },
              { value: "200+", label: "Expert Faculty", color: "primary" },
              { value: "95%", label: "Placements", color: "secondary" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.1 + index * 0.15, type: "spring" }}
                whileHover={{ scale: 1.1, y: -8 }}
                className="text-center group"
              >
                <div 
                  className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent group-hover:animate-pulse"
                  style={{ 
                    filter: `drop-shadow(0 0 20px hsl(217 91% 60% / 0.5))` 
                  }}
                >
                  {stat.value}
                </div>
                <div className="text-white/70 text-sm font-semibold tracking-wide uppercase">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
