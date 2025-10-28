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
          {/* Glowing Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary/10 backdrop-blur-md border-2 border-primary/30 mb-12 shadow-[0_0_30px_rgba(37,99,235,0.3)]"
          >
            <Zap className="w-5 h-5 text-secondary animate-pulse" />
            <span className="text-base font-bold tracking-wide">Innovating Education. Empowering Minds.</span>
          </motion.div>

          {/* Cinematic Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, type: "spring" }}
            className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight"
          >
            <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-pulse">
              Welcome to
            </span>
            <span className="block text-white mt-2">
              NRI Institutions
            </span>
          </motion.h1>

          {/* Subtitle with Glow */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-2xl md:text-3xl text-white/90 mb-16 max-w-4xl mx-auto leading-relaxed font-light"
            style={{ textShadow: '0 0 20px rgba(34, 211, 238, 0.3)' }}
          >
            Building the Future of Learning — A Digital Ecosystem Uniting All Branches, Courses, and People
          </motion.p>

          {/* Neon CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary text-white px-10 py-5 rounded-xl font-bold text-xl shadow-[0_0_30px_rgba(37,99,235,0.5)] hover:shadow-[0_0_50px_rgba(37,99,235,0.8)] transition-all duration-300 flex items-center gap-3 border-2 border-primary/50"
            >
              Explore Courses
              <ArrowRight className="w-6 h-6" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border-2 border-secondary text-secondary px-10 py-5 rounded-xl font-bold text-xl hover:bg-secondary/10 hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] transition-all duration-300"
            >
              Join Community
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border-2 border-accent text-accent px-10 py-5 rounded-xl font-bold text-xl hover:bg-accent/10 hover:shadow-[0_0_40px_rgba(163,113,247,0.6)] transition-all duration-300"
            >
              Student Login
            </motion.button>
          </motion.div>

          {/* Neon Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-12 mt-32 pt-16 border-t-2 border-primary/30"
          >
            {[
              { value: "1L+", label: "Active Users", color: "primary" },
              { value: "50+", label: "Programs", color: "secondary" },
              { value: "200+", label: "Expert Faculty", color: "accent" },
              { value: "100%", label: "Placement Focus", color: "primary" }
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
                  className={`text-5xl md:text-6xl font-black mb-3 bg-gradient-to-r from-${stat.color} to-${stat.color === 'primary' ? 'secondary' : 'accent'} bg-clip-text text-transparent group-hover:animate-pulse`}
                  style={{ 
                    filter: `drop-shadow(0 0 20px ${stat.color === 'primary' ? 'rgba(37,99,235,0.5)' : stat.color === 'secondary' ? 'rgba(34,211,238,0.5)' : 'rgba(163,113,247,0.5)'})` 
                  }}
                >
                  {stat.value}
                </div>
                <div className="text-white/80 text-base font-semibold tracking-wide">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
