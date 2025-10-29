import { motion } from "framer-motion";
import { Building2, TrendingUp, Users, Award, Briefcase, Target } from "lucide-react";

const PlacementsSection = () => {
  const stats = [
    { icon: TrendingUp, value: "95%", label: "Placement Rate" },
    { icon: Users, value: "1,500+", label: "Students Placed" },
    { icon: Briefcase, value: "200+", label: "Recruiting Companies" },
    { icon: Award, value: "₹12 LPA", label: "Average Package" }
  ];

  const topRecruiters = [
    "Google", "Microsoft", "Amazon", "TCS", "Infosys", "Wipro", 
    "Cognizant", "Accenture", "Deloitte", "IBM", "Oracle", "Capgemini",
    "Tech Mahindra", "HCL", "L&T Infotech", "Mindtree"
  ];

  return (
    <section id="placements" className="section-padding bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-40 right-10 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-40 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]" />
      
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
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Career Success</span>
            <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Industry-Leading Placements
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Connecting talent with opportunity. Our students are making their mark at the world's leading companies.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-all group hover:shadow-[0_0_30px_hsl(217_91%_60%_/_0.2)]"
                >
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-4xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm font-medium">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>

          {/* Top Recruiters */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-md border border-border rounded-3xl p-12"
          >
            <div className="flex items-center justify-center gap-3 mb-10">
              <Building2 className="w-8 h-8 text-primary" />
              <h3 className="text-3xl font-black text-foreground">Top Recruiters</h3>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {topRecruiters.map((company, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-background/50 backdrop-blur-sm border border-border rounded-xl p-6 flex items-center justify-center hover:border-primary/50 transition-all hover:shadow-[0_0_20px_hsl(217_91%_60%_/_0.2)] group"
                >
                  <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors text-center">
                    {company}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center mt-12"
            >
              <button className="px-8 py-4 bg-primary text-white rounded-xl font-semibold shadow-[0_0_30px_hsl(217_91%_60%_/_0.4)] hover:shadow-[0_0_40px_hsl(217_91%_60%_/_0.6)] hover:scale-105 transition-all">
                View Placement Statistics
              </button>
            </motion.div>
          </motion.div>

          {/* Training & Development */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 grid md:grid-cols-3 gap-6"
          >
            {[
              { icon: Target, title: "Pre-Placement Training", desc: "Comprehensive skill development programs" },
              { icon: Users, title: "Mock Interviews", desc: "Industry experts conduct practice sessions" },
              { icon: Briefcase, title: "Career Counseling", desc: "Personalized guidance for career paths" }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-card/30 backdrop-blur-sm border border-border rounded-2xl p-6 hover:border-primary/50 transition-all"
                >
                  <Icon className="w-10 h-10 text-primary mb-4" />
                  <h4 className="text-lg font-bold mb-2">{item.title}</h4>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PlacementsSection;
