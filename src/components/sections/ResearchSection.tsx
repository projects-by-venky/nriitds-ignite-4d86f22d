import { motion } from "framer-motion";
import { Microscope, FlaskConical, BookOpen, Lightbulb, Award, TrendingUp } from "lucide-react";

const ResearchSection = () => {
  const projects = [
    {
      icon: FlaskConical,
      title: "AI & Machine Learning Lab",
      description: "Advanced research in neural networks, deep learning, and intelligent systems.",
      image: "/placeholder.svg",
      status: "Active"
    },
    {
      icon: Microscope,
      title: "Robotics & Automation",
      description: "Developing autonomous systems and industrial automation solutions.",
      image: "/placeholder.svg",
      status: "Active"
    },
    {
      icon: Lightbulb,
      title: "IoT Innovation Center",
      description: "Smart city solutions and connected device ecosystems.",
      image: "/placeholder.svg",
      status: "Active"
    },
    {
      icon: BookOpen,
      title: "Data Science Research",
      description: "Big data analytics, predictive modeling, and business intelligence.",
      image: "/placeholder.svg",
      status: "Active"
    }
  ];

  const stats = [
    { value: "150+", label: "Research Papers Published" },
    { value: "25+", label: "Ongoing Projects" },
    { value: "50+", label: "Industry Collaborations" }
  ];

  return (
    <section id="research" className="section-padding bg-gradient-subtle relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary/10 rounded-full blur-[100px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Innovation Hub</span>
            <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Research & Innovation
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Pushing the boundaries of technology through cutting-edge research and groundbreaking innovation.
            </p>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-3 gap-6 mb-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-all group"
              >
                <div className="text-4xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Projects Horizontal Scroll */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex overflow-x-auto gap-6 pb-6 scroll-smooth hide-scrollbar snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {projects.map((project, index) => {
                const Icon = project.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                    className="flex-shrink-0 w-80 snap-center group"
                  >
                    <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl overflow-hidden h-full hover:border-primary/50 transition-all hover:shadow-[0_0_30px_hsl(217_91%_60%_/_0.3)]">
                      {/* Image */}
                      <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 rounded-full bg-secondary/20 backdrop-blur-md text-secondary text-xs font-semibold border border-secondary/30">
                            {project.status}
                          </span>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Icon className="w-20 h-20 text-primary/40 group-hover:scale-110 transition-transform" />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {project.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mt-16"
          >
            <button className="px-8 py-4 bg-primary text-white rounded-xl font-semibold shadow-[0_0_30px_hsl(217_91%_60%_/_0.4)] hover:shadow-[0_0_40px_hsl(217_91%_60%_/_0.6)] hover:scale-105 transition-all">
              View All Research Projects
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ResearchSection;
