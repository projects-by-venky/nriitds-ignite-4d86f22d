import { Award, Target, Eye, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
      description: "Embracing cutting-edge technology and AI-driven methodologies for modern learning.",
    },
    {
      icon: Eye,
      title: "Vision",
      description: "Creating future leaders who will make a positive impact on society and industry.",
    },
    {
      icon: Heart,
      title: "Integrity",
      description: "Upholding ethical values and building character alongside academic achievement.",
    },
  ];

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">About Us</span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">
              Building Tomorrow's Leaders
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              NRIITDS stands at the forefront of educational excellence, combining traditional values with modern innovation.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="gradient-card rounded-3xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-foreground mb-4">Our Story</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Founded with a vision to revolutionize education, NRIITDS has been at the forefront of 
                  academic innovation for years. We blend traditional teaching wisdom with AI-powered 
                  learning tools to create an unparalleled educational experience.
                </p>
              </div>
              <div className="gradient-card rounded-3xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-foreground mb-4">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To empower students with knowledge, skills, and values that prepare them for global 
                  challenges. We strive to create an inclusive environment where innovation thrives and 
                  every student reaches their full potential.
                </p>
              </div>
            </div>

            {/* Right Column - Values Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <Card 
                  key={index} 
                  className="gradient-card border-0 hover:shadow-accent transition-all duration-300 hover:-translate-y-1"
                >
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 shadow-glow">
                      <value.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h4 className="text-lg font-bold text-foreground mb-2">{value.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="gradient-primary rounded-3xl p-8 text-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">15+</div>
                <div className="text-white/80 text-sm">Years of Excellence</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">200+</div>
                <div className="text-white/80 text-sm">Expert Faculty</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-white/80 text-sm">Industry Partners</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">10K+</div>
                <div className="text-white/80 text-sm">Alumni Network</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
