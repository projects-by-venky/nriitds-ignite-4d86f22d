import { motion } from "framer-motion";
import { Award, Target, Eye, Heart, Users, TrendingUp } from "lucide-react";

const AboutSection = () => {
  const values = [
    {
      icon: Award,
      title: "Excellence",
      description: "Committed to delivering the highest quality education and fostering academic brilliance.",
    },
    {
      icon: Target,
      title: "Innovation",
      description: "Embracing cutting-edge technology and methodologies for modern learning.",
    },
    {
      icon: Eye,
      title: "Vision",
      description: "Creating future leaders who will make a positive impact on society.",
    },
    {
      icon: Heart,
      title: "Integrity",
      description: "Upholding ethical values and building character alongside achievement.",
    },
  ];

  const features = [
    { icon: Users, title: "100K+ Students", description: "Across all branches and programs" },
    { icon: Award, title: "NAAC A+ Accredited", description: "Recognized for quality education" },
    { icon: TrendingUp, title: "95% Placement", description: "Industry-leading placement record" },
  ];

  return (
    <section id="about" className="section-padding bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-header"
          >
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">About NRI Institutions</span>
            <h2 className="section-title">Building the Future, Engineer by Engineer</h2>
            <p className="section-subtitle">
              A unified digital ecosystem connecting Engineering, Management, Pharmacy, Architecture, and more under one seamless experience.
            </p>
          </motion.div>

          {/* Video Showcase Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid lg:grid-cols-2 gap-12 items-center mb-20"
          >
            {/* Left: Introduction */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className="text-3xl font-bold mb-4 bg-gradient-corporate bg-clip-text text-transparent">
                  Experience NRI Institutions
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  Discover our state-of-the-art campus, cutting-edge facilities, and vibrant academic community. Watch how we're shaping the future of education through innovation and excellence.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <span className="text-sm text-muted-foreground">World-Class Infrastructure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <span className="text-sm text-muted-foreground">Industry Partnerships</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <span className="text-sm text-muted-foreground">Innovation Hub</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: Video */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-corporate opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500 rounded-2xl" />
              <div className="relative rounded-2xl overflow-hidden border-2 border-accent/30 shadow-elegant group-hover:border-accent/60 transition-all duration-500">
                <video
                  className="w-full h-auto"
                  controls
                  poster="/placeholder.svg"
                  preload="metadata"
                >
                  <source src="/videos/about-nri.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              {/* Decorative corner accents */}
              <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-accent opacity-60" />
              <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-accent opacity-60" />
              <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-accent opacity-60" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-accent opacity-60" />
            </motion.div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Left: Story Cards */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="card-professional p-8 card-hover-lift"
              >
                <h3 className="text-2xl font-bold mb-4">Who We Are</h3>
                <p className="text-muted-foreground leading-relaxed">
                  NRI Institutions stands as a beacon of excellence in education, bringing together multiple disciplines under one unified platform. We're not just a college—we're a connected campus serving over 100,000 students, faculty, and staff.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="card-professional p-8 card-hover-lift"
              >
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To empower every mind with knowledge, skills, and values that prepare them for global challenges. We create an inclusive environment where innovation thrives and dreams become reality.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="card-professional p-8 card-hover-lift"
              >
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To be recognized globally as an institution that transforms lives through education, research, and innovation—building a better tomorrow for all.
                </p>
              </motion.div>
            </div>

            {/* Right: Values Grid */}
            <div className="space-y-6">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-2xl font-bold mb-6"
              >
                Our Core Values
              </motion.h3>
              
              <div className="grid sm:grid-cols-2 gap-6">
                {values.map((value, index) => {
                  const Icon = value.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="card-professional p-6 card-hover-lift"
                    >
                      <div className="w-12 h-12 rounded-lg bg-gradient-corporate flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-lg font-bold mb-2">{value.title}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {value.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Features Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="gradient-corporate rounded-2xl p-8 md:p-12"
          >
            <div className="grid md:grid-cols-3 gap-8 text-white text-center">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Icon className="w-12 h-12 mx-auto mb-4 opacity-90" />
                    <div className="text-3xl font-bold mb-2">{feature.title}</div>
                    <div className="text-white/80 text-sm">{feature.description}</div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;