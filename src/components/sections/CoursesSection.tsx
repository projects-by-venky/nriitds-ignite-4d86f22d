import { motion } from "framer-motion";
import { Code, Cpu, Zap, Wrench, Building, Lightbulb, Brain, Factory } from "lucide-react";

const courses = [
  {
    title: "Computer Science & Engineering",
    short: "CSE",
    icon: Code,
    color: "hsl(261 90% 65%)",
    description: "Master software development, AI, and cutting-edge computing technologies"
  },
  {
    title: "Electronics & Communication",
    short: "ECE",
    icon: Cpu,
    color: "hsl(188 100% 50%)",
    description: "Explore embedded systems, IoT, and wireless communication"
  },
  {
    title: "Electrical Engineering",
    short: "EE",
    icon: Zap,
    color: "hsl(261 90% 65%)",
    description: "Power systems, renewable energy, and electrical automation"
  },
  {
    title: "Mechanical Engineering",
    short: "ME",
    icon: Wrench,
    color: "hsl(188 100% 50%)",
    description: "Design, manufacturing, and thermal engineering solutions"
  },
  {
    title: "Civil Engineering",
    short: "CE",
    icon: Building,
    color: "hsl(261 90% 65%)",
    description: "Infrastructure, construction management, and urban planning"
  },
  {
    title: "AI & Data Science",
    short: "AI&DS",
    icon: Brain,
    color: "hsl(188 100% 50%)",
    description: "Machine learning, deep learning, and big data analytics"
  },
  {
    title: "Information Technology",
    short: "IT",
    icon: Lightbulb,
    color: "hsl(261 90% 65%)",
    description: "Web development, cloud computing, and cybersecurity"
  },
  {
    title: "Industrial Engineering",
    short: "IE",
    icon: Factory,
    color: "hsl(188 100% 50%)",
    description: "Process optimization, supply chain, and operations management"
  }
];

const CoursesSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-background"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_hsl(261_90%_65%_/_0.15),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_hsl(188_100%_50%_/_0.15),transparent_50%)]"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-6 py-2 rounded-full glass-effect border border-primary/30 mb-6"
          >
            <span className="text-sm font-semibold text-primary">B.Tech Programs</span>
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl font-black mb-6">
            <span className="gradient-neon bg-clip-text text-transparent">Explore Courses</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose from our cutting-edge engineering programs designed for the future
          </p>
        </motion.div>

        {/* 3D Floating Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {courses.map((course, index) => {
            const Icon = course.icon;
            
            return (
              <motion.div
                key={course.short}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <motion.div
                  whileHover={{ 
                    y: -15,
                    rotateY: 5,
                    rotateX: 5,
                    scale: 1.05
                  }}
                  transition={{ duration: 0.3 }}
                  className="relative group cursor-pointer h-full"
                  style={{ perspective: "1000px" }}
                >
                  <div className="glass-effect rounded-3xl p-8 border border-primary/20 hover:border-primary/50 transition-all duration-300 h-full flex flex-col relative overflow-hidden">
                    {/* Glow Effect on Hover */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at center, ${course.color}15, transparent 70%)`
                      }}
                    />
                    
                    {/* Icon Container */}
                    <motion.div
                      className="w-16 h-16 rounded-2xl glass-effect border border-primary/30 flex items-center justify-center mb-6 relative z-10"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      style={{
                        boxShadow: `0 0 20px ${course.color}40`
                      }}
                    >
                      <Icon 
                        className="w-8 h-8" 
                        style={{ color: course.color }}
                      />
                    </motion.div>

                    {/* Short Name Badge */}
                    <div 
                      className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold mb-4 w-fit"
                      style={{ 
                        background: `linear-gradient(135deg, ${course.color}20, ${course.color}10)`,
                        color: course.color,
                        border: `1px solid ${course.color}30`
                      }}
                    >
                      {course.short}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
                      {course.description}
                    </p>

                    {/* Hover Arrow */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      className="mt-6 flex items-center gap-2 text-sm font-semibold"
                      style={{ color: course.color }}
                    >
                      Explore Program
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="gradient-3d text-white px-10 py-4 rounded-2xl font-semibold shadow-neon hover:shadow-glow transition-all duration-300"
          >
            View All Programs & Branches
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default CoursesSection;
