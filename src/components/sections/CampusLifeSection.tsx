import { motion } from "framer-motion";
import { Music, Trophy, Users, Palette, BookOpen, Heart } from "lucide-react";
import videoThumbnail from "@/assets/video-thumbnail.png";

const CampusLifeSection = () => {
  const activities = [
    { icon: Music, title: "Cultural Fests", description: "Annual celebrations with performances and competitions" },
    { icon: Trophy, title: "Sports Events", description: "Inter-college tournaments and athletics" },
    { icon: Users, title: "Student Clubs", description: "40+ clubs for diverse interests" },
    { icon: Palette, title: "Art & Design", description: "Creative workshops and exhibitions" },
    { icon: BookOpen, title: "Technical Events", description: "Hackathons, seminars, and workshops" },
    { icon: Heart, title: "Social Initiatives", description: "Community service and volunteering" }
  ];

  return (
    <section id="campus" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background z-10" />
        <video
          className="w-full h-full object-cover opacity-30"
          autoPlay
          loop
          muted
          playsInline
          poster={videoThumbnail}
        >
          <source src="/videos/about-nri.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-20 py-32">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Beyond Academics</span>
            <h2 className="text-5xl md:text-6xl font-black mt-4 mb-6 text-white">
              Experience a Vibrant
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mt-2">
                Campus Culture
              </span>
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
              Where learning meets fun. Discover a world of opportunities, friendships, and memories.
            </p>
          </motion.div>

          {/* Activities Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-card/40 backdrop-blur-md border border-border rounded-2xl p-8 hover:border-primary/50 transition-all hover:shadow-[0_0_30px_hsl(217_91%_60%_/_0.3)] group"
                >
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-primary transition-colors">
                    {activity.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    {activity.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Quote */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-20 text-center"
          >
            <div className="inline-block bg-card/40 backdrop-blur-md border border-border rounded-2xl p-12 max-w-4xl">
              <p className="text-2xl md:text-3xl font-light text-white/90 italic leading-relaxed">
                "College is not just about grades. It's about experiences, friendships, and discovering who you are."
              </p>
              <div className="mt-6 text-secondary font-semibold">— Campus Life Committee</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CampusLifeSection;
