import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import FloatingParticles from "@/components/3d/FloatingParticles";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* 3D Particle Background */}
      <FloatingParticles />
      
      {/* Premium Gradient Background */}
      <div className="absolute inset-0 gradient-hero"></div>
      
      {/* Crystal Mesh Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, hsl(180 100% 50%) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Elite Wave Overlays */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,_hsl(180_100%_50%_/_0.4),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,_hsl(262_85%_62%_/_0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_70%,_hsl(324_70%_58%_/_0.3),transparent_50%)]"></div>
      </div>

      {/* Floating Premium Orbs */}
      <motion.div
        className="absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl opacity-40"
        style={{
          background: "radial-gradient(circle, hsl(180 100% 50%), transparent)"
        }}
        animate={{
          y: [0, -40, 0],
          x: [0, 30, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute bottom-20 right-10 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-40"
        style={{
          background: "radial-gradient(circle, hsl(324 70% 58%), transparent)"
        }}
        animate={{
          y: [0, 40, 0],
          x: [0, -30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      
      <motion.div
        className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full blur-3xl opacity-30"
        style={{
          background: "radial-gradient(circle, hsl(262 85% 62%), transparent)",
          transform: "translate(-50%, -50%)"
        }}
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          {/* Premium Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full glass-premium mb-10 shadow-neon border border-primary/40"
          >
            <GraduationCap className="w-6 h-6 text-primary animate-pulse" />
            <span className="text-sm font-bold text-foreground tracking-wide">Elite Engineering Education Platform</span>
            <Sparkles className="w-5 h-5 text-accent" />
          </motion.div>

          {/* Metallic Liquid Motion Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <h1 className="text-8xl md:text-[10rem] font-black mb-8 leading-none">
              <motion.span 
                className="block text-5xl md:text-6xl font-light text-muted-foreground mb-6 tracking-wide"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Building the Future
              </motion.span>
              <motion.span 
                className="block text-metallic drop-shadow-2xl tracking-tight"
                animate={{
                  textShadow: [
                    "0 0 30px hsl(180 100% 50%), 0 0 60px hsl(180 100% 50%)",
                    "0 0 40px hsl(262 85% 62%), 0 0 80px hsl(262 85% 62%)",
                    "0 0 40px hsl(324 70% 58%), 0 0 80px hsl(324 70% 58%)",
                    "0 0 30px hsl(180 100% 50%), 0 0 60px hsl(180 100% 50%)"
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{
                  filter: "drop-shadow(0 0 40px rgba(0, 255, 255, 0.6))"
                }}
              >
                NRIITDS
              </motion.span>
              <motion.span 
                className="block text-5xl md:text-7xl font-light text-foreground mt-6 tracking-wide"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                Engineering College
              </motion.span>
            </h1>
          </motion.div>

          {/* Elite Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-2xl md:text-3xl text-muted-foreground mb-14 max-w-5xl mx-auto font-light leading-relaxed"
          >
            <span className="text-primary font-semibold">Engineer by Engineer</span>, shaping tomorrow with 
            <span className="text-accent font-semibold"> Intelligence</span> and <span className="text-secondary font-semibold">Innovation</span>
          </motion.p>

          {/* Premium CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20"
          >
            <motion.div
              whileHover={{ scale: 1.08, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <div className="absolute -inset-1 gradient-neon opacity-70 rounded-3xl blur-lg group-hover:opacity-100 transition duration-500"></div>
              <Button 
                size="lg" 
                className="relative gradient-3d text-white shadow-neon hover:shadow-metallic transition-all duration-500 group px-12 py-8 text-xl font-bold rounded-3xl border border-primary/30"
              >
                🎓 Explore Courses
                <ArrowRight className="ml-3 group-hover:translate-x-3 transition-transform duration-300" />
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.08, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <div className="absolute -inset-1 gradient-secondary opacity-60 rounded-3xl blur-lg group-hover:opacity-90 transition duration-500"></div>
              <Button 
                size="lg" 
                className="relative glass-premium border-2 border-accent/60 text-foreground hover:border-accent hover:bg-accent/20 shadow-glow-purple transition-all duration-500 px-12 py-8 text-xl font-bold rounded-3xl"
              >
                🚀 Student Login
              </Button>
            </motion.div>
          </motion.div>

          {/* Elite Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {[
              { label: "Engineering Programs", value: "8+", gradient: "primary", icon: "🎓" },
              { label: "Future Engineers", value: "5000+", gradient: "secondary", icon: "👨‍🎓" },
              { label: "Career Success", value: "95%", gradient: "accent", icon: "🚀" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                whileHover={{ 
                  y: -15,
                  scale: 1.05
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative group"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-accent to-secondary rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative glass-premium rounded-3xl p-10 border border-primary/30 hover:border-primary/60 hover:shadow-metallic transition-all duration-500">
                  <div className="text-6xl mb-4">{stat.icon}</div>
                  <div className={`text-6xl font-black mb-4 gradient-${stat.gradient} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm font-semibold uppercase tracking-widest">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Elite Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-8 h-12 border-2 border-primary/60 rounded-full flex items-start justify-center p-2 shadow-glow"
        >
          <motion.div
            animate={{ y: [0, 16, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-4 bg-primary rounded-full shadow-neon"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
