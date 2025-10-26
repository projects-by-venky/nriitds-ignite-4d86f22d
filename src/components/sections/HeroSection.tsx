import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import FloatingParticles from "@/components/3d/FloatingParticles";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* 3D Particle Background */}
      <FloatingParticles />
      
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 gradient-hero"></div>
      
      {/* AI Wave Pattern Overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_hsl(261_100%_70%_/_0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_hsl(188_100%_60%_/_0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_hsl(261_100%_70%_/_0.3),transparent_50%)]"></div>
      </div>

      {/* Floating Neon Orbs */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 rounded-full blur-3xl opacity-50"
        style={{
          background: "radial-gradient(circle, hsl(261 100% 70%), transparent)"
        }}
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute bottom-20 right-10 w-80 h-80 rounded-full blur-3xl opacity-50"
        style={{
          background: "radial-gradient(circle, hsl(188 100% 60%), transparent)"
        }}
        animate={{
          y: [0, 30, 0],
          x: [0, -20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Glassmorphic Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass-effect mb-8 shadow-glow border border-primary/30"
          >
            <Sparkles className="w-5 h-5 text-primary-glow animate-pulse" />
            <span className="text-sm font-semibold text-foreground">AI-Powered Engineering Education Platform</span>
          </motion.div>

          {/* 3D Animated Main Heading */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-7xl md:text-9xl font-black mb-6 leading-none">
              <motion.span 
                className="block text-4xl md:text-5xl font-light text-muted-foreground mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Welcome to
              </motion.span>
              <motion.span 
                className="block gradient-neon bg-clip-text text-transparent text-neon drop-shadow-2xl"
                animate={{
                  textShadow: [
                    "0 0 20px hsl(261 100% 70%), 0 0 40px hsl(261 100% 70%)",
                    "0 0 40px hsl(188 100% 60%), 0 0 60px hsl(188 100% 60%)",
                    "0 0 20px hsl(261 100% 70%), 0 0 40px hsl(261 100% 70%)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                NRIITDS
              </motion.span>
              <motion.span 
                className="block text-4xl md:text-6xl font-light text-foreground mt-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                Engineering College
              </motion.span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto font-light leading-relaxed"
          >
            Empowering Future Engineers with <span className="text-primary font-semibold">Innovation</span> and <span className="text-accent font-semibold">Intelligence</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                className="gradient-3d text-white shadow-neon hover:shadow-glow transition-all duration-300 group px-10 py-7 text-lg font-semibold rounded-2xl"
              >
                Explore Courses
                <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                className="glass-effect border-2 border-accent/50 text-foreground hover:border-accent hover:bg-accent/10 shadow-glow-cyan transition-all duration-300 px-10 py-7 text-lg font-semibold rounded-2xl"
              >
                Login as Student
              </Button>
            </motion.div>
          </motion.div>

          {/* Animated Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {[
              { label: "B.Tech Programs", value: "8+", color: "primary" },
              { label: "Active Students", value: "5000+", color: "accent" },
              { label: "Placement Rate", value: "95%", color: "primary" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                whileHover={{ 
                  y: -10,
                  scale: 1.05
                }}
                transition={{ duration: 0.3 }}
                className="glass-effect rounded-2xl p-8 border border-primary/20 hover:border-primary/50 hover:shadow-neon transition-all duration-300 group"
              >
                <div className={`text-5xl font-black mb-3 gradient-${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-primary/50 rounded-full flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-3 bg-primary rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
