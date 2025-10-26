import { motion } from "framer-motion";
import { Code, Cpu, Zap, Wrench, Building, Lightbulb, Brain, Factory } from "lucide-react";

const courses = [
  {
    title: "Computer Science & Engineering",
    short: "CSE",
    icon: Code,
    color: "hsl(180 100% 50%)",
    description: "Master software development, AI, and cutting-edge computing technologies"
  },
  {
    title: "Electronics & Communication",
    short: "ECE",
    icon: Cpu,
    color: "hsl(262 85% 62%)",
    description: "Explore embedded systems, IoT, and wireless communication"
  },
  {
    title: "Electrical Engineering",
    short: "EE",
    icon: Zap,
    color: "hsl(324 70% 58%)",
    description: "Power systems, renewable energy, and electrical automation"
  },
  {
    title: "Mechanical Engineering",
    short: "ME",
    icon: Wrench,
    color: "hsl(180 100% 50%)",
    description: "Design, manufacturing, and thermal engineering solutions"
  },
  {
    title: "Civil Engineering",
    short: "CE",
    icon: Building,
    color: "hsl(262 85% 62%)",
    description: "Infrastructure, construction management, and urban planning"
  },
  {
    title: "AI & Data Science",
    short: "AI&DS",
    icon: Brain,
    color: "hsl(324 70% 58%)",
    description: "Machine learning, deep learning, and big data analytics"
  },
  {
    title: "Information Technology",
    short: "IT",
    icon: Lightbulb,
    color: "hsl(180 100% 50%)",
    description: "Web development, cloud computing, and cybersecurity"
  },
  {
    title: "Industrial Engineering",
    short: "IE",
    icon: Factory,
    color: "hsl(262 85% 62%)",
    description: "Process optimization, supply chain, and operations management"
  }
];

const CoursesSection = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-background"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,_hsl(180_100%_50%_/_0.12),transparent_60%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,_hsl(262_85%_62%_/_0.12),transparent_60%)]"></div>
      
      {/* Rotating Grid Lines */}
      <motion.div 
        className="absolute inset-0 opacity-5"
        animate={{ rotate: 360 }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage: `linear-gradient(hsl(180 100% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(180 100% 50%) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Elite Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-8 py-3 rounded-full glass-premium border border-primary/40 mb-8 shadow-glow"
          >
            <span className="text-sm font-bold text-primary tracking-widest">ACADEMIC PROGRAMS</span>
          </motion.div>
          
          <h2 className="text-6xl md:text-7xl font-black mb-8">
            <span className="text-metallic">Elite Courses</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Choose from our premium engineering programs crafted for tomorrow's innovators
          </p>
        </motion.div>

        {/* Premium Floating Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {courses.map((course, index) => {
            const Icon = course.icon;
            
            return (
              <motion.div
                key={course.short}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <motion.div
                  whileHover={{ 
                    y: -20,
                    scale: 1.05,
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="relative group cursor-pointer h-full"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Premium Glow Border */}
                  <div 
                    className="absolute -inset-0.5 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500"
                    style={{
                      background: `linear-gradient(135deg, ${course.color}, transparent)`
                    }}
                  ></div>
                  
                  <div className="relative glass-premium rounded-3xl p-8 border border-primary/20 hover:border-primary/50 transition-all duration-500 h-full flex flex-col overflow-hidden">
                    {/* Animated Background Gradient */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      animate={{
                        background: [
                          `radial-gradient(circle at 0% 0%, ${course.color}15, transparent 60%)`,
                          `radial-gradient(circle at 100% 100%, ${course.color}15, transparent 60%)`,
                          `radial-gradient(circle at 0% 0%, ${course.color}15, transparent 60%)`
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    
                    {/* Icon Container with Rotation */}
                    <motion.div
                      className="w-20 h-20 rounded-2xl glass-effect border border-primary/40 flex items-center justify-center mb-6 relative z-10 group-hover:border-primary/80"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.8 }}
                      style={{
                        boxShadow: `0 0 30px ${course.color}30, 0 0 60px ${course.color}20`
                      }}
                    >
                      <Icon 
                        className="w-10 h-10" 
                        style={{ color: course.color }}
                      />
                    </motion.div>

                    {/* Elite Badge */}
                    <div 
                      className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-black mb-5 w-fit backdrop-blur-sm"
                      style={{ 
                        background: `linear-gradient(135deg, ${course.color}25, ${course.color}10)`,
                        color: course.color,
                        border: `1.5px solid ${course.color}40`,
                        boxShadow: `0 0 20px ${course.color}20`
                      }}
                    >
                      {course.short}
                    </div>

                    {/* Title with Gradient on Hover */}
                    <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-all duration-300 relative z-10">
                      {course.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed flex-grow relative z-10">
                      {course.description}
                    </p>

                    {/* Premium Arrow with Motion */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      className="mt-8 flex items-center gap-3 text-sm font-bold relative z-10 group-hover:text-foreground transition-colors"
                      style={{ color: course.color }}
                    >
                      Discover More
                      <motion.span
                        animate={{ x: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-lg"
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

        {/* Premium CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-20"
        >
          <motion.div
            whileHover={{ scale: 1.08, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block relative group"
          >
            <div className="absolute -inset-1 gradient-neon opacity-70 rounded-3xl blur-xl group-hover:opacity-100 transition duration-500"></div>
            <button className="relative gradient-3d text-white px-14 py-6 rounded-3xl font-bold text-lg shadow-metallic hover:shadow-neon transition-all duration-500 border border-primary/30">
              View All Programs & Branches
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CoursesSection;
